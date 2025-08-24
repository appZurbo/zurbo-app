
import { useState, useEffect, useCallback } from 'react';
import { usePrestadores } from './usePrestadores';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Filters {
  cidade: string;
  categoria: string;
  notaMin: number;
  servicos: string[];
  precoMax: number;
  distanciaMax: number;
  disponibilidade: 'todos' | 'disponivel' | 'ocupado';
  verificado: boolean;
  emergencia: boolean;
  ordenacao: 'relevancia' | 'preco' | 'avaliacao' | 'distancia';
}

const initialFilters: Filters = {
  cidade: '',
  categoria: '',
  notaMin: 0,
  servicos: [],
  precoMax: 1000,
  distanciaMax: 50,
  disponibilidade: 'todos',
  verificado: false,
  emergencia: false,
  ordenacao: 'relevancia'
};

export const useHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const { prestadores, loading, error, loadPrestadores } = usePrestadores();
  const { isAuthenticated } = useAuth();

  // Load prestadores on mount and when filters change
  useEffect(() => {
    const filtersToApply = {
      cidade: filters.cidade || undefined,
      search: searchQuery || undefined
    };

    loadPrestadores(filtersToApply);
  }, [filters.cidade, searchQuery, loadPrestadores]);

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Erro ao carregar prestadores: ${error}`);
    }
  }, [error]);

  const updateFilter = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery('');
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.cidade) count++;
    if (filters.categoria) count++;
    if (filters.servicos.length > 0) count++;
    if (filters.notaMin > 0) count++;
    if (filters.precoMax < 1000) count++;
    if (filters.distanciaMax < 50) count++;
    if (filters.disponibilidade !== 'todos') count++;
    if (filters.verificado) count++;
    if (filters.emergencia) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  // Apply advanced filters to prestadores
  const filteredPrestadores = prestadores.filter(prestador => {
    // Advanced filters - using safe property access since these properties might not exist
    if (filters.notaMin > 0 && (prestador.nota_media || 0) < filters.notaMin) {
      return false;
    }
    
    if (filters.verificado && !(prestador as any).verificado) {
      return false;
    }
    
    if (filters.emergencia && !(prestador as any).disponivel_emergencia) {
      return false;
    }
    
    if (filters.disponibilidade === 'disponivel' && !(prestador as any).em_servico) {
      return false;
    }
    
    if (filters.disponibilidade === 'ocupado' && (prestador as any).em_servico) {
      return false;
    }
    
    // Service filter - using safe property access
    if (filters.servicos.length > 0) {
      const prestadorServices = (prestador as any).servicos || [];
      const hasMatchingService = filters.servicos.some(selectedService =>
        prestadorServices.some((service: any) => 
          service.nome?.toLowerCase().includes(selectedService.toLowerCase())
        )
      );
      if (!hasMatchingService) return false;
    }
    
    return true;
  });

  // Sort prestadores - using safe property access
  const sortedPrestadores = [...filteredPrestadores].sort((a, b) => {
    switch (filters.ordenacao) {
      case 'avaliacao':
        return (b.nota_media || 0) - (a.nota_media || 0);
      case 'preco':
        return ((a as any).preco_medio || 0) - ((b as any).preco_medio || 0);
      case 'distancia':
        return ((a as any).distancia || 0) - ((b as any).distancia || 0);
      default:
        return 0; // relevancia - maintain original order
    }
  });

  return {
    // Data
    prestadores: sortedPrestadores,
    loading,
    error,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Filters
    filters,
    updateFilter,
    clearFilters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    getActiveFiltersCount,
    
    // Auth
    isAuthenticated,
    
    // Actions
    refreshPrestadores: () => loadPrestadores({
      cidade: filters.cidade || undefined,
      search: searchQuery || undefined
    })
  };
};
