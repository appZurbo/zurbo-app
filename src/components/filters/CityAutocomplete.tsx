
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, ChevronDown } from 'lucide-react';
import { getCidadesPrestadores } from '@/utils/database/cities';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [cidades, setCidades] = useState<string[]>([]);
  const [filteredCidades, setFilteredCidades] = useState<string[]>([]);

  useEffect(() => {
    loadCidades();
  }, []);

  useEffect(() => {
    if (value) {
      const filtered = cidades.filter(cidade =>
        cidade.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCidades(filtered);
    } else {
      setFilteredCidades(cidades);
    }
  }, [value, cidades]);

  const loadCidades = async () => {
    try {
      const cidadesData = await getCidadesPrestadores();
      setCidades(cidadesData);
      setFilteredCidades(cidadesData);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleCitySelect = (cidade: string) => {
    onChange(cidade);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder="Ex: Sinop, MT"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-gray-300 focus:border-orange-500 pr-8"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2"
            onClick={() => setOpen(!open)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <div className="max-h-48 overflow-y-auto">
          {filteredCidades.length > 0 ? (
            filteredCidades.map((cidade, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => handleCitySelect(cidade)}
              >
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                {cidade}
              </Button>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center">
              Nenhuma cidade encontrada
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
