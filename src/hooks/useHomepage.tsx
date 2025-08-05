
import { useState, useEffect } from 'react';
import { usePrestadores } from './usePrestadores';
import { useAuth } from './useAuth';

interface UseHomepageFilters {
  cidade: string;
  servicos: string[];
  precoMin?: number;
  precoMax?: number;
  notaMin?: number;
}

export const useHomepage = () => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filters, setFilters] = useState<UseHomepageFilters>({
    cidade: '',
    servicos: [],
    precoMin: undefined,
    precoMax: undefined,
    notaMin: undefined
  });

  const { isAuthenticated } = useAuth();
  const { prestadores, loading, error, loadPrestadores, filterByFavorites, retry } = usePrestadores();

  const displayedPrestadores = showFavoritesOnly && isAuthenticated 
    ? (() => {
        const favorites = JSON.parse(localStorage.getItem('user_favorites') || '[]');
        return filterByFavorites(favorites);
      })()
    : prestadores;

  useEffect(() => {
    loadPrestadores(filters);
  }, [filters, loadPrestadores]);

  const handleFiltersChange = (newFilters: any) => {
    console.log('🔄 Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const toggleFavoritesOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  return {
    prestadores: displayedPrestadores,
    loading,
    error,
    filters,
    showFavoritesOnly,
    isAuthenticated,
    handleFiltersChange,
    toggleFavoritesOnly,
    retry
  };
};
