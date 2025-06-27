
import { DollarSign, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface AdvancedFiltersProps {
  filters: {
    precoMin: number;
    precoMax: number;
    apenasPremium: boolean;
  };
  onFilterUpdate: (key: string, value: any) => void;
}

export const AdvancedFilters = ({ filters, onFilterUpdate }: AdvancedFiltersProps) => {
  return (
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
              onFilterUpdate('precoMin', min);
              onFilterUpdate('precoMax', max);
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
            onCheckedChange={(checked) => onFilterUpdate('apenasPremium', checked)}
          />
          <span className="text-sm text-gray-600">
            Mostrar apenas prestadores premium
          </span>
        </div>
      </div>
    </div>
  );
};
