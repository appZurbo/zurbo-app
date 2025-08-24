
import { useState, useEffect, useCallback } from 'react';
import { getPrestadores } from '@/utils/database/prestadores';
import { UserProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface UsePrestadoresFilters {
  cidade?: string;
  servicos?: string[];
  precoMin?: number;
  precoMax?: number;
  notaMin?: number;
  apenasPremium?: boolean;
}

export const usePrestadores = () => {
  console.log("🔍 usePrestadores hook called");
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  console.log("🔍 useToast called successfully in usePrestadores");

  const loadPrestadores = useCallback(async (filters: UsePrestadoresFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Loading prestadores with filters:', filters);
      const result = await getPrestadores(filters);
      
      const validPrestadores = result.prestadores.filter(p => {
        if (!p || !p.id || !p.nome) {
          console.warn('Invalid prestador data:', p);
          return false;
        }
        return true;
      });
      
      console.log(`✅ Loaded ${validPrestadores.length} valid prestadores`);
      setPrestadores(validPrestadores);
    } catch (error) {
      console.error('❌ Error loading prestadores:', error);
      const errorMessage = 'Não foi possível carregar os prestadores';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage + ". Tente novamente.",
        variant: "destructive"
      });
      setPrestadores([]);
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
