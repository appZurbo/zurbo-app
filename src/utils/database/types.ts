
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
  criado_em: string;
  updated_at?: string;
  servicos_oferecidos?: string[];
  prestador_servicos?: {
    servico_id: string;
    preco_min?: number;
    preco_max?: number;
    servicos?: {
      nome: string;
      icone?: string;
      cor?: string;
    };
  }[];
  avaliacoes?: {
    nota: number;
    comentario?: string;
    criado_em: string;
    avaliador?: {
      nome: string;
      foto_url?: string;
    };
  }[];
}

export interface PrestadorCompleto extends UserProfile {
  prestador_servicos?: {
    servico_id: string;
    preco_min?: number;
    preco_max?: number;
    servicos?: {
      nome: string;
      icone?: string;
      cor?: string;
    };
  }[];
  avaliacoes?: {
    id: string;
    nota: number;
    comentario?: string;
    criado_em: string;
    avaliador?: {
      nome: string;
      foto_url?: string;
    };
  }[];
  portfolio_fotos?: {
    id: string;
    foto_url: string;
    titulo?: string;
    descricao?: string;
    ordem: number;
  }[];
  plano_premium?: {
    ativo: boolean;
    expira_em: string;
  }[];
}

export interface Pedido {
  id: string;
  cliente_id: string;
  prestador_id: string;
  servico_id: string;
  titulo: string;
  descricao?: string;
  preco_acordado?: number;
  status: 'pendente' | 'aceito' | 'em_andamento' | 'concluido' | 'cancelado';
  data_solicitacao: string;
  data_conclusao?: string;
  endereco_completo?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  cliente?: UserProfile;
  prestador?: UserProfile;
  servico?: {
    nome: string;
    icone?: string;
    cor?: string;
  };
}

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

export interface PortfolioFoto {
  id: string;
  prestador_id: string;
  foto_url: string;
  titulo?: string;
  descricao?: string;
  ordem: number;
  criado_em: string;
}

export interface CidadeBrasileira {
  id: string;
  nome: string;
  estado: string;
  codigo_ibge?: string;
  created_at: string;
}

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

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: UserProfile;
}
