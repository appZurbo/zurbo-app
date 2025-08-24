
import { useState, useEffect, useMemo } from 'react';
import { usePrestadores } from '@/hooks/usePrestadores';
import { UserProfile } from '@/utils/database/types';
import { useAuth } from '@/hooks/useAuth';

export interface Filters {
  servico?: string;
  cidade?: string;
  bairro?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  disponivel?: boolean;
  servicos?: string[];
}

export const useHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { profile } = useAuth();

  const { 
    prestadores: allPrestadores, 
    loading, 
    error, 
    loadPrestadores,
    retry: originalRetry
  } = usePrestadores();

  useEffect(() => {
    loadPrestadores({
      cidade: filters.cidade,
      servicos: filters.servicos,
      precoMin: filters.priceRange?.min,
      precoMax: filters.priceRange?.max,
      notaMin: filters.rating,
      apenasPremium: false
    });
  }, [filters, loadPrestadores]);

  // Filter prestadores based on search and filters
  const prestadores = useMemo(() => {
    let filtered = allPrestadores;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prestador => 
        prestador.nome?.toLowerCase().includes(query) ||
        prestador.endereco_cidade?.toLowerCase().includes(query) ||
        prestador.endereco_bairro?.toLowerCase().includes(query)
      );
    }

    // Apply rating filter
    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(prestador => 
        (prestador.nota_media || 0) >= filters.rating!
      );
    }

    // Apply price range filter (skip for now as UserProfile doesn't have pricing)
    // if (filters.priceRange) {
    //   filtered = filtered.filter(prestador => {
    //     // Price filtering logic would go here when pricing data is available
    //     return true;
    //   });
    // }

    return filtered;
  }, [allPrestadores, searchQuery, filters]);

  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleFavoritesOnly = () => {
    setShowFavoritesOnly(prev => !prev);
  };

  const retry = () => {
    originalRetry();
  };

  const refreshPrestadores = () => {
    return loadPrestadores({
      cidade: filters.cidade,
      servicos: filters.servicos,
      precoMin: filters.priceRange?.min,
      precoMax: filters.priceRange?.max,
      notaMin: filters.rating,
      apenasPremium: false
    });
  };

  const isAuthenticated = !!profile;

  return {
    prestadores,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    showFavoritesOnly,
    isAuthenticated,
    handleFiltersChange,
    toggleFavoritesOnly,
    retry,
    refreshPrestadores
  };
};
