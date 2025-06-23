
import { supabase } from '@/integrations/supabase/client';

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
  nota_media?: number;
  ocultar_nota?: boolean;
  premium?: boolean;
  criado_em: string;
  updated_at?: string;
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

export const checkUserProfile = async (authId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle();

    if (error) {
      console.error('Error checking user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Database check error:', error);
    return null;
  }
};

export const createUserProfile = async (authId: string, email: string, userData: any): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        auth_id: authId,
        email: email,
        nome: userData.nome || email.split('@')[0],
        tipo: userData.tipo || 'cliente',
        cpf: userData.cpf || null,
        endereco_cidade: userData.endereco_cidade || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Profile creation error:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Profile update error:', error);
    return null;
  }
};

export const getPrestadores = async (filters?: {
  cidade?: string;
  servico?: string;
  precoMin?: number;
  precoMax?: number;
  notaMin?: number;
}) => {
  try {
    let query = supabase
      .from('users')
      .select(`
        *,
        prestador_servicos (
          servico_id,
          preco_min,
          preco_max,
          servicos (nome, icone, cor)
        ),
        avaliacoes!avaliacoes_avaliado_id_fkey (
          nota,
          comentario,
          criado_em,
          avaliador:users!avaliacoes_avaliador_id_fkey (nome, foto_url)
        )
      `)
      .eq('tipo', 'prestador')
      .order('premium', { ascending: false })
      .order('nota_media', { ascending: false });

    if (filters?.cidade) {
      query = query.ilike('endereco_cidade', `%${filters.cidade}%`);
    }

    if (filters?.notaMin) {
      query = query.gte('nota_media', filters.notaMin);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as UserProfile[];
  } catch (error) {
    console.error('Error fetching prestadores:', error);
    return [];
  }
};

export const getAvaliacoes = async (userId: string): Promise<Avaliacao[]> => {
  try {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select(`
        *,
        avaliador:users!avaliacoes_avaliador_id_fkey (nome, foto_url)
      `)
      .eq('avaliado_id', userId)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching avaliações:', error);
    return [];
  }
};

export const createAvaliacao = async (avaliacao: {
  avaliador_id: string;
  avaliado_id: string;
  nota: number;
  comentario?: string;
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('avaliacoes')
      .insert(avaliacao);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating avaliação:', error);
    return false;
  }
};

export const getPortfolioFotos = async (prestadorId: string): Promise<PortfolioFoto[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_fotos')
      .select('*')
      .eq('prestador_id', prestadorId)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
};

export const addPortfolioFoto = async (foto: {
  prestador_id: string;
  foto_url: string;
  titulo?: string;
  descricao?: string;
  ordem?: number;
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('portfolio_fotos')
      .insert(foto);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding portfolio foto:', error);
    return false;
  }
};

export const getCidades = async (searchTerm?: string): Promise<CidadeBrasileira[]> => {
  try {
    let query = supabase
      .from('cidades_brasileiras')
      .select('*')
      .eq('estado', 'MT')
      .order('nome', { ascending: true });

    if (searchTerm && searchTerm.length > 0) {
      query = query.ilike('nome', `%${searchTerm}%`);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching cities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Database error fetching cities:', error);
    return [];
  }
};

export const getCidadeByNome = async (nome: string): Promise<CidadeBrasileira | null> => {
  try {
    const { data, error } = await supabase
      .from('cidades_brasileiras')
      .select('*')
      .eq('nome', nome)
      .eq('estado', 'MT')
      .maybeSingle();

    if (error) {
      console.error('Error fetching city by name:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database error fetching city:', error);
    return null;
  }
};
