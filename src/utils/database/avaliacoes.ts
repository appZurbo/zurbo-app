
import { supabase } from '@/integrations/supabase/client';
import { Avaliacao } from './types';

export const getAvaliacoes = async (prestadorId: string): Promise<Avaliacao[]> => {
  try {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select(`
        *,
        avaliador:users!avaliacoes_avaliador_id_fkey (nome, foto_url)
      `)
      .eq('avaliado_id', prestadorId)
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching avaliacoes:', error);
      return [];
    }

    return (data || []) as Avaliacao[];
  } catch (error) {
    console.error('Error loading avaliacoes:', error);
    return [];
  }
};
