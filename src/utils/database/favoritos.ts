
import { supabase } from '@/integrations/supabase/client';

export interface Favorito {
  id: string;
  usuario_id: string;
  prestador_id: string;
  criado_em: string;
  prestador?: {
    nome: string;
    foto_url?: string;
    nota_media?: number;
    endereco_cidade?: string;
  };
}

export const adicionarFavorito = async (prestadorId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return false;

    const { error } = await supabase
      .from('favoritos')
      .insert({
        usuario_id: profile.id,
        prestador_id: prestadorId
      });

    return !error;
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    return false;
  }
};

export const removerFavorito = async (prestadorId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return false;

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', profile.id)
      .eq('prestador_id', prestadorId);

    return !error;
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    return false;
  }
};

export const verificarFavorito = async (prestadorId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return false;

    const { data } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', profile.id)
      .eq('prestador_id', prestadorId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return false;
  }
};

export const listarFavoritos = async (): Promise<Favorito[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    if (!profile) return [];

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        *,
        prestador:prestador_id (
          nome,
          foto_url,
          nota_media,
          endereco_cidade
        )
      `)
      .eq('usuario_id', profile.id)
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao listar favoritos:', error);
      return [];
    }

    return data as Favorito[];
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    return [];
  }
};
