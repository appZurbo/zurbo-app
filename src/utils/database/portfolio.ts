
import { supabase } from '@/integrations/supabase/client';
import { PortfolioFoto } from './types';

export const getPortfolioFotos = async (prestadorId: string): Promise<PortfolioFoto[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_fotos')
      .select('*')
      .eq('prestador_id', prestadorId)
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Error fetching portfolio fotos:', error);
      return [];
    }

    return (data || []) as PortfolioFoto[];
  } catch (error) {
    console.error('Error loading portfolio fotos:', error);
    return [];
  }
};
