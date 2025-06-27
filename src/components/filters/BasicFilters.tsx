
import { MapPin, Star } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ServiceFilterPopover } from './ServiceFilterPopover';
import { CityAutocomplete } from './CityAutocomplete';

interface BasicFiltersProps {
  filters: {
    cidade: string;
    notaMin: number;
    servicos: string[];
  };
  servicos: Array<{ id: string; nome: string; icone: string; cor?: string }>;
  onFilterUpdate: (key: string, value: any) => void;
}

export const BasicFilters = ({ filters, servicos, onFilterUpdate }: BasicFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MapPin className="w-4 h-4" />
          Cidade
        </label>
        <CityAutocomplete
          value={filters.cidade}
          onChange={(value) => onFilterUpdate('cidade', value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Serviços</label>
        <ServiceFilterPopover
          servicos={servicos}
          selectedServices={filters.servicos}
          onSelectionChange={(services) => onFilterUpdate('servicos', services)}
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
            onValueChange={([value]) => onFilterUpdate('notaMin', value)}
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
  );
};
