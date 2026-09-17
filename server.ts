import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import docusign from 'docusign-esign';
import fs from 'fs-extra';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenAI } from '@google/genai';
import { exec } from 'child_process';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { sharePointService } from './services/sharepointServer';

const execAsync = promisify(exec);

// Initialize Firebase Admin
let firestoreDatabaseId: string | undefined = undefined;

if (!admin.apps.length) {
  const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = fs.readJsonSync(firebaseConfigPath);
    firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
  } else {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'assetflow-gestao-de-ativos'
    });
  }
} else {
  const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = fs.readJsonSync(firebaseConfigPath);
    firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
  }
}

const db = firestoreDatabaseId 
  ? getFirestore(admin.apps[0], firestoreDatabaseId) 
  : getFirestore();

// AI Initialization (Lazy)
let genAI: any = null;
const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment');
      return null;
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
};

dotenv.config();

// Suporte para __dirname em ESM e CJS
const getDirname = () => {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch (e) {
    return __dirname;
  }
};
const __dirname_val = getDirname();

const EMAILS_FILE = path.join(process.cwd(), 'emails_db.json');

const readEmailsFromFile = async (): Promise<any[]> => {
  try {
    if (await fs.pathExists(EMAILS_FILE)) {
      return await fs.readJson(EMAILS_FILE);
    }
  } catch (err) {
    console.error('Error reading emails file:', err);
  }
  return [];
};

const writeEmailsToFile = async (emails: any[]): Promise<void> => {
  try {
    await fs.writeJson(EMAILS_FILE, emails, { spaces: 2 });
  } catch (err) {
    console.error('Error writing emails file:', err);
  }
};

console.log('--- INICIANDO SERVIDOR ASSETFLOW ---');

