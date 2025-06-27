
import { supabase } from '@/integrations/supabase/client';

export interface Servico {
  id: string;
  nome: string;
  icone: string;
  cor?: string;
  ativo: boolean;
}

export const getServicos = async (): Promise<Servico[]> => {
  try {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching servicos:', error);
    return [];
  }
};
