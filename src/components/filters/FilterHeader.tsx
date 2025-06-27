
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterHeaderProps {
  activeFiltersCount: number;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onClearFilters: () => void;
}

export const FilterHeader = ({ 
  activeFiltersCount, 
  showAdvanced, 
  onToggleAdvanced, 
  onClearFilters 
}: FilterHeaderProps) => {
  return (
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
          onClick={onToggleAdvanced}
          className="text-gray-600"
        >
          {showAdvanced ? 'Menos filtros' : 'Mais filtros'}
        </Button>
        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600"
          >
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
};
