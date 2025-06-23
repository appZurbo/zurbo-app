
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

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
