
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MapPin, DollarSign, Star, Sparkles, Filter } from 'lucide-react';
import { ServiceFilterPopover } from './ServiceFilterPopover';
import { CityAutocomplete } from './CityAutocomplete';

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
  servicos: Array<{ id: string; nome: string; icone: string; cor?: string }>;
}

export const ModernFilters = ({ onFiltersChange, servicos }: ModernFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    cidade: 'Sinop, MT', // Default to match prestadores data
    precoMin: 0,
    precoMax: 500,
    notaMin: 0,
    servicos: [],
    apenasPremium: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Apply default filters on mount
  useEffect(() => {
    onFiltersChange(filters);
  }, []);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      cidade: 'Sinop, MT', // Keep default city
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
    if (key === 'cidade' && (value === 'Sinop, MT' || value === 'Sinop, Mato Grosso')) return false;
    if (key === 'servicos') return Array.isArray(value) && value.length > 0;
    return value !== '' && value !== 0 && value !== 500 && value !== false;
  }).length;

  return (
    <Card className="p-4 mb-6 bg-white shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-800">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-gray-600"
          >
            {showAdvanced ? 'Menos filtros' : 'Mais filtros'}
          </Button>
          {activeFiltersCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearFilters}
              className="text-gray-600"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros básicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4" />
            Cidade
          </label>
          <CityAutocomplete
            value={filters.cidade}
            onChange={(value) => updateFilter('cidade', value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Serviços</label>
          <ServiceFilterPopover
            servicos={servicos}
            selectedServices={filters.servicos}
            onSelectionChange={(services) => updateFilter('servicos', services)}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Star className="w-4 h-4" />
            Nota mínima
          </label>
          <div className="flex items-center gap-3">
            <Slider
              value={[filters.notaMin]}
              onValueChange={([value]) => updateFilter('notaMin', value)}
              max={5}
              step={0.5}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-8">
              {filters.notaMin}+
            </span>
          </div>
        </div>
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              Faixa de preço
            </label>
            <div className="space-y-3">
              <Slider
                value={[filters.precoMin, filters.precoMax]}
                onValueChange={([min, max]) => {
                  updateFilter('precoMin', min);
                  updateFilter('precoMax', max);
                }}
                max={1000}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>R$ {filters.precoMin}</span>
                <span>R$ {filters.precoMax}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Sparkles className="w-4 h-4" />
              Apenas Premium
            </label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.apenasPremium}
                onCheckedChange={(checked) => updateFilter('apenasPremium', checked)}
              />
              <span className="text-sm text-gray-600">
                Mostrar apenas prestadores premium
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
