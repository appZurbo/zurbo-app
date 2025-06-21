
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Star, DollarSign, Filter, X } from 'lucide-react';

interface FilterState {
  busca: string;
  cidade: string;
  servico: string;
  precoMin: number;
  precoMax: number;
  notaMin: number;
  apenasпремium: boolean;
}

interface ModernFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  servicos: Array<{ id: string; nome: string; icone: string }>;
}

export const ModernFilters = ({ filters, onFiltersChange, servicos }: ModernFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      busca: '',
      cidade: '',
      servico: '',
      precoMin: 0,
      precoMax: 1000,
      notaMin: 0,
      apenaskremium: false,
    });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'busca' || key === 'cidade' || key === 'servico') return value !== '';
    if (key === 'precoMin') return value > 0;
    if (key === 'precoMax') return value < 1000;
    if (key === 'notaMin') return value > 0;
    if (key === 'apenasремium') return value === true;
    return false;
  }).length;

  return (
    <div className="space-y-4">
      {/* Barra de busca principal */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar prestadores ou serviços..."
                value={filters.busca}
                onChange={(e) => updateFilter('busca', e.target.value)}
                className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            
            <div className="relative min-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cidade ou região..."
                value={filters.cidade}
                onChange={(e) => updateFilter('cidade', e.target.value)}
                className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros avançados */}
      {showAdvanced && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filtros Avançados</h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Serviço */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tipo de Serviço
                </label>
                <Select value={filters.servico} onValueChange={(value) => updateFilter('servico', value)}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Todos os serviços" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os serviços</SelectItem>
                    {servicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Avaliação mínima */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Avaliação Mínima: {filters.notaMin} {filters.notaMin > 0 && '⭐'}
                </label>
                <Slider
                  value={[filters.notaMin]}
                  onValueChange={([value]) => updateFilter('notaMin', value)}
                  max={5}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              {/* Premium toggle */}
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="premium"
                  checked={filters.apenasремium}
                  onChange={(e) => updateFilter('apenasремium', e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="premium" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <span className="text-yellow-500">👑</span>
                  Apenas Premium
                </label>
              </div>
            </div>

            {/* Faixa de preço */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Faixa de Preço: R$ {filters.precoMin} - R$ {filters.precoMax}
              </label>
              <div className="px-3">
                <Slider
                  value={[filters.precoMin, filters.precoMax]}
                  onValueChange={([min, max]) => {
                    updateFilter('precoMin', min);
                    updateFilter('precoMax', max);
                  }}
                  max={1000}
                  step={50}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
