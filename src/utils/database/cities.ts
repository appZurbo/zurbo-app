
import { supabase } from '@/integrations/supabase/client';
import { CidadeBrasileira } from './types';

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
