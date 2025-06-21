
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  auth_id: string;
  nome: string;
  email: string;
  cpf?: string;
  tipo: 'cliente' | 'prestador';
  foto_url?: string;
  bio?: string;
  nota_media: number;
  endereco_cidade?: string;
  premium: boolean;
  ocultar_nota: boolean;
  criado_em: string;
  updated_at: string;
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

    return data;
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

    return data;
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

    return data;
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
    return data || [];
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
