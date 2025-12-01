
import { useState, useEffect, useCallback } from 'react';
import { getPrestadores } from '@/utils/database/prestadores';
import { UserProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { MOCK_PRESTADORES } from '@/utils/mockData';

interface UsePrestadoresFilters {
  cidade?: string;
  servicos?: string[];
  precoMin?: number;
  precoMax?: number;
  notaMin?: number;
  apenasPremium?: boolean;
}

export const usePrestadores = () => {
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadPrestadores = useCallback(async (filters: UsePrestadoresFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Loading prestadores with filters:', filters);
      
      // Tenta carregar do banco
      let result;
      try {
        result = await getPrestadores(filters);
      } catch (dbError) {
        console.warn('Failed to load from DB, falling back to mocks:', dbError);
        result = { prestadores: [], count: 0 };
      }
      
      let validPrestadores = result.prestadores.filter(p => {
        if (!p || !p.id || !p.nome) {
          return false;
        }
        return true;
      });

      // Se não retornou nada do banco (ou deu erro), usa os mocks
      // E filtra os mocks localmente baseados nos filtros recebidos
      if (validPrestadores.length === 0) {
        console.log('⚠️ Using MOCK data because DB returned empty/error');
        validPrestadores = MOCK_PRESTADORES.filter(p => {
          // Filtrar por serviço
          if (filters.servicos && filters.servicos.length > 0) {
            const hasService = p.servicos_oferecidos?.some(s => 
              filters.servicos?.some(filterS => s.toLowerCase().includes(filterS.toLowerCase()) || filterS.toLowerCase().includes(s.toLowerCase()))
            );
            if (!hasService) return false;
          }
          return true;
        });
      }
      
      console.log(`✅ Loaded ${validPrestadores.length} valid prestadores (Source: ${validPrestadores === MOCK_PRESTADORES || validPrestadores[0]?.id.startsWith('mock') ? 'MOCK' : 'DB'})`);
      setPrestadores(validPrestadores);
    } catch (error) {
      console.error('❌ Error loading prestadores:', error);
      // Em último caso, usa todos os mocks
      setPrestadores(MOCK_PRESTADORES);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterByFavorites = useCallback((favoriteIds: string[]) => {
    return prestadores.filter(prestador => favoriteIds.includes(prestador.id));
  }, [prestadores]);

  const retry = useCallback(() => {
    loadPrestadores();
  }, [loadPrestadores]);

  return {
    prestadores,
    loading,
    error,
    loadPrestadores,
    filterByFavorites,
    retry
  };
};