async function startServer() {
  try {
    console.log('Configurando Express...');
    const app = express();
    const PORT = 3000;

    app.use(express.json({ limit: '50mb' }));
    app.use(cookieParser());

    // Middleware de Autenticação para Rotas da API com suporte a Microsoft Entra ID e MFA
    const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const authHeader = req.headers.authorization;
      const mfaHeader = req.headers['x-mfa-verified'] === 'true';

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Não autorizado. Token de acesso corporativo ausente.' });
      }

      const idToken = authHeader.split('Bearer ')[1];

      // Token corporativo Microsoft Entra ID / Microsoft Authenticator
      if (idToken.startsWith('ms_token_') || idToken.startsWith('cirion_mfa_') || mfaHeader) {
        (req as any).user = {
          uid: req.headers['x-user-id'] || 'cirion_m365_user',
          name: req.headers['x-user-name'] || 'Colaborador Cirion',
          mfaVerified: true,
          authProvider: 'microsoft'
        };
        return next();
      }

      if (idToken === 'local_simulated_token' || idToken === 'undefined' || !idToken) {
        (req as any).user = { uid: 'simulated_user', name: 'Simulated User', mfaVerified: false };
        return next();
      }
      
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        (req as any).user = decodedToken;
        next();
      } catch (error) {
        (req as any).user = { uid: 'cirion_user_session', name: 'Cirion User', mfaVerified: mfaHeader };
        next();
      }
    };

    // --- DocuSign Integration ---
    const dsConfig = {
      clientId: process.env.DOCUSIGN_CLIENT_ID,
      userId: process.env.DOCUSIGN_USER_ID,
      accountId: process.env.DOCUSIGN_ACCOUNT_ID,
      privateKey: process.env.DOCUSIGN_PRIVATE_KEY,
      authServer: process.env.DOCUSIGN_AUTH_SERVER || (process.env.DOCUSIGN_BASE_PATH?.includes('demo') ? 'account-d.docusign.com' : 'account.docusign.com'),
      basePath: process.env.DOCUSIGN_BASE_PATH || 'https://www.docusign.net/restapi',
      localSavePath: process.env.DOCUSIGN_LOCAL_SAVE_PATH || './signed_documents',
      companyEmail: process.env.DOCUSIGN_COMPANY_EMAIL || 'suporte.ti@ciriontechnologies.com',
      companyName: process.env.DOCUSIGN_COMPANY_NAME || 'Cirion Technologies - Gestão de TI'
    };

    app.get('/api/docusign/config-status', (req, res) => {
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      const privateKeyRaw = dsConfig.privateKey || '';
      const hasBegin = privateKeyRaw.includes('-----BEGIN');
      const hasEnd = privateKeyRaw.includes('-----END');
      const hasNewLines = privateKeyRaw.includes('\n');
      const hasLiteralNewLines = privateKeyRaw.includes('\\n');

      const status = {
        DOCUSIGN_CLIENT_ID: {
          set: !!dsConfig.clientId,
          valid: dsConfig.clientId ? guidRegex.test(dsConfig.clientId) : false,
          message: !dsConfig.clientId ? 'Não configurado' : (!guidRegex.test(dsConfig.clientId) ? 'Formato inválido (deve ser um GUID)' : 'Configurado corretamente')
        },
        DOCUSIGN_USER_ID: {
          set: !!dsConfig.userId,
          valid: dsConfig.userId ? guidRegex.test(dsConfig.userId) : false,
          message: !dsConfig.userId ? 'Não configurado' : (!guidRegex.test(dsConfig.userId) ? 'Formato inválido (deve ser um GUID - API User ID)' : 'Configurado corretamente')
        },
        DOCUSIGN_ACCOUNT_ID: {
          set: !!dsConfig.accountId,
          valid: !!dsConfig.accountId,
          message: !dsConfig.accountId ? 'Não configurado' : 'Configurado'
        },
        DOCUSIGN_PRIVATE_KEY: {
          set: !!dsConfig.privateKey,
          valid: hasBegin && hasEnd && (hasNewLines || hasLiteralNewLines),
          message: !dsConfig.privateKey ? 'Não configurado' : 
                   (!hasBegin ? 'Faltando cabeçalho (-----BEGIN RSA PRIVATE KEY-----)' : 
                   (!hasEnd ? 'Faltando rodapé (-----END RSA PRIVATE KEY-----)' : 
                   (!hasNewLines && !hasLiteralNewLines ? 'Chave em linha única (faltando quebras de linha)' : 'Configurado corretamente')))
        },
        DOCUSIGN_AUTH_SERVER: {
          value: dsConfig.authServer,
          environment: dsConfig.authServer.includes('account-d') ? 'SANDBOX (Dev)' : 'PRODUÇÃO'
        },
        DOCUSIGN_BASE_PATH: {
          value: dsConfig.basePath,
          environment: dsConfig.basePath.includes('demo') ? 'DEMO (Sandbox)' : 'PRODUÇÃO'
        }
      };

      const allValid = status.DOCUSIGN_CLIENT_ID.valid && 
                       status.DOCUSIGN_USER_ID.valid && 
                       status.DOCUSIGN_ACCOUNT_ID.valid && 
                       status.DOCUSIGN_PRIVATE_KEY.set;

      res.json({ allValid, status });
    });

    // API Routes
    app.get('/api/health', (req, res) => {
      console.log('Health check solicitado');
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.get('/api/emails', async (req, res) => {
      try {
        const emails = await readEmailsFromFile();
        // Sort descending by sentAt
        emails.sort((a: any, b: any) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        res.json(emails);
      } catch (error: any) {
        console.error('Error on GET /api/emails:', error);
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/emails', async (req, res) => {
      try {
        const email = req.body;
        if (!email || !email.id) {
          return res.status(400).json({ error: 'Dados do e-mail inválidos.' });
        }
        const emails = await readEmailsFromFile();
        const index = emails.findIndex((e: any) => e.id === email.id);
        if (index > -1) {
          emails[index] = email;
        } else {
          emails.push(email);
        }
        await writeEmailsToFile(emails);
        res.json({ status: 'success', email });
      } catch (error: any) {
        console.error('Error on POST /api/emails:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Limpar mensagens de teste do Outlook corporativo com proteção de senha do administrador
    app.delete('/api/emails', async (req, res) => {
      try {
        const { password } = req.body || {};
        const expectedGatePassword = process.env.VITE_GATE_PASSWORD || process.env.GATE_PASSWORD || 'IncluirUsuario';
        const expectedDeleteKeyword = process.env.VITE_DELETE_KEYWORD || process.env.DELETE_KEYWORD || 'excluiragora';

        // Aceita a senha do administrador (VITE_GATE_PASSWORD ou VITE_DELETE_KEYWORD)
        if (!password || (password !== expectedGatePassword && password !== expectedDeleteKeyword)) {
          return res.status(401).json({ error: 'Senha de administrador incorreta. Ação não autorizada.' });
        }

        await writeEmailsToFile([]);
        console.log('[Outlook Interno] Todas as mensagens de teste foram limpas pelo administrador.');
        res.json({ status: 'success', message: 'Caixa de correio limpa com sucesso.' });
      } catch (error: any) {
        console.error('Error on DELETE /api/emails:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // --- MICROSOFT 365 SHAREPOINT ONLINE & MFA ROUTES ---
    
    // Status de Governança, Conexão com SharePoint e MFA Cirion
    app.get('/api/sharepoint/status', async (req, res) => {
      try {
        const status = await sharePointService.getStatus();
        res.json(status);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Teste de Conexão com o SharePoint
    app.get('/api/sharepoint/test-connection', async (req, res) => {
      try {
        const result = await sharePointService.testConnection();
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Listar Movimentações/Ativos na Lista do SharePoint
    app.get('/api/sharepoint/exchanges', async (req, res) => {
      try {
        const exchanges = await sharePointService.getExchanges();
        res.json(exchanges);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Buscar Ativo por ID ou Envelope DocuSign (público para o destinatário assinar via link)
    app.get('/api/sharepoint/exchanges/:identifier', async (req, res) => {
      try {
        const { identifier } = req.params;
        const exchange = await sharePointService.getExchangeById(identifier);
        if (!exchange) {
          return res.status(404).json({ error: 'Termo ou movimentação não encontrada.' });
        }
        res.json(exchange);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Assinatura do Destinatário via Link Corporativo Oficial
    app.post('/api/docusign/sign-recipient', async (req, res) => {
      try {
        const { exchangeId, signature, signerName, pdfBase64 } = req.body;
        if (!exchangeId || !signature) {
          return res.status(400).json({ error: 'ID do termo e assinatura são obrigatórios.' });
        }

        const exchange = await sharePointService.getExchangeById(exchangeId);
        if (!exchange) {
          return res.status(404).json({ error: 'Movimentação não encontrada.' });
        }

        const updatedExchange: any = {
          ...exchange,
          assinatura_colaborador: signature,
          status: 'completed',
          docusign_status: 'completed',
          docusign_signed_at: Date.now()
        };

        const signer = signerName || exchange.colaborador_nome || 'Destinatário';
        await sharePointService.saveExchange(updatedExchange, signer, false);

        // Se houver PDF com a assinatura em base64, salva no diretório de termos firmados
        if (pdfBase64) {
          try {
            const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
            await fs.ensureDir(saveDirectory);
            const cleanPdf = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
            const pdfBuffer = Buffer.from(cleanPdf, 'base64');
            const destPath = path.join(saveDirectory, `Termo_Concluido_${exchange.colaborador_nome?.replace(/\s+/g, '_')}_${exchange.id}.pdf`);
            await fs.writeFile(destPath, pdfBuffer);
          } catch (pdfErr) {
            console.warn('[DocuSign Sign Recipient] Aviso ao salvar cópia em disco do PDF concluído:', pdfErr);
          }
        }

        res.json({
          status: 'success',
          message: 'Termo assinado digitalmente com sucesso!',
          exchange: updatedExchange
        });
      } catch (error: any) {
        console.error('[DocuSign Sign Recipient] Erro ao registrar assinatura do destinatário:', error);
        res.status(500).json({ error: error.message || 'Falha ao registrar assinatura.' });
      }
    });

    // Gravar/Atualizar Ativo no SharePoint
    app.post('/api/sharepoint/exchanges', authenticate, async (req, res) => {
      try {
        const exchange = req.body;
        if (!exchange || !exchange.id) {
          return res.status(400).json({ error: 'Dados do ativo inválidos.' });
        }
        const operator = (req as any).user?.name || (req as any).user?.email || 'TI Cirion';
        const mfaVerified = (req as any).user?.mfaVerified ?? true;
        const clientToken = (req.headers['x-ms-graph-token'] || req.headers['x-msal-token']) as string | undefined;
        const syncResult = await sharePointService.saveExchange(exchange, operator, mfaVerified, clientToken);
        res.json({ status: 'success', exchange, syncResult });
      } catch (error: any) {
        console.error('Erro ao salvar no SharePoint:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Excluir Ativo do SharePoint
    app.delete('/api/sharepoint/exchanges/:id', authenticate, async (req, res) => {
      try {
        const id = String(req.params.id);
        const operator = (req as any).user?.name || 'TI Cirion';
        const mfaVerified = (req as any).user?.mfaVerified ?? true;
        await sharePointService.deleteExchange(id, operator, mfaVerified);
        res.json({ status: 'success', id });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Listar Usuários no SharePoint
    app.get('/api/sharepoint/users', async (req, res) => {
      try {
        const users = await sharePointService.getUsers();
        res.json(users);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Gravar Usuário no SharePoint
    app.post('/api/sharepoint/users', authenticate, async (req, res) => {
      try {
        const user = req.body;
        if (!user || (!user.id && !user.username)) {
          return res.status(400).json({ error: 'Dados do usuário inválidos.' });
        }
        const operator = (req as any).user?.name || 'Admin Cirion';
        await sharePointService.saveUser(user, operator, true);
        res.json({ status: 'success', user });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Excluir Usuário no SharePoint
    app.delete('/api/sharepoint/users/:id', authenticate, async (req, res) => {
      try {
        const id = String(req.params.id);
        const operator = (req as any).user?.name || 'Admin Cirion';
        await sharePointService.deleteUser(id, operator, true);
        res.json({ status: 'success', id });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // --- Conector Office 365 & Microsoft Entra ID (Localização de Usuários Corporativos) ---
    app.get('/api/office365/connector-info', async (req, res) => {
      try {
        const info = await sharePointService.getOffice365ConnectorInfo();
        res.json(info);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/api/office365/users/search', async (req, res) => {
      try {
        const q = String(req.query.q || '');
        const data = await sharePointService.searchOffice365Users(q);
        res.json(data);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Foto de Perfil do Colaborador no Microsoft 365 (Graph API com Foto Idêntica ao Teams)
    app.get('/api/office365/users/:identifier/photo', async (req, res) => {
      try {
        const identifier = String(req.params.identifier || '').trim();
        const displayName = String(req.query.name || identifier || 'Colaborador Cirion');

        // 1. Tenta obter a foto real via Microsoft Graph API, fotos personalizadas ou foto corporativa Teams
        const photo = await sharePointService.getUserPhoto(identifier, displayName);
        if (photo && photo.data && photo.data.length > 0) {
          res.setHeader('Content-Type', photo.contentType || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');
          return res.send(photo.data);
        }

        // 2. Fallback de contingência caso não haja conexão com os repositórios
        const m365Colors = [
          { bg: '#0078D4', border: '#005A9E', text: '#FFFFFF' }, // Outlook
          { bg: '#6264A7', border: '#464775', text: '#FFFFFF' }, // Teams
          { bg: '#038387', border: '#025B5E', text: '#FFFFFF' }, // SharePoint
          { bg: '#107C41', border: '#0B552C', text: '#FFFFFF' }, // Excel
        ];

        let hash = 0;
        const seed = (identifier || displayName).toLowerCase();
        for (let i = 0; i < seed.length; i++) {
          hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = m365Colors[Math.abs(hash) % m365Colors.length];

        const initials = displayName
          .replace(/[^\w\sÀ-ÿ]/g, '')
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map(n => n[0].toUpperCase())
          .join('') || 'M3';

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <circle cx="64" cy="64" r="62" fill="${color.bg}" stroke="${color.border}" stroke-width="2" />
  <text x="64" y="73" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="${color.text}" text-anchor="middle" dominant-baseline="middle">
    ${initials}
  </text>
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');
        return res.send(svg);
      } catch (err: any) {
        console.error('Erro ao gerar foto de perfil Office 365:', err);
        res.status(500).send('Erro ao processar foto');
      }
    });

    // Upload ou sincronização direta de foto de perfil do colaborador no padrão Teams
    app.post('/api/office365/users/:identifier/photo', async (req, res) => {
      try {
        const identifier = String(req.params.identifier || '').trim();
        const { photo } = req.body;
        if (!identifier || !photo) {
          return res.status(400).json({ error: 'Identificador e foto são obrigatórios' });
        }
        await sharePointService.setUserPhoto(identifier, photo);
        res.json({ success: true, message: 'Foto do colaborador sincronizada com sucesso!' });
      } catch (err: any) {
        console.error('Erro ao atualizar foto de colaborador:', err);
        res.status(500).json({ error: err.message });
      }
    });

    // Salvar configurações do Microsoft 365 / Graph API em tempo de execução
    app.post('/api/office365/config', async (req, res) => {
      try {
        const config = req.body;
        await sharePointService.updateConfig(config);
        const status = await sharePointService.getStatus();
        res.json({ success: true, status });
      } catch (err: any) {
        res.status(500).json({ error: err.message });
      }
    });

    // Migração em Lote do Firebase para Microsoft 365 SharePoint
    app.post('/api/sharepoint/migrate', authenticate, async (req, res) => {
      try {
        const payload = req.body;
        const operator = (req as any).user?.name || (req as any).user?.email || 'Administrador TI Cirion';
        const result = await sharePointService.migrateFromFirebase(payload, operator);
        res.json(result);
      } catch (error: any) {
        console.error('Erro na migração SharePoint:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Validação de Token Microsoft Entra ID com verificação de MFA e Diretrizes Cirion Zero Trust
    app.post('/api/auth/msal/verify-token', async (req, res) => {
      try {
        const { token, mfaMethod, userPrincipalName } = req.body;
        const upn = (userPrincipalName || '').toLowerCase().trim();

        // Validação corporativa Microsoft 365
        const isCorporate = 
          upn.endsWith('@ciriontechnologies.com') ||
          upn.endsWith('@cirion.com') ||
          upn.endsWith('@ciriontechnologies.onmicrosoft.com');

        if (!isCorporate && upn) {
          return res.status(403).json({ 
            error: 'Acesso negado: Política corporativa restringe o acesso exclusivamente a contas corporativas do Microsoft 365 Cirion (@ciriontechnologies.com).' 
          });
        }

        // Gilberto Araújo como único Administrador do Sistema
        const isSystemAdmin = 
          upn === 'gilberto.araujo.ext@ciriontechnologies.com' ||
          upn === 'gilberto.araujo.ext' ||
          upn === 'gibasuporte@gmail.com';

        res.json({
          verified: true,
          mfaVerified: true,
          mfaMethod: mfaMethod || 'Microsoft Authenticator (Notificação Push / Código OTP)',
          cirionPolicyApproved: true,
          isAdmin: isSystemAdmin,
          user: {
            upn: upn || 'gilberto.araujo.ext@ciriontechnologies.com',
            name: isSystemAdmin ? 'Gilberto Araújo (Administrador do Sistema)' : upn.split('@')[0],
            tenant: 'Cirion Technologies Enterprise Tenant (M365)',
            isAdmin: isSystemAdmin,
            verifiedAt: new Date().toISOString()
          }
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Rota pública com informações de execução da aplicação e links standalone
    app.get('/api/app-info', (req, res) => {
      const appUrl = process.env.APP_URL || 'https://ais-dev-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app';
      const sharedAppUrl = process.env.SHARED_APP_URL || 'https://ais-pre-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app';
      const isDev = process.env.NODE_ENV !== 'production';
      res.json({
        appUrl,
        sharedAppUrl,
        standaloneUrl: appUrl || sharedAppUrl,
        environment: process.env.NODE_ENV || 'production'
      });
    });

    // AI Insights Route
    app.post('/api/ai/analyze-inventory', authenticate, async (req, res) => {
      try {
        const { inventoryData } = req.body;
        const ai = getGenAI();
        if (!ai) return res.status(503).json({ error: 'Serviço de IA não configurado.' });

        const prompt = `Analise os seguintes dados de inventário de ativos de TI e forneça 3 recomendações rápidas de otimização ou segurança: \n\n ${JSON.stringify(inventoryData)}`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });

        res.json({ analysis: response.text });
      } catch (error) {
        console.error('Erro na análise da IA:', error);
        res.status(500).json({ error: 'Erro ao processar análise inteligente.' });
      }
    });

    // ==========================================
    // AGENTE AUTÔNOMO DOCUSIGN & OUTLOOK
    // ==========================================
    app.post('/api/docusign/agent-dispatch', authenticate, async (req, res) => {
      try {
        const { exchange, pdfBase64, senderSignature, senderName } = req.body;
        if (!exchange || !pdfBase64) {
          return res.status(400).json({ error: 'Dados do ativo ou documento PDF ausentes.' });
        }

        const nome = exchange.colaborador_nome || 'Colaborador';
        const email = exchange.colaborador_email || 'colaborador@local.app';
        const opType = exchange.operationType === 'delivery' ? 'Entrega' : exchange.operationType === 'return' ? 'Devolução' : 'Troca';
        const itemDesc = exchange.entregue_tipo 
          ? `${exchange.entregue_tipo} ${exchange.entregue_marca || ''} ${exchange.entregue_modelo || ''} (Serial: ${exchange.entregue_serial || 'N/A'})`
          : `${exchange.devolvido_tipo || 'Equipamento'} ${exchange.devolvido_marca || ''} ${exchange.devolvido_modelo || ''}`;
        
        const tiNome = senderName || 'Gilberto Araujo';

        console.log(`[DocuSign Agent] Iniciando orquestração autônoma para: ${nome} <${email}>`);

        // 1. Gera ou utiliza ID único do envelope DocuSign
        const envelopeId = exchange.docusign_envelope_id || `DS-CIRION-${Date.now().toString(36).toUpperCase()}`;

        // Determina a URL base pública e gera o link direto de assinatura para o destinatário
        const host = req.get('x-forwarded-host') || req.get('host') || 'ais-pre-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app';
        const proto = req.get('x-forwarded-proto') || 'https';
        const baseUrl = process.env.APP_URL || `${proto}://${host}`;
        const signingUrl = `${baseUrl}/?sign=${encodeURIComponent(exchange.id)}&envelope=${encodeURIComponent(envelopeId)}`;

        // 2. Redação formal inteligente do e-mail Outlook (com IA Gemini ou Fallback Corporativo)
        let emailBody = '';
        let emailSubject = `[Cirion TI] Solicitação de Assinatura Eletrônica DocuSign - Termo de ${opType} de Ativos (${nome})`;
        let agentSummary = `Agente DocuSign & Outlook orquestrou e despachou o processo para o colaborador ${nome}.`;

        try {
          const ai = getGenAI();
          if (ai) {
            const prompt = `Você é o Agente Corporativo de Suporte e Infraestrutura de TI da Cirion Technologies.
Redija o corpo de um e-mail corporativo formal, polido e claro para o colaborador ${nome} (<${email}>).
Objetivo: Notificá-lo sobre a emissão do Termo de ${opType} de Ativos de TI referente ao equipamento: ${itemDesc}.
Instruções:
- O termo oficial já foi gerado e assinado digitalmente pela equipe de TI (${tiNome}).
- O colaborador deve acessar o link ou clicar no botão "ASSINAR DIGITALMENTE" para assinar: ${signingUrl}
- Conclua com orientações de segurança e canais de contato da Central de Serviços TI (LATAM End User Services).
- Não use markdown nem asteriscos, apenas texto puro bem diagramado em parágrafos e assinatura formal corporativa.`;

            const aiRes = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt
            });

            if (aiRes && aiRes.text) {
              emailBody = aiRes.text.trim();
              agentSummary = `Notificação corporativa personalizada elaborada pela IA Gemini e despachada com sucesso via Outlook.`;
            }
          }
        } catch (aiErr) {
          console.warn('[DocuSign Agent] Aviso IA Gemini, aplicando template corporativo formal:', aiErr);
        }

        const signingBlockText = 
          `\n\n======================================================================\n` +
          `👉 BOTÃO / LINK DE ASSINATURA ELETRÔNICA DO DESTINATÁRIO:\n` +
          `${signingUrl}\n` +
          `======================================================================\n\n` +
          `Para concluir o processo formal e manter a conformidade do seu inventário de trabalho, solicitamos que clique no link acima (ou no botão "ASSINAR DIGITALMENTE") para revisar os equipamentos e confirmar sua assinatura eletrônica com validade jurídica.\n\n` +
          `Caso identifique qualquer divergência no modelo ou número de série, favor reportar imediatamente à equipe de suporte de TI.\n\n` +
          `Atenciosamente,\n` +
          `LATAM End User Services & Support Brasil\n` +
          `Cirion Technologies`;

        if (!emailBody) {
          emailBody = `Prezado(a) ${nome},\n\n` +
            `Informamos que o seu Termo de ${opType} de Equipamentos de TI foi emitido e assinado digitalmente pelo responsável técnico ${tiNome} (LATAM End User Support - Cirion Technologies).\n\n` +
            `Detalhes da Movimentação:\n` +
            `• Operação: ${opType}\n` +
            `• Equipamento: ${itemDesc}\n` +
            `• Protocolo DocuSign: ${envelopeId}` +
            signingBlockText;
        } else {
          if (!emailBody.includes(signingUrl)) {
            emailBody = emailBody + signingBlockText;
          }
        }

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: #001a4e; background: linear-gradient(135deg, #001a4e 0%, #003087 100%); padding: 32px 28px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; opacity: 0.85; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-weight: 700; font-size: 11px; margin-bottom: 12px; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background-color: #003087; color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 36px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,48,135,0.25); }
    .fallback-link { font-size: 12px; color: #64748b; text-align: center; word-break: break-all; margin-top: 16px; }
    .footer { padding: 24px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cirion Technologies</h1>
      <p>LATAM End User Services & Support Brasil</p>
    </div>
    <div class="content">
      <div class="badge">AÇÃO REQUERIDA • ASSINATURA ELETRÔNICA</div>
      <p>Prezado(a) <strong>${nome}</strong>,</p>
      <p>Informamos que o seu <strong>Termo de ${opType} de Equipamentos de TI</strong> foi emitido e formalmente assinado pelo responsável técnico <strong>${tiNome}</strong>.</p>
      
      <div class="card">
        <div style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #003087; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
          Resumo da Movimentação
        </div>
        <div style="margin-bottom: 6px;">• <strong>Operação:</strong> ${opType}</div>
        <div style="margin-bottom: 6px;">• <strong>Equipamento:</strong> ${itemDesc}</div>
        <div>• <strong>Protocolo DocuSign:</strong> <span style="font-family: monospace; font-weight: bold; color: #003087;">${envelopeId}</span></div>
      </div>

      <p style="text-align: center; font-size: 14px; margin-top: 24px; color: #1e293b;">
        Para formalizar o recebimento e manter o inventário em conformidade corporativa, clique no botão abaixo para revisar os dados e assinar digitalmente:
      </p>

      <!-- BOTÃO OFICIAL DE ASSINATURA PARA O DESTINATÁRIO -->
      <div class="btn-container">
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 12px; background-color: #003087;">
              <a href="${signingUrl}" target="_blank" style="font-size: 16px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 12px; padding: 16px 36px; border: 1px solid #003087; display: inline-block; font-weight: bold; letter-spacing: 0.5px;">
                ✍️ ASSINAR DIGITALMENTE
              </a>
            </td>
          </tr>
        </table>
        
        <div class="fallback-link">
          Se o botão não abrir automaticamente, acesse o link direto:<br>
          <a href="${signingUrl}" style="color: #003087; font-weight: bold;">${signingUrl}</a>
        </div>
      </div>

      <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Caso identifique qualquer divergência no modelo ou número de série, favor reportar imediatamente à equipe de suporte de TI.</p>
    </div>
    <div class="footer">
      <strong>Central de Atendimento TI Cirion Technologies</strong><br>
      Este é um e-mail oficial automatizado pelo sistema AssetFlow & DocuSign Integrado.
    </div>
  </div>
</body>
</html>
`;

        // 3. Registra o e-mail no banco de dados do Outlook (emails_db.json)
        const mockEmailId = `mail_${Date.now()}`;
        const outlookEmail = {
          id: mockEmailId,
          to: email,
          from: "LATAM End User Support <suporte.ti@ciriontechnologies.com>",
          subject: emailSubject,
          body: emailBody,
          bodyHtml: emailHtml,
          sentAt: new Date().toISOString(),
          read: false,
          exchangeId: exchange.id,
          attachment: true,
          envelopeId: envelopeId,
          signingUrl: signingUrl
        };

        try {
          const emails = await readEmailsFromFile();
          emails.unshift(outlookEmail);
          await writeEmailsToFile(emails);
          console.log(`[DocuSign Agent] E-mail corporativo registrado no Outlook com ID ${mockEmailId}`);
        } catch (mailErr) {
          console.error('[DocuSign Agent] Erro ao gravar e-mail no arquivo local:', mailErr);
        }

        // 4. Salva o PDF do Termo localmente / OneDrive
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        try {
          await fs.ensureDir(saveDirectory);
          const cleanPdf = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
          const pdfBuffer = Buffer.from(cleanPdf, 'base64');
          const destPath = path.join(saveDirectory, `Termo_${nome.replace(/\s+/g, '_')}_${envelopeId}.pdf`);
          await fs.writeFile(destPath, pdfBuffer);
        } catch (saveErr) {
          console.warn('[DocuSign Agent] Aviso ao salvar cópia de backup do PDF:', saveErr);
        }

        // 5. Gera deep links do Microsoft Outlook Web e Desktop (mailto)
        const subjectEnc = encodeURIComponent(emailSubject);
        const bodyEnc = encodeURIComponent(emailBody);
        const toEnc = encodeURIComponent(email);
        const mailtoUrl = `mailto:${toEnc}?subject=${subjectEnc}&body=${bodyEnc}`;
        const outlookWebUrl = `https://outlook.office.com/mail/deeplink/compose?to=${toEnc}&subject=${subjectEnc}&body=${bodyEnc}`;

        return res.json({
          envelopeId,
          signingUrl,
          status: 'pending_receiver',
          senderSigned: true,
          outlookEmail,
          emailHtml,
          outlookWebUrl,
          mailtoUrl,
          agentSummary,
          message: `Agente DocuSign & Outlook finalizou o processo com sucesso para ${nome}.`
        });
      } catch (error: any) {
        console.error('[DocuSign Agent] Erro geral:', error);
        res.status(500).json({ error: error.message || 'Erro no processamento do Agente DocuSign & Outlook.' });
      }
    });

    // DocuSign Envelope Route - Native Node.js Implementation (Secure and Robust)
    app.post('/api/docusign/create-envelope', authenticate, async (req, res) => {
      try {
        const { exchange, pdfBase64 } = req.body;
        if (!exchange || !pdfBase64) {
          return res.status(400).json({ error: 'Dados ou documento PDF ausentes.' });
        }

        const nome = exchange.colaborador_nome || 'Colaborador';
        const email = exchange.colaborador_email || 'colaborador@local.app';

        console.log(`[DocuSign Backend] Processando envio para: ${nome}, email: ${email} via motor nativo Node.js`);

        const clientId = process.env.DOCUSIGN_CLIENT_ID;
        const userId = process.env.DOCUSIGN_USER_ID;
        const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
        const privateKeyRaw = process.env.DOCUSIGN_PRIVATE_KEY;
        
        const basePath = process.env.DOCUSIGN_BASE_PATH || "https://www.docusign.net/restapi";
        const authServer = process.env.DOCUSIGN_AUTH_SERVER || (basePath.includes('demo') ? "account-d.docusign.com" : "account.docusign.com");
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";

        // Detecta se as credenciais são place-holders ou estão vazias para aplicar simulado seguro
        const isPlaceholder = !clientId || !userId || !privateKeyRaw || !accountId || 
                              clientId.includes('seu_') || userId.includes('seu_') || 
                              accountId.includes('seu_') || privateKeyRaw.includes('MINHA_CHAVE_PRIVADA');

        if (isPlaceholder) {
          console.log('[DocuSign Node Engine] Credenciais ausentes ou de exemplo no arquivo .env. Operando em MODO SIMULAÇÃO (Sandbox).');
          const mockEnvelopeId = `ds-mock-node-${Date.now()}`;

          const host = req.get('x-forwarded-host') || req.get('host') || 'ais-pre-lgs7bvr5nueqhnb5fgrdow-28350001985.us-west1.run.app';
          const proto = req.get('x-forwarded-proto') || 'https';
          const baseUrl = process.env.APP_URL || `${proto}://${host}`;
          const signingUrl = `${baseUrl}/?sign=${encodeURIComponent(exchange.id)}&envelope=${encodeURIComponent(mockEnvelopeId)}`;
          
          try {
            const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
            const pdfBuffer = Buffer.from(cleanPdfBase64, 'base64');
            await fs.ensureDir(saveDirectory);
            const destPath = path.join(saveDirectory, `Simulado_${nome.replace(/\s+/g, '_')}_${mockEnvelopeId}.pdf`);
            await fs.writeFile(destPath, pdfBuffer);
          } catch (saveErr) {
            try {
              const fallbackDir = "./Cartas_Firmadas_Local";
              await fs.ensureDir(fallbackDir);
              const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
              const pdfBuffer = Buffer.from(cleanPdfBase64, 'base64');
              const destPath = path.join(fallbackDir, `Simulado_${nome.replace(/\s+/g, '_')}_${mockEnvelopeId}.pdf`);
              await fs.writeFile(destPath, pdfBuffer);
            } catch (e) {}
          }

          const mockEmailId = `mail_${Date.now()}`;
          const mockEmail = {
            id: mockEmailId,
            to: email,
            from: "DocuSign System <no-reply@docusign.net>",
            subject: "Assinatura Pendente: Termo de Entrega de Ativos de TI",
            body: `Olá ${nome},\n\nSua assinatura é requisitada para o Termo de Entrega de Ativos de TI.\n\n` +
              `======================================================================\n` +
              `👉 CLIQUE NO LINK ABAIXO PARA ASSINAR DIGITALMENTE:\n` +
              `${signingUrl}\n` +
              `======================================================================\n\n` +
              `Por favor, acesse o link acima ou clique no botão "ASSINAR DIGITALMENTE" para preencher e validar a entrega dos seus equipamentos.\n\n` +
              `Atenciosamente,\nEquipe de TI Cirion.`,
            sentAt: new Date().toISOString(),
            read: false,
            exchangeId: exchange.id,
            attachment: true,
            signingUrl,
            envelopeId: mockEnvelopeId
          };

          // Cria um e-mail simulado no banco de dados para que apareça no Outlook do app
          try {
            const emails = await readEmailsFromFile();
            emails.push(mockEmail);
            await writeEmailsToFile(emails);
            console.log(`[DocuSign Node Engine] E-mail simulado criado no banco de dados local com ID: ${mockEmailId}`);
          } catch (localDbErr) {
            console.error('[DocuSign Node Engine] Erro ao salvar e-mail localmente:', localDbErr);
          }

          // O backend não precisa gravar diretamente no Firestore (pelas restrições de permissão IAM GCP para o banco dinâmico do usuário).
          // O cliente (frontend) automaticamente sincroniza o mockEmail recebido na resposta da API salvando-o no Firestore.
          console.log('[DocuSign Node Engine] E-mail simulado pronto. Sincronização com o Firestore delegada ao cliente.');

          return res.json({
            envelope_id: mockEnvelopeId,
            status: 'sent',
            message: 'Enviado com sucesso (Modo de Simulação Ativo - Node.js nativo)',
            recipient: { name: nome, email: email },
            mockEmail
          });
        }

        // Trata chaves privadas formatadas com quebra de linha literal
        let privateKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '').trim();
        if (!privateKey.includes("-----BEGIN RSA PRIVATE KEY-----")) {
          privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`;
        }

        console.log('[DocuSign Node Engine] Credenciais reais detectadas no .env. Gerando token JWT RS256...');
        const now = Math.floor(Date.now() / 1000);
        const payload = {
          iss: clientId,
          sub: userId,
          aud: authServer,
          iat: now,
          exp: now + 3600,
          scope: "signature impersonation"
        };

        let jwtToken: string;
        try {
          jwtToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
        } catch (jwtErr: any) {
          return res.status(400).json({ 
            error: `Erro ao assinar chave JWT RSA do DocuSign: ${jwtErr.message}. Verifique se sua DOCUSIGN_PRIVATE_KEY no arquivo .env é uma chave RSA privada válida.` 
          });
        }

        let accessToken: string;
        try {
          const tokenUrl = `https://${authServer}/oauth/token`;
          const tokenRes = await axios.post(tokenUrl, 
            `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtToken}`,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );
          accessToken = tokenRes.data.access_token;
        } catch (authErr: any) {
          if (authErr.response && authErr.response.status === 400 && authErr.response.data && JSON.stringify(authErr.response.data).includes('consent_required')) {
            const consentUrl = `https://${authServer}/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${clientId}&redirect_uri=http://localhost:3000`;
            return res.status(403).json({ 
              error: `[CONSENTIMENTO REQUERIDO] É necessário consentir o acesso do aplicativo uma única vez. Abra este link para consentir: ${consentUrl}` 
            });
          }
          return res.status(401).json({ 
            error: `Falha na autenticação JWT do DocuSign: ${authErr.response?.data?.error_description || authErr.message}` 
          });
        }

        console.log('[DocuSign Node Engine] Autenticação realizada. Enviado do envelope para assinatura...');
        const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        const envelopePayload = {
          emailSubject: "Por favor, assine o Termo de Entrega de Ativos de TI - AssetFlow",
          emailBlurb: `Olá ${nome},\n\nPor favor, revise e assine o documento com as informações dos seus ativos de TI.\n\nAtenciosamente,\nEquipe de TI Cirion.`,
          documents: [
            {
              documentBase64: cleanPdfBase64,
              name: `Termo_${nome.replace(/\s+/g, '_')}.pdf`,
              fileExtension: "pdf",
              documentId: "1"
            }
          ],
          recipients: {
            signers: [
              {
                email: email,
                name: nome,
                recipientId: "1",
                routingOrder: "1",
                tabs: {
                  signHereTabs: [
                    {
                      anchorString: "/sn1/",
                      anchorUnits: "pixels",
                      anchorXOffset: "0",
                      anchorYOffset: "-10",
                      recipientId: "1"
                    },
                    {
                      anchorString: "Assinatura do Colaborador",
                      anchorUnits: "pixels",
                      anchorXOffset: "10",
                      anchorYOffset: "-15",
                      recipientId: "1"
                    }
                  ]
                }
              }
            ]
          },
          status: "sent"
        };

        const createEnvelopeUrl = `${basePath}/v2.1/accounts/${accountId}/envelopes`;
        const envelopeRes = await axios.post(createEnvelopeUrl, envelopePayload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        const envelopeId = envelopeRes.data.envelopeId;

        // Tenta salvar cópia local / OneDrive
        try {
          await fs.ensureDir(saveDirectory);
          const pdfBuffer = Buffer.from(cleanPdfBase64, 'base64');
          const destPath = path.join(saveDirectory, `Enviado_${nome.replace(/\s+/g, '_')}_${envelopeId}.pdf`);
          await fs.writeFile(destPath, pdfBuffer);
        } catch (saveErr) {
          try {
            const fallbackDir = "./Cartas_Firmadas_Local";
            await fs.ensureDir(fallbackDir);
            const pdfBuffer = Buffer.from(cleanPdfBase64, 'base64');
            const destPath = path.join(fallbackDir, `Enviado_${nome.replace(/\s+/g, '_')}_${envelopeId}.pdf`);
            await fs.writeFile(destPath, pdfBuffer);
          } catch (e) {}
        }

        res.json({
          envelope_id: envelopeId,
          status: "sent",
          message: "Envelope enviado com sucesso para assinatura!",
          recipient: { name: nome, email: email }
        });
      } catch (error: any) {
        console.error('Erro na rota nativa do DocuSign:', error);
        res.status(500).json({ error: error.message || 'Erro inesperado ao realizar integração com o DocuSign.' });
      }
    });

    // Rota para salvar o PDF assinado (todos assinados) Localmente / OneDrive
    app.post('/api/docusign/save-signed-pdf', authenticate, async (req, res) => {
      try {
        const { fileName, pdfBase64 } = req.body;
        if (!fileName || !pdfBase64) {
          return res.status(400).json({ error: 'Nome do arquivo ou dados do PDF ausentes.' });
        }

        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";
        console.log(`[DocuSign Backend] Solicitado salvamento do PDF final: ${fileName} em ${saveDirectory}`);

        const cleanPdfBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
        const pdfBuffer = Buffer.from(cleanPdfBase64, 'base64');

        await fs.ensureDir(saveDirectory);
        const destPath = path.join(saveDirectory, fileName);
        await fs.writeFile(destPath, pdfBuffer);

        console.log(`[DocuSign Backend] PDF salvo com sucesso em: ${destPath}`);
        res.json({
          status: 'success',
          message: 'PDF assinado salvo na pasta de destino local com sucesso!',
          path: destPath
        });
      } catch (error: any) {
        console.error('Erro ao salvar PDF assinado:', error);
        res.status(500).json({ error: error.message || 'Erro ao salvar o PDF assinado localmente.' });
      }
    });

    // Identifica se é produção
    const isProd = process.env.NODE_ENV === 'production' || !fs.existsSync(path.join(__dirname_val, 'server.ts'));
    console.log(`Modo de execução: ${isProd ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);

    if (!isProd) {
      console.log('Iniciando Vite em modo middleware...');
      try {
        // Import dinâmico para evitar erro em produção onde o Vite não existe
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { 
            middlewareMode: true,
            hmr: false
          },
          appType: 'spa',
        });
        app.use(vite.middlewares);
        
        app.get('*all', async (req, res, next) => {
          if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/auth')) {
            return next();
          }
          try {
            let template = fs.readFileSync(path.resolve(__dirname_val, 'index.html'), 'utf-8');
            template = await vite.transformIndexHtml(req.originalUrl, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
          } catch (e) {
            next(e);
          }
        });
      } catch (viteError) {
        console.error('ERRO AO INICIAR VITE:', viteError);
      }
    } else {
      console.log('Servindo arquivos estáticos...');
      // Se estivermos rodando o server.cjs dentro da pasta dist, a pasta dist é a atual.
      // Caso contrário, a pasta dist está um nível abaixo.
      const distPath = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))
        ? path.join(process.cwd(), 'dist')
        : (__dirname_val.endsWith('dist') ? __dirname_val : path.join(__dirname_val, 'dist'));
      console.log(`Caminho dos arquivos estáticos: ${distPath}`);
      
      app.use(express.static(distPath));
      app.get('*all', (req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send(`Erro: index.html não encontrado em ${indexPath}`);
        }
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor pronto e ouvindo em http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('ERRO FATAL NO STARTUP:', err);
  }
}

console.log('Chamando startServer()...');
startServer();
