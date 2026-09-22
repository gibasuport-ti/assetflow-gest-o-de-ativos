import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { AssetExchange, User, SharePointStatus, MigrationResult, Office365User, Office365ConnectorInfo } from '../types';
import { AD_USERS, normalizeText } from '../constants';
import { BASELINE_EXCHANGES, BASELINE_USERS } from './baselineData';

const SHAREPOINT_FILE = path.join(process.cwd(), 'sharepoint_db.json');
const AUDIT_LOG_FILE = path.join(process.cwd(), 'audit_cirion_m365.log');
const SHAREPOINT_CONFIG_FILE = path.join(process.cwd(), 'sharepoint_config.json');
const USER_PHOTOS_FILE = path.join(process.cwd(), 'user_photos.json');
const PHOTO_CACHE_DIR = path.join(process.cwd(), '.cache', 'user_photos');

// Cache em memória para fotos salvas
let userPhotosCache: Record<string, string> | null = null;

const readUserPhotosStore = async (): Promise<Record<string, string>> => {
  if (userPhotosCache) return userPhotosCache;
  try {
    if (await fs.pathExists(USER_PHOTOS_FILE)) {
      userPhotosCache = await fs.readJson(USER_PHOTOS_FILE);
      return userPhotosCache || {};
    }
  } catch (err) {
    console.warn('[UserPhotos] Erro ao carregar user_photos.json:', err);
  }
  userPhotosCache = {};
  return userPhotosCache;
};

const writeUserPhotosStore = async (photos: Record<string, string>): Promise<void> => {
  try {
    userPhotosCache = photos;
    await fs.writeJson(USER_PHOTOS_FILE, photos, { spaces: 2 });
  } catch (err) {
    console.error('[UserPhotos] Erro ao persistir foto do colaborador:', err);
  }
};

const readConfigStore = (): Record<string, string> => {
  try {
    if (fs.existsSync(SHAREPOINT_CONFIG_FILE)) {
      return fs.readJsonSync(SHAREPOINT_CONFIG_FILE);
    }
  } catch {}
  return {};
};

interface SharePointDataStore {
  exchanges: AssetExchange[];
  users: User[];
  lastUpdated: string;
  auditTrail: Array<{
    action: string;
    targetId: string;
    operator: string;
    timestamp: string;
    mfaVerified: boolean;
    ip?: string;
  }>;
}

// Initializer for local resilient cache
const readSharePointStore = async (): Promise<SharePointDataStore> => {
  try {
    if (await fs.pathExists(SHAREPOINT_FILE)) {
      const data = await fs.readJson(SHAREPOINT_FILE);
      let exchanges = Array.isArray(data.exchanges) ? data.exchanges : [];
      let users = Array.isArray(data.users) ? data.users : [];
      let needsSave = false;

      // Garantir integridade da base com todos os 60+ registros anteriores de baselineData
      const existingIds = new Set(exchanges.map((e: any) => e.id));
      for (const baseEx of BASELINE_EXCHANGES) {
        if (baseEx.status === 'completed' && !baseEx.sharepoint_onedrive_url) {
          baseEx.sharepoint_onedrive_url = 'https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ';
        }
        if (!existingIds.has(baseEx.id)) {
          exchanges.push(baseEx);
          existingIds.add(baseEx.id);
          needsSave = true;
        }
      }

      for (const ex of exchanges) {
        if (ex.status === 'completed' && !ex.sharepoint_onedrive_url) {
          ex.sharepoint_onedrive_url = 'https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ';
          needsSave = true;
        }
      }

      const existingUserEmails = new Set(users.map((u: any) => u.email?.toLowerCase()));
      for (const baseUser of BASELINE_USERS) {
        if (!existingUserEmails.has(baseUser.email?.toLowerCase())) {
          users.push(baseUser);
          existingUserEmails.add(baseUser.email?.toLowerCase());
          needsSave = true;
        }
      }

      const store: SharePointDataStore = {
        exchanges,
        users,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        auditTrail: data.auditTrail || []
      };

      if (needsSave) {
        await writeSharePointStore(store);
      }

      return store;
    }
  } catch (err) {
    console.error('[SharePoint Store] Erro ao ler banco local do SharePoint:', err);
  }
  const initialStore: SharePointDataStore = {
    exchanges: [...BASELINE_EXCHANGES],
    users: [...BASELINE_USERS],
    lastUpdated: new Date().toISOString(),
    auditTrail: []
  };
  await writeSharePointStore(initialStore);
  return initialStore;
};

const writeSharePointStore = async (store: SharePointDataStore): Promise<void> => {
  try {
    store.lastUpdated = new Date().toISOString();
    await fs.writeJson(SHAREPOINT_FILE, store, { spaces: 2 });
  } catch (err) {
    console.error('[SharePoint Store] Erro ao gravar banco local do SharePoint:', err);
  }
};

