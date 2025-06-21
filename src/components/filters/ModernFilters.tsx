
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MapPin, DollarSign, Star, Sparkles, Filter } from 'lucide-react';

interface FilterState {
  cidade: string;
  precoMin: number;
  precoMax: number;
  notaMin: number;
  servico: string;
  apenasPremium: boolean; // Fixed: changed from apenasПремium to apenasPremium
}

interface ModernFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  servicos: Array<{ id: string; nome: string; icone: string; cor?: string }>;
}

export const ModernFilters = ({ onFiltersChange, servicos }: ModernFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    cidade: '',
    precoMin: 0,
    precoMax: 500,
    notaMin: 0,
    servico: '',
    apenasPremium: false // Fixed: changed from apenasПремium to apenasPremium
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      cidade: '',
      precoMin: 0,
      precoMax: 500,
      notaMin: 0,
      servico: '',
      apenasPremium: false // Fixed: changed from apenasПремium to apenasPremium
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== 0 && value !== 500 && value !== false
  ).length;

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
          <Input
            placeholder="Ex: São Paulo, Rio de Janeiro..."
            value={filters.cidade}
            onChange={(e) => updateFilter('cidade', e.target.value)}
            className="border-gray-300 focus:border-orange-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Serviço</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.servico === '' ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('servico', '')}
              className={filters.servico === '' ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Todos
            </Button>
            {servicos.slice(0, 3).map((servico) => (
              <Button
                key={servico.id}
                variant={filters.servico === servico.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('servico', servico.id)}
                className={filters.servico === servico.id ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {servico.nome}
              </Button>
            ))}
          </div>
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
