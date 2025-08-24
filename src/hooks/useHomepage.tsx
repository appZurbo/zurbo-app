
import { useState, useEffect, useMemo } from 'react';
import { usePrestadores } from '@/hooks/usePrestadores';
import { UserProfile } from '@/utils/database/types';

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
}

export const useHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { 
    prestadores: allPrestadores, 
    loading, 
    error, 
    refreshPrestadores 
  } = usePrestadores({
    servico: filters.servico,
    cidade: filters.cidade,
    bairro: filters.bairro,
    disponivel: filters.disponivel
  });

  // Filter prestadores based on search and filters
  const prestadores = useMemo(() => {
    let filtered = allPrestadores;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prestador => 
        prestador.nome?.toLowerCase().includes(query) ||
        prestador.servico?.toLowerCase().includes(query) ||
        prestador.endereco_cidade?.toLowerCase().includes(query) ||
        prestador.endereco_bairro?.toLowerCase().includes(query)
      );
    }

    // Apply rating filter
    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(prestador => 
        (prestador.avaliacao_media || 0) >= filters.rating!
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(prestador => {
        if (!prestador.preco_servico) return true;
        return prestador.preco_servico >= filters.priceRange!.min && 
               prestador.preco_servico <= filters.priceRange!.max;
      });
    }

    return filtered;
  }, [allPrestadores, searchQuery, filters]);

  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleFavoritesOnly = () => {
    setShowFavoritesOnly(prev => !prev);
  };

  const retry = () => {
    refreshPrestadores();
  };

  return {
    prestadores,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    showFavoritesOnly,
    handleFiltersChange,
    toggleFavoritesOnly,
    retry,
    refreshPrestadores
  };
};
