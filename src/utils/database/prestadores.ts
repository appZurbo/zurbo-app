
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const getPrestadores = async (filters?: {
  cidade?: string;
  servico?: string;
  servicos?: string[];
  precoMin?: number;
  precoMax?: number;
  notaMin?: number;
  limit?: number;
  offset?: number;
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
      .eq('tipo', 'prestador');

    if (filters?.cidade) {
      // Flexible city matching - match both "Sinop, MT" and "Sinop, Mato Grosso"
      const cityVariations = [
        filters.cidade,
        filters.cidade.replace(', Mato Grosso', ', MT'),
        filters.cidade.replace(', MT', ', Mato Grosso')
      ];
      
      query = query.or(
        cityVariations.map(city => `endereco_cidade.ilike.%${city}%`).join(',')
      );
    }

    if (filters?.notaMin) {
      query = query.gte('nota_media', filters.notaMin);
    }

    // Apply pagination
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;
    
    let prestadores = (data || []) as UserProfile[];

    // Filter by services if specified
    if (filters?.servicos && filters.servicos.length > 0) {
      prestadores = prestadores.filter(prestador => 
        prestador.prestador_servicos?.some(ps => 
          filters.servicos!.includes(ps.servico_id)
        )
      );
    }

    // Sort: first 4 by rating, then random
    prestadores.sort((a, b) => {
      const ratingA = a.nota_media || 0;
      const ratingB = b.nota_media || 0;
      return ratingB - ratingA;
    });

    // Take top 4 rated, then randomize the rest
    const topRated = prestadores.slice(0, 4);
    const remaining = prestadores.slice(4).sort(() => Math.random() - 0.5);
    
    return [...topRated, ...remaining];
  } catch (error) {
    console.error('Error fetching prestadores:', error);
    return [];
  }
};

export const getPrestadoresPremiumDestaque = async (): Promise<UserProfile[]> => {
  try {
    // Get premium providers
    const { data: premiumData, error: premiumError } = await supabase
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
      .eq('premium', true)
      .limit(10);

    if (premiumError) throw premiumError;

    // Get top rated providers (non-premium)
    const { data: topRatedData, error: topRatedError } = await supabase
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
      .eq('premium', false)
      .gte('nota_media', 4.0)
      .order('nota_media', { ascending: false })
      .limit(10);

    if (topRatedError) throw topRatedError;

    // Combine and randomize
    const allPrestadores = [
      ...(premiumData || []),
      ...(topRatedData || [])
    ] as UserProfile[];

    // Randomize and limit to 20
    return allPrestadores
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching premium/highlight prestadores:', error);
    return [];
  }
};
