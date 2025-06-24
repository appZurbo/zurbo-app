
import React, { useState } from 'react';
import { MapboxMap } from './MapboxMap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Filter } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';

interface MapFilterProps {
  prestadores: UserProfile[];
  onBairroFilter: (bairros: string[]) => void;
  selectedBairros: string[];
}

export const MapFilter: React.FC<MapFilterProps> = ({
  prestadores,
  onBairroFilter,
  selectedBairros
}) => {
  const [showMap, setShowMap] = useState(false);

  const bairrosSinop = [
    'Centro',
    'Jardim Botânico', 
    'Residencial Anaterra',
    'Vila Rica',
    'Jardim Primavera',
    'Setor Industrial',
    'Jardim das Flores',
    'Cidade Alta'
  ];

  // Criar markers para os prestadores
  const markers = prestadores.map((prestador, index) => {
    const variation = (parseInt(prestador.id.slice(-1)) || 0) * 0.005;
    return {
      lng: -55.5 + variation,
      lat: -11.87 + variation,
      title: prestador.nome,
      description: `${prestador.prestador_servicos?.length || 0} serviços`,
      color: prestador.premium ? '#fbbf24' : '#f97316'
    };
  });

  const handleBairroToggle = (bairro: string) => {
    const newSelection = selectedBairros.includes(bairro)
      ? selectedBairros.filter(b => b !== bairro)
      : [...selectedBairros, bairro];
    onBairroFilter(newSelection);
  };

  const clearFilters = () => {
    onBairroFilter([]);
  };

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Filtrar por Localização</h3>
            {selectedBairros.length > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {selectedBairros.length} selecionados
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
            </Button>
            {selectedBairros.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Filtros de bairro */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">Selecione os bairros:</p>
          <div className="flex flex-wrap gap-2">
            {bairrosSinop.map((bairro) => (
              <Button
                key={bairro}
                variant={selectedBairros.includes(bairro) ? "default" : "outline"}
                size="sm"
                onClick={() => handleBairroToggle(bairro)}
                className={selectedBairros.includes(bairro) 
                  ? "bg-orange-500 hover:bg-orange-600" 
                  : "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                }
              >
                {bairro}
              </Button>
            ))}
          </div>
        </div>

        {/* Mapa */}
        {showMap && (
          <div className="border rounded-lg overflow-hidden">
            <MapboxMap
              center={[-55.5, -11.87]}
              zoom={12}
              height="350px"
              markers={markers}
              bairrosAtendidos={selectedBairros}
              showControls={true}
            />
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {prestadores.length} prestadores encontrados
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Prestador</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
