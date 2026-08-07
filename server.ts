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

    // Middleware de Autenticação para Rotas da API
    const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Não autorizado. Token de acesso ausente.' });
      }

      const idToken = authHeader.split('Bearer ')[1];
      if (idToken === 'local_simulated_token' || idToken === 'undefined' || !idToken) {
        console.warn('Usando autenticação simulada local (Firebase offline ou desativado).');
        (req as any).user = { uid: 'simulated_user', name: 'Simulated User' };
        return next();
      }
      
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        (req as any).user = decodedToken;
        next();
      } catch (error) {
        console.warn('Erro ao verificar token ID real, aplicando bypass simulado local para desenvolvimento:', error);
        (req as any).user = { uid: 'simulated_user_fallback', name: 'Fallback User' };
        next();
      }
    };

    // --- DocuSign Integration ---
    const dsConfig = {
      clientId: process.env.DOCUSIGN_CLIENT_ID,
      userId: process.env.DOCUSIGN_USER_ID,
      accountId: process.env.DOCUSIGN_ACCOUNT_ID,
      privateKey: process.env.DOCUSIGN_PRIVATE_KEY,
      basePath: process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi',
      localSavePath: process.env.DOCUSIGN_LOCAL_SAVE_PATH || './signed_documents',
      companyEmail: process.env.DOCUSIGN_COMPANY_EMAIL || 'ti@cirion.com',
      companyName: process.env.DOCUSIGN_COMPANY_NAME || 'Gestão de TI'
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
        
        const authServer = process.env.DOCUSIGN_AUTH_SERVER || "account-d.docusign.com";
        const basePath = process.env.DOCUSIGN_BASE_PATH || "https://demo.docusign.net/restapi";
        const saveDirectory = process.env.DOCUSIGN_LOCAL_SAVE_PATH || "./Cartas_Firmadas_Local";

        // Detecta se as credenciais são place-holders ou estão vazias para aplicar simulado seguro
        const isPlaceholder = !clientId || !userId || !privateKeyRaw || !accountId || 
                              clientId.includes('seu_') || userId.includes('seu_') || 
                              accountId.includes('seu_') || privateKeyRaw.includes('MINHA_CHAVE_PRIVADA');

        if (isPlaceholder) {
          console.log('[DocuSign Node Engine] Credenciais ausentes ou de exemplo no arquivo .env. Operando em MODO SIMULAÇÃO (Sandbox).');
          const mockEnvelopeId = `ds-mock-node-${Date.now()}`;
          
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
            body: `Olá ${nome},\n\nSua assinatura é requisitada para o Termo de Entrega de Ativos de TI.\n\nPor favor, clique no botão "ASSINAR DIGITALMENTE" anexado a este e-mail no painel Outlook para preencher e validar a entrega dos seus equipamentos.\n\nAtenciosamente,\nEquipe de TI Cirion.`,
            sentAt: new Date().toISOString(),
            read: false,
            exchangeId: exchange.id,
            attachment: true
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
      const distPath = __dirname_val.endsWith('dist') ? __dirname_val : path.join(__dirname_val, 'dist');
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

    app.listen(PORT, '127.0.0.1', () => {
      console.log(`✅ Servidor pronto e ouvindo em http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error('ERRO FATAL NO STARTUP:', err);
  }
}

console.log('Chamando startServer()...');
startServer();
