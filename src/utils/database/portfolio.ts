
import { supabase } from '@/integrations/supabase/client';
import { PortfolioFoto } from './types';

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
