
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCidades();
  }, []);

  useEffect(() => {
    if (value && value.length >= 2) {
      const filtered = cidades.filter(cidade =>
        cidade.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limita a 10 resultados para performance
      setFilteredCidades(filtered);
    } else {
      setFilteredCidades(cidades.slice(0, 10)); // Mostra as 10 primeiras se não há filtro
    }
  }, [value, cidades]);

  const loadCidades = async () => {
    setLoading(true);
    try {
      // Primeiro tenta carregar da tabela cidades_brasileiras
      const { data: cidadesBrasil, error: errorBrasil } = await supabase
        .from('cidades_brasileiras')
        .select('nome, estado')
        .order('nome');

      if (!errorBrasil && cidadesBrasil && cidadesBrasil.length > 0) {
        const cidadesFormatadas = cidadesBrasil.map(cidade => 
          `${cidade.nome}, ${cidade.estado}`
        );
        setCidades(cidadesFormatadas);
        setFilteredCidades(cidadesFormatadas.slice(0, 10));
      } else {
        // Fallback para cidades fixas se a tabela não existir
        const cidadesFallback = [
          'Sinop, Mato Grosso',
          'Cuiabá, Mato Grosso',
          'Várzea Grande, Mato Grosso',
          'Rondonópolis, Mato Grosso',
          'Tangará da Serra, Mato Grosso',
          'Cáceres, Mato Grosso',
          'Barra do Garças, Mato Grosso',
          'Lucas do Rio Verde, Mato Grosso',
          'Primavera do Leste, Mato Grosso',
          'Sorriso, Mato Grosso',
          'São Paulo, São Paulo',
          'Rio de Janeiro, Rio de Janeiro',
          'Belo Horizonte, Minas Gerais',
          'Salvador, Bahia',
          'Brasília, Distrito Federal',
          'Fortaleza, Ceará',
          'Manaus, Amazonas',
          'Recife, Pernambuco',
          'Porto Alegre, Rio Grande do Sul',
          'Belém, Pará'
        ];
        setCidades(cidadesFallback);
        setFilteredCidades(cidadesFallback.slice(0, 10));
      }
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
      // Fallback em caso de erro
      const cidadesFallback = [
        'Sinop, Mato Grosso',
        'Cuiabá, Mato Grosso',
        'São Paulo, São Paulo',
        'Rio de Janeiro, Rio de Janeiro'
      ];
      setCidades(cidadesFallback);
      setFilteredCidades(cidadesFallback);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (cidade: string) => {
    onChange(cidade);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (!open && newValue.length >= 2) {
      setOpen(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder="Digite pelo menos 2 letras da cidade"
            value={value}
            onChange={handleInputChange}
            className="border-gray-300 focus:border-orange-500 pr-8"
            onFocus={() => {
              if (value.length >= 2 || filteredCidades.length > 0) {
                setOpen(true);
              }
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2"
            onClick={() => setOpen(!open)}
            type="button"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2 max-h-60 overflow-y-auto" align="start">
        {loading ? (
          <div className="p-3 text-sm text-gray-500 text-center">
            Carregando cidades...
          </div>
        ) : filteredCidades.length > 0 ? (
          <>
            {value.length < 2 && (
              <div className="p-2 text-xs text-gray-500 border-b mb-2">
                Digite pelo menos 2 letras para filtrar
              </div>
            )}
            {filteredCidades.map((cidade, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-gray-100"
                onClick={() => handleCitySelect(cidade)}
              >
                <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="truncate">{cidade}</span>
              </Button>
            ))}
            {filteredCidades.length === 10 && value.length >= 2 && (
              <div className="p-2 text-xs text-gray-500 text-center border-t mt-2">
                Mostrando primeiros 10 resultados
              </div>
            )}
          </>
        ) : (
          <div className="p-3 text-sm text-gray-500 text-center">
            {value.length < 2 
              ? 'Digite pelo menos 2 letras da cidade' 
              : 'Nenhuma cidade encontrada'
            }
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
