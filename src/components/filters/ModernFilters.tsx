
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FilterHeader } from './FilterHeader';
import { BasicFilters } from './BasicFilters';
import { AdvancedFilters } from './AdvancedFilters';
import { getServicos } from '@/utils/database/servicos';

interface FilterState {
  cidade: string;
  precoMin: number;
  precoMax: number;
  notaMin: number;
  servicos: string[];
  apenasPremium: boolean;
}

interface ModernFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export const ModernFilters = ({ onFiltersChange }: ModernFiltersProps) => {
  const [servicos, setServicos] = useState<Array<{ id: string; nome: string; icone: string; cor?: string }>>([]);
  const [filters, setFilters] = useState<FilterState>({
    cidade: 'Sinop, Mato Grosso', // Updated to use normalized city name
    precoMin: 0,
    precoMax: 500,
    notaMin: 0,
    servicos: [],
    apenasPremium: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load services and apply default filters on mount
  useEffect(() => {
    const loadServicos = async () => {
      const servicosData = await getServicos();
      setServicos(servicosData);
    };
    loadServicos();
    onFiltersChange(filters);
  }, []);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      cidade: 'Sinop, Mato Grosso', // Updated to use normalized city name
      precoMin: 0,
      precoMax: 500,
      notaMin: 0,
      servicos: [],
      apenasPremium: false
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'cidade' && (value === 'Sinop, Mato Grosso' || value === 'Sinop, MT')) return false;
    if (key === 'servicos') return Array.isArray(value) && value.length > 0;
    return value !== '' && value !== 0 && value !== 500 && value !== false;
  }).length;

  return (
    <Card className="p-4 mb-6 bg-white shadow-sm border border-gray-100">
      <FilterHeader
        activeFiltersCount={activeFiltersCount}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        onClearFilters={clearFilters}
      />

      <BasicFilters
        filters={filters}
        servicos={servicos}
        onFilterUpdate={updateFilter}
      />

      {showAdvanced && (
        <AdvancedFilters
          filters={filters}
          onFilterUpdate={updateFilter}
        />
      )}
    </Card>
  );
};
