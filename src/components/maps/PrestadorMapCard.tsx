
import React from 'react';
import { MapboxMap } from './MapboxMap';
import { UserProfile } from '@/utils/database/types';

interface PrestadorMapCardProps {
  prestador: UserProfile;
  height?: string;
  showBairros?: boolean;
}

export const PrestadorMapCard: React.FC<PrestadorMapCardProps> = ({
  prestador,
  height = '200px',
  showBairros = true
}) => {
  // Coordenadas base de Sinop (seria ideal ter as coordenadas específicas do prestador)
  const baseCoords: [number, number] = [-55.5, -11.87];
  
  // Simular uma pequena variação baseada no ID do prestador para demonstração
  const variation = (parseInt(prestador.id.slice(-1)) || 0) * 0.005;
  const prestadorCoords: [number, number] = [
    baseCoords[0] + variation,
    baseCoords[1] + variation
  ];

  const markers = [
    {
      lng: prestadorCoords[0],
      lat: prestadorCoords[1],
      title: prestador.nome,
      description: prestador.endereco_cidade || 'Sinop, MT',
      color: '#f97316'
    }
  ];

  // Bairros atendidos pelo prestador (simulados)
  const bairrosAtendidos = showBairros ? [
    'Centro', 'Jardim Botânico', 'Vila Rica'
  ] : [];

  return (
    <div className="bg-white rounded-lg overflow-hidden border">
      <div className="p-3 border-b bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700">Área de Atendimento</h4>
        <p className="text-xs text-gray-500">
          {prestador.endereco_cidade || 'Sinop, MT'}
        </p>
      </div>
      <MapboxMap
        center={prestadorCoords}
        zoom={13}
        height={height}
        markers={markers}
        bairrosAtendidos={bairrosAtendidos}
        showControls={false}
      />
      {showBairros && bairrosAtendidos.length > 0 && (
        <div className="p-3 bg-gray-50 border-t">
          <p className="text-xs text-gray-600 mb-1">Bairros atendidos:</p>
          <div className="flex flex-wrap gap-1">
            {bairrosAtendidos.map((bairro) => (
              <span
                key={bairro}
                className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
              >
                {bairro}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
