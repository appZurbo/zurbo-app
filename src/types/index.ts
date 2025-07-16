// ============================================
// CENTRALIZED TYPE DEFINITIONS - ZURBO
// ============================================
// This file consolidates all type definitions to eliminate duplication
// and ensure consistency across the application.

// ============================================
// USER & PROFILE TYPES
// ============================================

/** 
 * Main user profile interface - used throughout the application
 * Consolidates Profile and UserProfile interfaces 
 */
export interface UserProfile {
  id: string;
  auth_id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'prestador' | 'admin' | 'moderator';
  bio?: string;
  foto_url?: string;
  endereco_cidade?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cep?: string;
  latitude?: number;
  longitude?: number;
  cpf?: string;
  data_nascimento?: string;
  nota_media?: number;
  ocultar_nota?: boolean;
  premium?: boolean;
  plano_premium?: string | {
    ativo: boolean;
    expira_em: string;
  }[];
  criado_em: string;
  updated_at?: string;
  servicos_oferecidos?: string[];
  em_servico?: boolean;
  descricao_servico?: string;
  prestador_servicos?: PrestadorServico[];
  avaliacoes?: Avaliacao[];
  stripe_account_id?: string;
}

/**
 * Extended profile with additional prestador-specific data
 */
export interface PrestadorCompleto extends UserProfile {
  prestador_servicos?: PrestadorServico[];
  avaliacoes?: AvaliacaoCompleta[];
  portfolio_fotos?: PortfolioFoto[];
  plano_premium?: {
    ativo: boolean;
    expira_em: string;
  }[];
}

// ============================================
// SERVICE TYPES
// ============================================

export interface Servico {
  id: string;
  nome: string;
  icone?: string;
  cor?: string;
  ativo?: boolean;
}

export interface PrestadorServico {
  servico_id: string;
  preco_min?: number;
  preco_max?: number;
  servicos?: Servico;
}

// ============================================
// PEDIDO/ORDER TYPES  
// ============================================

export type StatusType = 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';
export type StatusPagamento = 'pendente' | 'pago_em_escrow' | 'liberado' | 'cancelado';

export interface Pedido {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_id: string;
  titulo: string;
  descricao?: string;
  preco_acordado?: number;
  status: StatusType;
  status_pagamento?: StatusPagamento;
  cliente_confirmou?: boolean;
  prestador_confirmou?: boolean;
  data_solicitacao: string;
  data_conclusao?: string;
  endereco_completo?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  cliente?: UserProfile;
  prestador?: UserProfile;
  servico?: Servico;
}

// ============================================
// CHAT & MESSAGING TYPES
// ============================================

export interface Chat {
  id: string;
  cliente_id: string;
  prestador_id: string;
  last_message?: string;
  created_at: string;
  updated_at: string;
  cliente?: UserProfile;
  prestador?: UserProfile;
  pedido_id?: string;
}

export interface ChatConversation {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_solicitado: string;
  preco_proposto?: number;
  status: string;
  client_message_count: number;
  provider_message_count: number;
  created_at: string;
  updated_at: string;
  cliente?: { nome: string; foto_url?: string };
  prestador?: { nome: string; foto_url?: string };
  last_message?: string;
  pedido_id?: string;
}

export type MessageType = 'text' | 'image' | 'system';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: MessageType;
  content?: string;
  image_url?: string;
  created_at: string;
  sender?: UserProfile;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: UserProfile;
}

// ============================================
// RATING & PORTFOLIO TYPES
// ============================================

export interface Avaliacao {
  id: string;
  avaliador_id: string;
  avaliado_id: string;
  nota: number;
  comentario?: string;
  criado_em: string;
  avaliador?: {
    nome: string;
    foto_url?: string;
  };
}

export interface AvaliacaoCompleta extends Avaliacao {
  id: string;
  nota: number;
  comentario?: string;
  criado_em: string;
  avaliador?: {
    nome: string;
    foto_url?: string;
  };
}

export interface PortfolioFoto {
  id: string;
  prestador_id: string;
  foto_url: string;
  titulo?: string;
  descricao?: string;
  ordem: number;
  criado_em: string;
}

// ============================================
// LOCATION & GEOGRAPHICAL TYPES
// ============================================

export interface CidadeBrasileira {
  id: string;
  nome: string;
  estado: string;
  codigo_ibge?: string;
  created_at: string;
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface UserRoleManagerProps {
  userId: string;
  currentRole: string;
  userName: string;
  onRoleUpdate: () => void;
}

export interface ReportUserButtonProps {
  reportedUserId: string;
  reportedUserName: string;
  variant?: 'button' | 'icon';
}

export interface ChatInterfaceProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  imageUploadInfo: any;
  onSendMessage: (content: string) => void;
  onUploadImage: (file: File) => void;
  onSetPrice: (price: number) => void;
  onRespondToPrice: (accept: boolean) => void;
  onReportUser: (issueType: string, description: string) => void;
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ChatHistoryDownloadProps {
  chat: Chat;
  messages: Message[];
}

// ============================================
// ADMIN & SYSTEM TYPES
// ============================================

export interface UserData {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'prestador' | 'admin' | 'moderator';
  premium: boolean;
  criado_em: string; // Database field name
  endereco_cidade?: string;
  descricao_servico?: string;
  nota_media?: number;
}

// ============================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================

// Legacy aliases for backward compatibility (to be removed in future versions)
/** @deprecated Use UserProfile instead */
export type Profile = UserProfile;