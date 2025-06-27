
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, PrestadorCompleto } from './types';

// Function to normalize city names for filtering
const normalizeCityForFilter = (cityName: string): string => {
  if (!cityName) return '';
  
  const normalized = cityName
    .trim()
    .replace(/\s*,\s*MT\s*$/i, ', Mato Grosso')
    .replace(/\s*,\s*Mato\s+Grosso\s*$/i, ', Mato Grosso')
    .replace(/\s+/g, ' ');
  
  return normalized;
};

// Function to check if two city names match (handles variations)
const citiesMatch = (city1: string, city2: string): boolean => {
  if (!city1 || !city2) return false;
  
  const norm1 = normalizeCityForFilter(city1).toLowerCase();
  const norm2 = normalizeCityForFilter(city2).toLowerCase();
  
  // Direct match
  if (norm1 === norm2) return true;
  
  // Extract city names (before comma) and compare
  const cityPart1 = norm1.split(',')[0].trim();
  const cityPart2 = norm2.split(',')[0].trim();
  
  return cityPart1 === cityPart2;
};

export const getPrestadores = async (filters?: {
  cidade?: string;
  servicos?: string[];
  notaMin?: number;
  precoMin?: number;
  precoMax?: number;
  apenasPremium?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ prestadores: PrestadorCompleto[]; hasMore: boolean; total: number }> => {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 5;
    const offset = (page - 1) * limit;

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
        avaliacoes:avaliacoes!avaliacoes_avaliado_id_fkey (
          id,
          nota,
          comentario,
          criado_em,
          avaliador:users!avaliacoes_avaliador_id_fkey (nome, foto_url)
        ),
        portfolio_fotos (
          id,
          foto_url,
          titulo,
          descricao,
          ordem
        ),
        plano_premium (
          ativo,
          expira_em
        )
      `)
      .eq('tipo', 'prestador');

    // City filtering with normalization
    if (filters?.cidade) {
      const normalizedFilterCity = normalizeCityForFilter(filters.cidade);
      
      // Get all prestadores first, then filter by city match
      const { data: allPrestadores, error: allError } = await query;
      
      if (allError) throw allError;
      
      const filteredByCity = allPrestadores?.filter(prestador => 
        citiesMatch(prestador.endereco_cidade, normalizedFilterCity)
      ) || [];
      
      // Continue with other filters on the city-filtered results
      let filteredPrestadores = filteredByCity;
      
      // Service filtering
      if (filters.servicos && filters.servicos.length > 0) {
        filteredPrestadores = filteredPrestadores.filter(prestador =>
          prestador.prestador_servicos?.some((ps: any) =>
            filters.servicos!.includes(ps.servico_id)
          )
        );
      }

      // Rating filtering
      if (filters.notaMin && filters.notaMin > 0) {
        filteredPrestadores = filteredPrestadores.filter(prestador =>
          (prestador.nota_media || 0) >= filters.notaMin!
        );
      }

      // Premium filtering
      if (filters.apenasPremium) {
        filteredPrestadores = filteredPrestadores.filter(prestador =>
          prestador.plano_premium?.some((plano: any) => 
            plano.ativo && new Date(plano.expira_em) > new Date()
          )
        );
      }

      // Sort: best rated first (4), then random
      const sortedPrestadores = filteredPrestadores.sort((a, b) => {
        const ratingA = a.nota_media || 0;
        const ratingB = b.nota_media || 0;
        
        // If both have high ratings (4+), randomize
        if (ratingA >= 4 && ratingB >= 4) {
          return Math.random() - 0.5;
        }
        
        // Otherwise sort by rating desc
        return ratingB - ratingA;
      });

      const total = sortedPrestadores.length;
      const paginatedResults = sortedPrestadores.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        prestadores: paginatedResults as PrestadorCompleto[],
        hasMore,
        total
      };
    }

    // Original logic for non-city filters
    if (filters?.servicos && filters.servicos.length > 0) {
      query = query.in('prestador_servicos.servico_id', filters.servicos);
    }

    if (filters?.notaMin && filters.notaMin > 0) {
      query = query.gte('nota_media', filters.notaMin);
    }

    if (filters?.apenasPremium) {
      query = query.not('plano_premium', 'is', null);
    }

    // Get total count
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('tipo', 'prestador');

    const { data, error } = await query
      .range(offset, offset + limit - 1)
      .order('nota_media', { ascending: false });

    if (error) throw error;

    // Sort results: best rated first (4), then random
    const sortedData = (data || []).sort((a, b) => {
      const ratingA = a.nota_media || 0;
      const ratingB = b.nota_media || 0;
      
      if (ratingA >= 4 && ratingB >= 4) {
        return Math.random() - 0.5;
      }
      
      return ratingB - ratingA;
    });

    const hasMore = offset + limit < (count || 0);

    return {
      prestadores: sortedData as PrestadorCompleto[],
      hasMore,
      total: count || 0
    };

  } catch (error) {
    console.error('Error fetching prestadores:', error);
    return { prestadores: [], hasMore: false, total: 0 };
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
        avaliacoes:avaliacoes!avaliacoes_avaliado_id_fkey (
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
        avaliacoes:avaliacoes!avaliacoes_avaliado_id_fkey (
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
