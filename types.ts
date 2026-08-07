
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
  sentAt: string;
  read: boolean;
  exchangeId: string;
  attachment?: boolean;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  isAdmin: boolean;
}

export type View = 'form' | 'inventory' | 'inbox' | 'users';