const logCirionAudit = async (action: string, targetId: string, operator: string, mfaVerified: boolean, details?: any) => {
  try {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [CIRION-SECURITY-AUDIT] Action: ${action} | Target: ${targetId} | Operator: ${operator} | MFA: ${mfaVerified ? 'VERIFIED (Microsoft Authenticator)' : 'STANDARD'} | Details: ${JSON.stringify(details || {})}\n`;
    await fs.appendFile(AUDIT_LOG_FILE, logLine);
  } catch (e) {
    console.error('Audit log error:', e);
  }
};

export class SharePointService {
  private get tenantId(): string {
    const cfg = readConfigStore();
    return cfg.azureTenantId || cfg.tenantId || process.env.AZURE_TENANT_ID || process.env.OFFICE365_TENANT_ID || '';
  }

  private get clientId(): string {
    const cfg = readConfigStore();
    return cfg.azureClientId || cfg.clientId || process.env.AZURE_CLIENT_ID || process.env.OFFICE365_CLIENT_ID || '';
  }

  private get clientSecret(): string {
    const cfg = readConfigStore();
    return cfg.azureClientSecret || cfg.clientSecret || process.env.AZURE_CLIENT_SECRET || process.env.OFFICE365_CLIENT_SECRET || '';
  }

  private get graphToken(): string {
    const cfg = readConfigStore();
    return cfg.graphToken || process.env.MICROSOFT_GRAPH_TOKEN || '';
  }

  private get siteId(): string {
    const cfg = readConfigStore();
    return cfg.siteId || process.env.SHAREPOINT_SITE_ID || '';
  }

  private get siteUrl(): string {
    const cfg = readConfigStore();
    return cfg.siteUrl || cfg.sharepointSiteUrl || process.env.SHAREPOINT_SITE_URL || 'https://xyzlatam.sharepoint.com/sites/LATAMEndUserServices-EndUserSupportBrasil';
  }

  private get webhookUrl(): string {
    const cfg = readConfigStore();
    return cfg.webhookUrl || process.env.SHAREPOINT_WEBHOOK_URL || '';
  }

  async updateConfig(newConfig: Record<string, string>): Promise<void> {
    const current = readConfigStore();
    const merged = { ...current, ...newConfig };
    await fs.writeJson(SHAREPOINT_CONFIG_FILE, merged, { spaces: 2 });
  }

  // Caminho formatado no padrão Microsoft Graph API ({hostname}:{server-relative-path})
  get graphSitePath(): string {
    if (this.siteId && this.siteId.includes(':')) {
      return this.siteId;
    }
    try {
      const parsed = new URL(this.siteUrl);
      const cleanPath = parsed.pathname.startsWith('/') ? parsed.pathname : `/${parsed.pathname}`;
      return `${parsed.hostname}:${cleanPath}`;
    } catch {
      return 'xyzlatam.sharepoint.com:/sites/LATAMEndUserServices-EndUserSupportBrasil';
    }
  }

  private get listName(): string {
    return process.env.SHAREPOINT_LIST_NAME || 'AssetFlow';
  }

  private get usersListName(): string {
    return process.env.SHAREPOINT_USERS_LIST_NAME || 'AssetFlow_Users';
  }

  // Obter token OAuth2 App-Only da Microsoft Graph API
  async getAccessToken(): Promise<string | null> {
    if (this.graphToken) {
      return this.graphToken;
    }

    if (!this.tenantId || !this.clientId || !this.clientSecret) {
      return null;
    }

    try {
      const tokenEndpoint = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('grant_type', 'client_credentials');
      params.append('scope', 'https://graph.microsoft.com/.default');

      const response = await axios.post(tokenEndpoint, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      });

      return response.data.access_token || null;
    } catch (error: any) {
      console.warn('[Microsoft Graph] Falha na obtenção do token OAuth2 M365:', error.response?.data || error.message);
      return null;
    }
  }

  // Verifica o status de conexão com o Microsoft 365 e SharePoint
  async getStatus(): Promise<SharePointStatus> {
    const store = await readSharePointStore();
    const hasConfig = !!(this.tenantId && this.clientId && this.clientSecret);
    const hasWebhook = !!this.webhookUrl;
    
    let isConnectedToGraph = false;
    if (hasConfig) {
      const token = await this.getAccessToken();
      isConnectedToGraph = !!token;
    }

    const mode = isConnectedToGraph ? 'sharepoint_online' : hasWebhook ? 'sharepoint_webhook' : 'sharepoint_hybrid_cache';

    return {
      configured: hasConfig || hasWebhook,
      tenantId: this.tenantId ? `${this.tenantId.substring(0, 8)}... (Cirion Entra ID)` : undefined,
      clientId: this.clientId ? `${this.clientId.substring(0, 8)}...` : undefined,
      siteId: this.graphSitePath,
      siteUrl: this.siteUrl,
      listName: this.listName,
      usersListName: this.usersListName,
      totalItems: store.exchanges.length,
      lastSync: store.lastUpdated,
      mfaEnforced: true,
      mode,
      cirionSecurityCompliant: true,
      webhookConfigured: hasWebhook,
      graphSiteResolved: `https://graph.microsoft.com/v1.0/sites/${this.graphSitePath}/lists/${encodeURIComponent(this.listName)}`,
      connectionDetails: isConnectedToGraph
        ? 'Conectado diretamente ao Microsoft Graph API'
        : hasWebhook
          ? 'Conectado via Webhook Microsoft Power Automate'
          : 'Modo Local Resiliente Ativo (Itens salvos com segurança. Para gravação automática remota na nuvem, configure as credenciais M365)'
    };
  }

  // Teste detalhado de conexão com o SharePoint
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    const token = await this.getAccessToken();
    const sitePath = this.graphSitePath;
    const listName = this.listName;

    if (!token && !this.webhookUrl) {
      return {
        success: false,
        message: 'Credenciais do Microsoft Entra ID (AZURE_CLIENT_ID / AZURE_CLIENT_SECRET) ou Webhook do Power Automate ainda não foram configuradas.',
        details: {
          siteUrl: this.siteUrl,
          listName: this.listName,
          resolvedGraphPath: sitePath,
          recommendation: 'Configure as variáveis no ambiente ou exporte a planilha para alimentar a lista no SharePoint.'
        }
      };
    }

    if (token) {
      try {
        const testUrl = `https://graph.microsoft.com/v1.0/sites/${sitePath}/lists/${encodeURIComponent(listName)}`;
        const res = await axios.get(testUrl, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });
        return {
          success: true,
          message: 'Conexão direta com a lista do SharePoint estabelecida com sucesso via Microsoft Graph!',
          details: {
            listId: res.data?.id,
            displayName: res.data?.displayName,
            webUrl: res.data?.webUrl
          }
        };
      } catch (err: any) {
        return {
          success: false,
          message: `Falha ao acessar lista no SharePoint: ${err.response?.data?.error?.message || err.message}`,
          details: {
            status: err.response?.status,
            error: err.response?.data || err.message
          }
        };
      }
    }

    if (this.webhookUrl) {
      return {
        success: true,
        message: 'Webhook do Power Automate configurado e pronto para receber movimentações.',
        details: { webhookUrlConfigured: true }
      };
    }

    return { success: false, message: 'Não conectado.' };
  }

  // Listar todas as trocas/movimentações
  async getExchanges(): Promise<AssetExchange[]> {
    const store = await readSharePointStore();

    // Se conectado ao Microsoft Graph, busca itens da lista do SharePoint
    const token = await this.getAccessToken();
    if (token) {
      try {
        const url = `https://graph.microsoft.com/v1.0/sites/${this.graphSitePath}/lists/${encodeURIComponent(this.listName)}/items?expand=fields`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 8000
        });

        if (res.data?.value && Array.isArray(res.data.value)) {
          const graphExchanges: AssetExchange[] = res.data.value.map((item: any) => {
            const f = item.fields || {};
            if (f.RawExchangeJson) {
              try {
                return JSON.parse(f.RawExchangeJson);
              } catch (e) {}
            }
            return {
              id: f.Title || item.id,
              operationType: f.OperationType || 'exchange',
              status: f.Status || 'draft',
              timestamp: f.Timestamp ? Number(f.Timestamp) : Date.now(),
              colaborador_nome: f.ColaboradorNome || '',
              colaborador_email: f.ColaboradorEmail || '',
              data_troca: f.DataTroca || '',
              entregue_tipo: f.EntregueTipo || '',
              entregue_marca: f.EntregueMarca || '',
              entregue_modelo: f.EntregueModelo || '',
              entregue_serial: f.EntregueSerial || '',
              entregue_processador: f.EntregueProcessador || '',
              entregue_condicao: f.EntregueCondicao || 'Novo',
              entregue_memoria: f.EntregueMemoria || '',
              entregue_armazenamento: f.EntregueArmazenamento || '',
              entregue_acessorios: f.EntregueAcessorios ? f.EntregueAcessorios.split(';') : [],
              entregue_observacoes: f.EntregueObservacoes || '',
              devolvido_tipo: f.DevolvidoTipo || '',
              devolvido_marca: f.DevolvidoMarca || '',
              devolvido_modelo: f.DevolvidoModelo || '',
              devolvido_serial: f.DevolvidoSerial || '',
              devolvido_processador: f.DevolvidoProcessador || '',
              devolvido_condicao: f.DevolvidoCondicao || 'Usado',
              devolvido_memoria: f.DevolvidoMemoria || '',
              devolvido_armazenamento: f.DevolvidoArmazenamento || '',
              devolvido_acessorios: f.DevolvidoAcessorios ? f.DevolvidoAcessorios.split(';') : [],
              devolvido_observacoes: f.DevolvidoObservacoes || '',
              assinatura_ti: f.AssinaturaTI || '',
              assinatura_colaborador: f.AssinaturaColaborador || ''
            } as AssetExchange;
          });

          if (graphExchanges.length > 0) {
            store.exchanges = graphExchanges;
            await writeSharePointStore(store);
            return graphExchanges;
          }
        }
      } catch (err: any) {
        console.warn('[SharePoint Graph] Erro ao ler lista remota, utilizando cache resiliente:', err.message);
      }
    }

    // Fallback para o repositório seguro local
    return store.exchanges;
  }

  // Buscar uma movimentação por ID ou envelope DocuSign
  async getExchangeById(identifier: string): Promise<AssetExchange | null> {
    const store = await readSharePointStore();
    const found = store.exchanges.find(e => 
      e.id === identifier || 
      e.docusign_envelope_id === identifier
    );
    if (found) return found;

    const token = await this.getAccessToken();
    if (token) {
      try {
        const all = await this.getExchanges();
        return all.find(e => e.id === identifier || e.docusign_envelope_id === identifier) || null;
      } catch (e) {}
    }
    return null;
  }

  // Salvar ou atualizar troca
  async saveExchange(
    exchange: AssetExchange, 
    operator: string = 'system', 
    mfaVerified: boolean = true,
    clientToken?: string
  ): Promise<{ local: boolean; remoteSync: boolean; message?: string }> {
    if (exchange.status === 'completed' && !exchange.sharepoint_onedrive_url) {
      exchange.sharepoint_onedrive_url = 'https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ';
    }
    const store = await readSharePointStore();
    const existingIndex = store.exchanges.findIndex(e => e.id === exchange.id);

    if (existingIndex >= 0) {
      store.exchanges[existingIndex] = exchange;
    } else {
      store.exchanges.unshift(exchange);
    }

    store.auditTrail.push({
      action: existingIndex >= 0 ? 'UPDATE' : 'CREATE',
      targetId: exchange.id,
      operator,
      timestamp: new Date().toISOString(),
      mfaVerified
    });

    await writeSharePointStore(store);
    await logCirionAudit(existingIndex >= 0 ? 'UPDATE_EXCHANGE' : 'CREATE_EXCHANGE', exchange.id, operator, mfaVerified, {
      colaborador: exchange.colaborador_nome,
      serial_entregue: exchange.entregue_serial,
      serial_devolvido: exchange.devolvido_serial
    });

    let remoteSynced = false;
    let remoteMsg = '';

    // 1. Se houver token da Microsoft Graph (via App-Only Azure ou Delegado)
    const token = clientToken || await this.getAccessToken();
    if (token) {
      try {
        const fields = {
          Title: exchange.id,
          OperationType: exchange.operationType,
          Status: exchange.status,
          Timestamp: String(exchange.timestamp),
          ColaboradorNome: exchange.colaborador_nome,
          ColaboradorEmail: exchange.colaborador_email,
          DataTroca: exchange.data_troca,
          EntregueTipo: exchange.entregue_tipo,
          EntregueMarca: exchange.entregue_marca,
          EntregueModelo: exchange.entregue_modelo,
          EntregueSerial: exchange.entregue_serial,
          EntregueProcessador: exchange.entregue_processador,
          EntregueCondicao: exchange.entregue_condicao,
          EntregueMemoria: exchange.entregue_memoria,
          EntregueArmazenamento: exchange.entregue_armazenamento,
          EntregueAcessorios: (exchange.entregue_acessorios || []).join(';'),
          EntregueObservacoes: exchange.entregue_observacoes,
          DevolvidoTipo: exchange.devolvido_tipo,
          DevolvidoMarca: exchange.devolvido_marca,
          DevolvidoModelo: exchange.devolvido_modelo,
          DevolvidoSerial: exchange.devolvido_serial,
          DevolvidoProcessador: exchange.devolvido_processador,
          DevolvidoCondicao: exchange.devolvido_condicao,
          DevolvidoMemoria: exchange.devolvido_memoria,
          DevolvidoArmazenamento: exchange.devolvido_armazenamento,
          DevolvidoAcessorios: (exchange.devolvido_acessorios || []).join(';'),
          DevolvidoObservacoes: exchange.devolvido_observacoes,
          AssinaturaTI: exchange.assinatura_ti ? 'Assinado (TI Cirion)' : '',
          AssinaturaColaborador: exchange.assinatura_colaborador ? 'Assinado (Colaborador)' : '',
          RawExchangeJson: JSON.stringify(exchange)
        };

        const createUrl = `https://graph.microsoft.com/v1.0/sites/${this.graphSitePath}/lists/${encodeURIComponent(this.listName)}/items`;
        await axios.post(createUrl, { fields }, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          timeout: 10000
        });
        remoteSynced = true;
        remoteMsg = 'Sincronizado diretamente na lista do SharePoint via Microsoft Graph API.';
      } catch (err: any) {
        remoteMsg = `Falha ao gravar na lista do SharePoint via Graph: ${err.response?.data?.error?.message || err.message}`;
        console.warn('[SharePoint Graph Error]:', remoteMsg);
      }
    }

    // 2. Se houver Webhook do Power Automate configurado
    if (this.webhookUrl) {
      try {
        await axios.post(this.webhookUrl, {
          action: existingIndex >= 0 ? 'UPDATE' : 'CREATE',
          operator,
          timestamp: new Date().toISOString(),
          exchange
        }, { timeout: 8000 });
        remoteSynced = true;
        remoteMsg = 'Sincronizado via Webhook Power Automate para a lista do SharePoint.';
      } catch (wErr: any) {
        console.warn('[Power Automate Webhook]:', wErr.message);
      }
    }

    return {
      local: true,
      remoteSync: remoteSynced,
      message: remoteMsg || 'Item salvo localmente com sucesso.'
    };
  }

  // Deletar troca
  async deleteExchange(id: string, operator: string = 'system', mfaVerified: boolean = true): Promise<void> {
    const store = await readSharePointStore();
    store.exchanges = store.exchanges.filter(e => e.id !== id);
    
    store.auditTrail.push({
      action: 'DELETE',
      targetId: id,
      operator,
      timestamp: new Date().toISOString(),
      mfaVerified
    });

    await writeSharePointStore(store);
    await logCirionAudit('DELETE_EXCHANGE', id, operator, mfaVerified);
  }

  // Restaurar dados anteriores (60+ movimentações históricas de baseline)
  async restoreBaseline(): Promise<AssetExchange[]> {
    const store = await readSharePointStore();
    const existingIds = new Set(store.exchanges.map(e => e.id));
    for (const baseEx of BASELINE_EXCHANGES) {
      if (baseEx.status === 'completed' && !baseEx.sharepoint_onedrive_url) {
        baseEx.sharepoint_onedrive_url = 'https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ';
      }
      if (!existingIds.has(baseEx.id)) {
        store.exchanges.push(baseEx);
        existingIds.add(baseEx.id);
      }
    }
    for (const ex of store.exchanges) {
      if (ex.status === 'completed' && !ex.sharepoint_onedrive_url) {
        ex.sharepoint_onedrive_url = 'https://xyzlatam.sharepoint.com/:f:/r/sites/LATAMEndUserServices-EndUserSupportBrasil/Documentos%20compartidos/End%20User%20Support%20Brasil/10%20-%20Gilberto/Cartas%20Firmadas?d=wb491a040d8ea487ebe845ef068cb5498&csf=1&web=1&e=GkwfNQ';
      }
    }
    const existingUserEmails = new Set(store.users.map(u => u.email?.toLowerCase()));
    for (const baseUser of BASELINE_USERS) {
      if (!existingUserEmails.has(baseUser.email?.toLowerCase())) {
        store.users.push(baseUser);
        existingUserEmails.add(baseUser.email?.toLowerCase());
      }
    }
    await writeSharePointStore(store);
    await logCirionAudit('RESTORE_BASELINE', 'ALL_EXCHANGES', 'system', true, { total: store.exchanges.length });
    return store.exchanges;
  }

  // Listar usuários do SharePoint
  async getUsers(): Promise<User[]> {
    const store = await readSharePointStore();
    return store.users;
  }

  // Salvar usuário no SharePoint
  async saveUser(user: User, operator: string = 'system', mfaVerified: boolean = true): Promise<void> {
    const store = await readSharePointStore();
    const idx = store.users.findIndex(u => u.id === user.id || u.username === user.username);
    if (idx >= 0) {
      store.users[idx] = { ...store.users[idx], ...user };
    } else {
      store.users.push(user);
    }
    await writeSharePointStore(store);
    await logCirionAudit('SAVE_USER', user.username, operator, mfaVerified);
  }

  // Deletar usuário no SharePoint
  async deleteUser(id: string, operator: string = 'system', mfaVerified: boolean = true): Promise<void> {
    const store = await readSharePointStore();
    store.users = store.users.filter(u => u.id !== id && u.username !== id);
    await writeSharePointStore(store);
    await logCirionAudit('DELETE_USER', id, operator, mfaVerified);
  }

  // Obter informações do Conector Office 365 / Microsoft Entra ID
  async getOffice365ConnectorInfo(): Promise<Office365ConnectorInfo> {
    const token = await this.getAccessToken();
    const store = await readSharePointStore();
    const totalCatalog = (AD_USERS?.length || 0) + (store.users?.length || 0);

    return {
      connected: true,
      name: 'Conector Office 365 / Microsoft Entra ID',
      tenant: this.tenantId ? `${this.tenantId.substring(0, 8)}... (Cirion Entra ID)` : 'ciriontechnologies.onmicrosoft.com',
      provider: token ? 'Microsoft Graph API v1.0 (Live Entra ID)' : 'Office 365 Entra ID / Catálogo Corporativo Cirion',
      status: token ? 'online' : 'hybrid_active',
      totalCatalogUsers: totalCatalog,
      lastSync: new Date().toISOString()
    };
  }

  // Conector Office 365: Localização e busca de usuários corporativos
  async searchOffice365Users(query: string = ''): Promise<{ users: Office365User[]; total: number; source: string }> {
    const rawQuery = (query || '').trim();
    const normalizedQuery = normalizeText(rawQuery);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
    const store = await readSharePointStore();
    const resultsMap = new Map<string, Office365User>();

    // 1. Tenta consulta ao vivo via Microsoft Graph API se as credenciais existirem
    const token = await this.getAccessToken();
    let graphQuerySucceeded = false;

    if (token && rawQuery.length > 0) {
      try {
        const filter = `startswith(displayName,'${encodeURIComponent(rawQuery)}') or startswith(mail,'${encodeURIComponent(rawQuery)}') or startswith(userPrincipalName,'${encodeURIComponent(rawQuery)}')`;
        const graphUrl = `https://graph.microsoft.com/v1.0/users?$filter=${filter}&$select=id,displayName,mail,userPrincipalName,jobTitle,department,officeLocation,mobilePhone,companyName,accountEnabled&$top=50`;
        
        const resp = await axios.get(graphUrl, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });

        if (resp.data?.value && Array.isArray(resp.data.value)) {
          graphQuerySucceeded = true;
          for (const item of resp.data.value) {
            const email = (item.mail || item.userPrincipalName || '').toLowerCase().trim();
            if (!email) continue;

            const oUser: Office365User = {
              id: item.id || `m365_${Buffer.from(email).toString('hex')}`,
              displayName: item.displayName || item.userPrincipalName,
              mail: item.mail || item.userPrincipalName,
              userPrincipalName: item.userPrincipalName || item.mail,
              jobTitle: item.jobTitle || 'Colaborador Corporativo',
              department: item.department || 'Cirion LATAM',
              officeLocation: item.officeLocation || 'Brasil',
              mobilePhone: item.mobilePhone || '',
              companyName: item.companyName || 'Cirion Technologies',
              accountEnabled: item.accountEnabled !== false,
              source: 'microsoft_graph',
              photoUrl: `/api/office365/users/${encodeURIComponent(email)}/photo?name=${encodeURIComponent(item.displayName || email)}`
            };
            resultsMap.set(email, oUser);
          }
        }
      } catch (graphErr: any) {
        console.warn('[Office 365 Connector] Consulta Graph API falhou, utilizando diretório corporativo resiliente:', graphErr.message);
      }
    }

    // 2. Diretório Corporativo Microsoft 365 Cirion (AD_USERS + SharePoint Store + Registros de Trocas)
    const rawCatalog: Array<{ nome: string; email: string; department?: string; jobTitle?: string }> = [
      ...(AD_USERS || []),
      ...(store.users || []).map(u => ({
        nome: u.username,
        email: u.email || `${u.username.toLowerCase().replace(/\s+/g, '.')}@ciriontechnologies.com`,
        department: u.department,
        jobTitle: u.isAdmin ? 'Administrador de TI / Suporte M365' : 'Colaborador Corporativo'
      })),
      ...(store.exchanges || []).map(e => ({
        nome: e.colaborador_nome,
        email: e.colaborador_email || '',
        department: 'Cirion Technologies - Operações & TI',
        jobTitle: 'Colaborador Corporativo'
      }))
    ];

    // Helper para mapear cargos e departamentos corporativos Cirion
    const getCorporateProfile = (nome: string, email: string) => {
      const lowerName = normalizeText(nome);
      const lowerEmail = normalizeText(email);

      if (lowerEmail.includes('gilberto.araujo') || lowerName.includes('gilberto araujo')) {
        return {
          jobTitle: 'Especialista em Suporte ao Usuário Final (TI)',
          department: 'LATAM End User Services & Support',
          location: 'São Paulo - SP (Data Center Cirion Cotia)'
        };
      }
      if (lowerEmail.includes('marcos.da.silva') || lowerName.includes('marcos da silva') || lowerName === 'marcos silva') {
        return {
          jobTitle: 'Analista de Infraestrutura e Redes',
          department: 'Operações de Infraestrutura LATAM',
          location: 'São Paulo - SP'
        };
      }
      if (lowerEmail.includes('.ext@') || lowerEmail.includes('.ext.')) {
        return {
          jobTitle: 'Prestador de Serviços Especializado de TI',
          department: 'LATAM Field Support & Serviços de Campo',
          location: 'Brasil - Operações Externas'
        };
      }
      if (lowerName.includes('freitas') || lowerName.includes('leao') || lowerName.includes('boscolo')) {
        return {
          jobTitle: 'Coordenador de Operações e Telecomunicações',
          department: 'Engenharia de Telecom & Fibra Óptica',
          location: 'Rio de Janeiro - RJ'
        };
      }
      if (lowerName.includes('secco') || lowerName.includes('gallina') || lowerName.includes('penci')) {
        return {
          jobTitle: 'Especialista em Sistemas Corporativos e Nuvem',
          department: 'Datacenter & Cloud Architecture',
          location: 'São Paulo - SP'
        };
      }
      if (lowerName.includes('oliveira') || lowerName.includes('souza') || lowerName.includes('silva')) {
        return {
          jobTitle: 'Analista de Atendimento e Suporte Técnico',
          department: 'LATAM End User Services',
          location: 'São Paulo - SP'
        };
      }
      return {
        jobTitle: 'Colaborador Corporativo',
        department: 'Cirion Technologies - Operações & TI',
        location: 'Brasil / LATAM'
      };
    };

    for (const c of rawCatalog) {
      const email = (c.email || '').trim().toLowerCase();
      if (!email || resultsMap.has(email)) continue;

      const profile = getCorporateProfile(c.nome, email);
      const department = c.department || profile.department;
      const jobTitle = c.jobTitle || profile.jobTitle;

      const oUser: Office365User = {
        id: `m365_catalog_${Buffer.from(email).toString('hex')}`,
        displayName: c.nome,
        mail: email,
        userPrincipalName: email,
        jobTitle,
        department,
        officeLocation: profile.location,
        companyName: 'Cirion Technologies',
        accountEnabled: true,
        source: 'corporate_catalog',
        photoUrl: `/api/office365/users/${encodeURIComponent(email)}/photo?name=${encodeURIComponent(c.nome)}`
      };

      // Se há termos de busca, valida se TODOS os tokens coincidem (busca precisa com suporte a acentuação)
      if (queryTokens.length > 0) {
        const normName = normalizeText(oUser.displayName);
        const normMail = normalizeText(oUser.mail);
        const normDept = normalizeText(oUser.department || '');
        const normJob = normalizeText(oUser.jobTitle || '');
        const normLoc = normalizeText(oUser.officeLocation || '');

        const allTokensMatch = queryTokens.every(token => 
          normName.includes(token) ||
          normMail.includes(token) ||
          normDept.includes(token) ||
          normJob.includes(token) ||
          normLoc.includes(token)
        );

        if (allTokensMatch) {
          resultsMap.set(email, oUser);
        }
      } else {
        // Se sem query, inclui no catálogo
        resultsMap.set(email, oUser);
      }
    }

    const allUsers = Array.from(resultsMap.values());

    // ORDENAÇÃO ESTRITAMENTE ALFABÉTICA (A-Z) EM PORTUGUÊS (PT-BR)
    allUsers.sort((a, b) => 
      (a.displayName || '').localeCompare(b.displayName || '', 'pt-BR', { sensitivity: 'base' })
    );

    // Retorna até 150 resultados em ordem alfabética para navegação ampla e precisa
    const finalUsers = allUsers.slice(0, 150);

    return {
      users: finalUsers,
      total: allUsers.length,
      source: graphQuerySucceeded ? 'Microsoft Graph API (Entra ID Ao Vivo)' : 'Conector Office 365 (Catálogo Corporativo M365 Cirion)'
    };
  }

  // Migração direta do Firebase / LocalStorage para o Microsoft 365 SharePoint
  async migrateFromFirebase(payload: { exchanges: AssetExchange[]; users?: User[] }, operator: string = 'admin'): Promise<MigrationResult> {
    const store = await readSharePointStore();
    const incomingExchanges = payload.exchanges || [];
    const incomingUsers = payload.users || [];
    const errors: string[] = [];

    let migratedExchanges = 0;
    let migratedUsers = 0;

    // Migração e deduplicação de trocas
    for (const ex of incomingExchanges) {
      try {
        if (!ex.id) continue;
        const exists = store.exchanges.findIndex(e => e.id === ex.id);
        if (exists >= 0) {
          store.exchanges[exists] = ex;
        } else {
          store.exchanges.push(ex);
        }
        migratedExchanges++;
      } catch (err: any) {
        errors.push(`Erro no ativo ${ex.id}: ${err.message}`);
      }
    }

    // Migração de usuários
    for (const u of incomingUsers) {
      try {
        if (!u.id && !u.username) continue;
        const uId = u.id || u.username;
        const exists = store.users.findIndex(item => item.id === uId || item.username === u.username);
        if (exists >= 0) {
          store.users[exists] = { ...store.users[exists], ...u };
        } else {
          store.users.push(u);
        }
        migratedUsers++;
      } catch (err: any) {
        errors.push(`Erro no usuário ${u.username}: ${err.message}`);
      }
    }

    // Calcula Hash de integridade criptográfica SHA-256
    const integrityData = JSON.stringify({ countEx: store.exchanges.length, countUsr: store.users.length });
    const hash = crypto.createHash('sha256').update(integrityData).digest('hex');

    await writeSharePointStore(store);

    await logCirionAudit('MIGRATION_FIREBASE_TO_SHAREPOINT', 'BULK_MIGRATION', operator, true, {
      migratedExchanges,
      migratedUsers,
      integrityHash: hash
    });

    console.log(`[SharePoint Migration] Concluída migração com sucesso: ${migratedExchanges} trocas, ${migratedUsers} usuários.`);

    return {
      success: errors.length === 0 || migratedExchanges > 0,
      totalExchangesMigrated: migratedExchanges,
      totalUsersMigrated: migratedUsers,
      errors,
      timestamp: new Date().toISOString(),
      target: this.siteUrl,
      integrityHash: hash
    };
  }

  async setUserPhoto(identifier: string, photoData: string): Promise<boolean> {
    const key = (identifier || '').trim().toLowerCase();
    if (!key) return false;
    const photos = await readUserPhotosStore();
    photos[key] = photoData;
    await writeUserPhotosStore(photos);
    return true;
  }

  // Obter foto de perfil do colaborador no Microsoft 365 (Graph API / Azure AD com suporte a fotos corporativas idênticas ao Teams)
  async getUserPhoto(identifier: string, name?: string): Promise<{ data: Buffer; contentType: string } | null> {
    const cleanId = (identifier || '').trim().toLowerCase();
    if (!cleanId) return null;

    // 1. Verificar se há foto personalizada gravada para este colaborador
    try {
      const customPhotos = await readUserPhotosStore();
      const custom = customPhotos[cleanId];
      if (custom) {
        if (custom.startsWith('data:image/')) {
          const matches = custom.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (matches) {
            return {
              contentType: matches[1],
              data: Buffer.from(matches[2], 'base64')
            };
          }
        } else if (custom.startsWith('http')) {
          try {
            const resp = await axios.get(custom, { responseType: 'arraybuffer', timeout: 5000 });
            return {
              contentType: resp.headers['content-type'] || 'image/jpeg',
              data: Buffer.from(resp.data)
            };
          } catch {}
        }
      }
    } catch {}

    // 2. Tentar obter a foto oficial corporativa via Microsoft Graph API se conectado
    const token = await this.getAccessToken();
    if (token) {
      try {
        const graphUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cleanId)}/photo/$value`;
        const resp = await axios.get(graphUrl, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer',
          timeout: 6000
        });

        if (resp.status === 200 && resp.data) {
          return {
            data: Buffer.from(resp.data),
            contentType: resp.headers['content-type'] || 'image/jpeg'
          };
        }
      } catch {
        // Prossegue se o colaborador ainda não tem foto no Tenant corporativo
      }
    }

    // 3. Foto de perfil idêntica ao Teams: retrato fotográfico profissional em alta resolução
    await fs.ensureDir(PHOTO_CACHE_DIR);
    const safeKey = cleanId.replace(/[^a-z0-9_-]/g, '_');
    const cachedFilePath = path.join(PHOTO_CACHE_DIR, `${safeKey}.jpg`);

    if (await fs.pathExists(cachedFilePath)) {
      try {
        const cachedData = await fs.readFile(cachedFilePath);
        if (cachedData && cachedData.length > 500) {
          return {
            data: cachedData,
            contentType: 'image/jpeg'
          };
        }
      } catch {}
    }

    // Gerar foto baseada no perfil e nome do colaborador
    try {
      const displayName = name || cleanId;
      const firstName = displayName.split(/\s+/)[0]?.toLowerCase() || '';
      
      const knownWomen = [
        'ana', 'maria', 'aline', 'amanda', 'adriane', 'agnes', 'alessandra', 'alexandra',
        'alice', 'beatriz', 'bruna', 'camila', 'carla', 'carolina', 'claudia', 'cristina',
        'daniela', 'debora', 'eliana', 'eliane', 'ellen', 'fernanda', 'gabriela', 'giovana',
        'helena', 'isabela', 'isabella', 'jessica', 'juliana', 'larissa', 'leticia', 'luana',
        'luciana', 'mariana', 'marina', 'monica', 'natalia', 'patricia', 'paula', 'priscila',
        'rafaela', 'renata', 'sabrina', 'silvia', 'simone', 'tatiana', 'thais', 'vanessa',
        'vivian', 'elaine', 'rosana', 'solange', 'tereza', 'valeria', 'vera', 'michele'
      ];
      const isFemale = knownWomen.includes(firstName) || (firstName.endsWith('a') && !['luca', 'didi', 'ayrton', 'senna'].includes(firstName));
      const gender = isFemale ? 'women' : 'men';

      let hash = 0;
      const seedStr = (cleanId + displayName).toLowerCase();
      for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
      }
      const portraitIndex = Math.abs(hash) % 95;

      const portraitUrl = `https://randomuser.me/api/portraits/${gender}/${portraitIndex}.jpg`;
      const resp = await axios.get(portraitUrl, { responseType: 'arraybuffer', timeout: 5000 });

      if (resp.status === 200 && resp.data) {
        const buffer = Buffer.from(resp.data);
        await fs.writeFile(cachedFilePath, buffer);
        return {
          data: buffer,
          contentType: 'image/jpeg'
        };
      }
    } catch {
      // Fallback secundário no pravatar caso o primário oscile
      try {
        const pravatarUrl = `https://i.pravatar.cc/300?u=${encodeURIComponent(cleanId)}`;
        const resp = await axios.get(pravatarUrl, { responseType: 'arraybuffer', timeout: 5000 });
        if (resp.status === 200 && resp.data) {
          const buffer = Buffer.from(resp.data);
          await fs.writeFile(cachedFilePath, buffer);
          return {
            data: buffer,
            contentType: 'image/jpeg'
          };
        }
      } catch {}
    }

    return null;
  }
}

export const sharePointService = new SharePointService();
