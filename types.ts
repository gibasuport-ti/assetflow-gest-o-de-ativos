
export enum EquipmentCondition {
  NEW = "Novo",
  USED = "Usado"
}

export type LogoPreference = 'cirion' | 'none';

export type OperationType = 'exchange' | 'delivery' | 'return';

export interface AdditionalItem {
  id: string;
  tipo: string;
  marca: string;
  modelo: string;
  serial: string;
}

export interface AssetExchange {
  id: string;
  operationType: OperationType; // Novo campo
  status: 'draft' | 'pending_receiver' | 'completed';
  timestamp: number;
  createdBy?: string;
  
  // Dados do Colaborador
  colaborador_nome: string;
  colaborador_email: string;
  data_troca: string;
  // observacoes: string; // Deprecated/Removed in favor of specific fields

  // Equipamento ENTREGUE
  entregue_tipo: string;
  entregue_marca: string;
  entregue_modelo: string;
  entregue_serial: string;
  entregue_processador: string;
  entregue_condicao: EquipmentCondition;
  entregue_memoria: string;
  entregue_armazenamento: string;
  entregue_acessorios: string[];
  entregue_acessorios_seriais?: Record<string, string>;
  entregue_observacoes: string;
  entregue_adicionais?: AdditionalItem[];

  // Equipamento DEVOLVIDO
  devolvido_tipo: string;
  devolvido_marca: string;
  devolvido_modelo: string;
  devolvido_serial: string;
  devolvido_processador: string;
  devolvido_condicao: EquipmentCondition;
  devolvido_memoria: string;
  devolvido_armazenamento: string;
  devolvido_acessorios: string[];
  devolvido_acessorios_seriais?: Record<string, string>;
  devolvido_observacoes: string;
  devolvido_adicionais?: AdditionalItem[];

  // Assinaturas
  assinatura_ti?: string;
  assinatura_colaborador?: string;

  // Devolução sem termo assinado (Motoboy / Transportadora / Coleta residencial)
  devolucao_sem_termo?: boolean;
  tipo_coleta?: 'motoboy' | 'transportadora' | 'correios' | 'outro';
  empresa_transporte?: string;
  codigo_coleta_os?: string;
  data_coleta_residencial?: string;
  observacoes_coleta?: string;

  // DocuSign Integration
  docusign_envelope_id?: string;
  docusign_status?: 'pending' | 'completed' | 'declined' | 'voided';
  docusign_signed_at?: number;
  docusign_file_path?: string;
}

export interface MockEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  sentAt: string;
  read: boolean;
  exchangeId: string;
  attachment?: boolean;
  envelopeId?: string;
  signingUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  isAdmin: boolean;
  mfaVerified?: boolean;
  authProvider?: 'microsoft' | 'local' | 'firebase';
  microsoftUpn?: string;
  department?: string;
  cirionTenant?: string;
  lastMfaAuthTime?: string;
  authMethod?: 'Microsoft Authenticator (App)' | 'FIDO2 / Windows Hello' | 'SMS / Voice' | 'Chave de Emergência' | 'Firebase Auth Direct';
}

export interface SharePointStatus {
  configured: boolean;
  tenantId?: string;
  clientId?: string;
  siteId?: string;
  siteUrl?: string;
  listName?: string;
  usersListName?: string;
  totalItems: number;
  lastSync?: string;
  mfaEnforced: boolean;
  mode: 'sharepoint_online' | 'sharepoint_hybrid_cache' | 'local_sandbox' | 'sharepoint_webhook';
  cirionSecurityCompliant: boolean;
  webhookConfigured?: boolean;
  connectionDetails?: string;
  graphSiteResolved?: string;
}

export interface MigrationResult {
  success: boolean;
  totalExchangesMigrated: number;
  totalUsersMigrated: number;
  errors: string[];
  timestamp: string;
  target: string;
  integrityHash?: string;
}

export interface AppUrls {
  standaloneUrl: string;
  sharedAppUrl: string;
  devAppUrl: string;
  githubPagesUrl: string;
  isInIframe: boolean;
  canInstallPwa?: boolean;
}

export interface Office365User {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  mobilePhone?: string;
  companyName?: string;
  accountEnabled?: boolean;
  source: 'microsoft_graph' | 'azure_ad' | 'corporate_catalog';
  photoUrl?: string;
}

export interface Office365ConnectorInfo {
  connected: boolean;
  name: string;
  tenant: string;
  provider: string;
  status: 'online' | 'hybrid_active' | 'offline';
  totalCatalogUsers: number;
  lastSync?: string;
}

export type View = 'form' | 'inventory' | 'inbox' | 'users';
