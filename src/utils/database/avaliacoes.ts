
import { supabase } from '@/integrations/supabase/client';
import { Avaliacao } from './types';

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
