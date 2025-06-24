
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoienVyYm8iLCJhIjoiY21jYXY1aHhsMDdrODJsb3B5cG1obm13MyJ9.ZiQVy5e_cS76E07l9HlYLA';

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
  markers?: Array<{
    lng: number;
    lat: number;
    title: string;
    description?: string;
    color?: string;
  }>;
  bairrosAtendidos?: string[];
  showControls?: boolean;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({
  center = [-55.5, -11.87], // Coordenadas de Sinop, MT
  zoom = 12,
  className = '',
  height = '400px',
  markers = [],
  bairrosAtendidos = [],
  showControls = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

    if (showControls) {
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  // Add markers when map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current || markers.length === 0) return;

    markers.forEach((marker, index) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = marker.color || '#f97316';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      
      // Add icon
      const icon = document.createElement('div');
      icon.innerHTML = '👤';
      icon.style.fontSize = '14px';
      el.appendChild(icon);

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${marker.title}</h3>
            ${marker.description ? `<p class="text-xs text-gray-600 mt-1">${marker.description}</p>` : ''}
          </div>
        `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [mapLoaded, markers]);

  // Highlight bairros atendidos
  useEffect(() => {
    if (!mapLoaded || !map.current || bairrosAtendidos.length === 0) return;

    // Add a simple circle overlay for each bairro (simplified approach)
    // In a real implementation, you would use actual neighborhood polygons
    const bairroCoords: { [key: string]: [number, number] } = {
      'Centro': [-55.5, -11.87],
      'Jardim Botânico': [-55.48, -11.85],
      'Residencial Anaterra': [-55.52, -11.89],
      'Vila Rica': [-55.51, -11.86],
      'Jardim Primavera': [-55.49, -11.88],
      'Setor Industrial': [-55.53, -11.90],
      'Jardim das Flores': [-55.47, -11.84],
      'Cidade Alta': [-55.50, -11.83]
    };

    bairrosAtendidos.forEach((bairro, index) => {
      const coords = bairroCoords[bairro];
      if (coords) {
        const el = document.createElement('div');
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = 'rgba(249, 115, 22, 0.2)';
        el.style.border = '2px solid #f97316';
        el.style.pointerEvents = 'none';

        new mapboxgl.Marker(el, { anchor: 'center' })
          .setLngLat(coords)
          .addTo(map.current!);
      }
    });
  }, [mapLoaded, bairrosAtendidos]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
};
