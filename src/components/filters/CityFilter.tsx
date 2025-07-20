
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CityFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const CIDADES_DISPONIVEIS = [
  'Sinop, Mato Grosso',
  'Sorriso, Mato Grosso', 
  'Lucas do Rio Verde, Mato Grosso',
  'Nova Mutum, Mato Grosso',
  'Vera, Mato Grosso',
  'Itanhangá, Mato Grosso'
];

export const CityFilter = ({ value, onChange }: CityFilterProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin className="w-4 h-4" />
        Cidade
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma cidade" />
        </SelectTrigger>
        <SelectContent>
          {CIDADES_DISPONIVEIS.map((cidade) => (
            <SelectItem key={cidade} value={cidade}>
              {cidade}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
