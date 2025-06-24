
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

// Dynamic import for mapbox-gl to handle build issues
let mapboxgl: any = null;

const loadMapbox = async () => {
  if (!mapboxgl) {
    try {
      const mapbox = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');
      mapboxgl = mapbox.default || mapbox;
      
      // Set access token
      mapboxgl.accessToken = 'pk.eyJ1IjoienVyYm8iLCJhIjoiY21jYXY1aHhsMDdrODJsb3B5cG1obm13MyJ9.ZiQVy5e_cS76E07l9HlYLA';
    } catch (error) {
      console.error('Failed to load Mapbox GL:', error);
    }
  }
  return mapboxgl;
};

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
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const initMapbox = async () => {
      try {
        const mapbox = await loadMapbox();
        if (mapbox) {
          setMapboxLoaded(true);
        } else {
          setLoadError(true);
        }
      } catch (error) {
        console.error('Error loading mapbox:', error);
        setLoadError(true);
      }
    };

    initMapbox();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxLoaded || !mapboxgl) return;

    try {
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
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError(true);
    }
  }, [mapboxLoaded, center, zoom, showControls]);

  // Add markers when map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current || !mapboxgl || markers.length === 0) return;

    markers.forEach((marker) => {
      try {
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
          .addTo(map.current);
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [mapLoaded, markers]);

  // Highlight bairros atendidos
  useEffect(() => {
    if (!mapLoaded || !map.current || !mapboxgl || bairrosAtendidos.length === 0) return;

    try {
      // Add a simple circle overlay for each bairro (simplified approach)
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

      bairrosAtendidos.forEach((bairro) => {
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
            .addTo(map.current);
        }
      });
    } catch (error) {
      console.error('Error adding bairro highlights:', error);
    }
  }, [mapLoaded, bairrosAtendidos]);

  if (loadError) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Erro ao carregar mapa</p>
            <p className="text-xs text-gray-400">Verifique sua conexão</p>
          </div>
        </div>
      </div>
    );
  }

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
