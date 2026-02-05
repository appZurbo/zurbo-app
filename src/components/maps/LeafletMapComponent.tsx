import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Fix for default marker icons in Leaflet with React
// This handles the missing icon asset issue common in react-leaflet/leaflet usage
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapComponentProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    className?: string;
    height?: string;
    markers?: Array<{
        lng: number;
        lat: number;
        title: string;
        description?: string;
        color?: string;
        id?: string;
        iconUrl?: string;
    }>;
    onMarkerClick?: (marker: any) => void;
    onMapMove?: (center: { lat: number; lng: number }) => void;
    onInteraction?: () => void;
    showControls?: boolean;
}

export const LeafletMapComponent: React.FC<LeafletMapComponentProps> = ({
    center = { lat: -11.87, lng: -55.5 }, // Sinop, MT
    zoom = 13,
    className = '',
    height = '400px',
    markers = [],
    onMarkerClick,
    onMapMove,
    onInteraction,
    showControls = true
}) => {
    const isMobile = useIsMobile();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: [center.lat, center.lng],
            zoom: zoom,
            zoomControl: false, // We will add it manually if needed, or use default
            attributionControl: false // Hide default attribution
        });

        // Mapbox Tile Layer (Light v11 for premium clean look)
        const mapboxAccessToken = 'pk.eyJ1IjoienVyYm8iLCJhIjoiY21jYXY1aHhsMDdrODJsb3B5cG1obm13MyJ9.ZiQVy5e_cS76E07l9HlYLA';

        L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}{r}?access_token=${mapboxAccessToken}`, {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            tileSize: 512,
            zoomOffset: -1,
            maxZoom: 18,
        }).addTo(map);

        if (showControls && !isMobile) {
            L.control.zoom({ position: 'topright' }).addTo(map);
        }

        map.on('moveend', () => {
            if (onMapMove) {
                const newCenter = map.getCenter();
                onMapMove({ lat: newCenter.lat, lng: newCenter.lng });
            }
        });

        map.on('movestart', () => {
            if (onInteraction) {
                onInteraction();
            }
        });

        mapInstanceRef.current = map;
        setInitialized(true);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []); // Run once on mount

    // Handle Geolocation
    useEffect(() => {
        if (navigator.geolocation && !userLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Check if in Brazil (rough bounds)
                    if (latitude >= -34 && latitude <= 5 && longitude >= -74 && longitude <= -34) {
                        setUserLocation({ lat: latitude, lng: longitude });
                        // Only pan if we are at default position (Sinop)
                        if (mapInstanceRef.current && center.lat === -11.87 && center.lng === -55.5) {
                            mapInstanceRef.current.setView([latitude, longitude], zoom);
                        }
                    }
                },
                (error) => console.error("Geolocation error:", error)
            );
        }
    }, [center]);

    // Handle Markers Update
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // Add User Location Marker
        if (userLocation) {
            const userMarker = L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                    className: 'bg-transparent',
                    html: `<div style="
            width: 16px; 
            height: 16px; 
            background-color: #4285F4; 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
          "></div>`,
                    iconSize: [20, 20]
                })
            }).addTo(mapInstanceRef.current);

            userMarker.bindPopup("Sua localização atual");
            markersRef.current.push(userMarker);
        }

        // Add Request Markers
        markers.forEach(markerData => {
            const marker = L.marker([markerData.lat, markerData.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            background-color: #ffffff;
            border: 3px solid #f97316;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
            font-size: 18px;
            cursor: pointer;
            overflow: hidden;
            transition: all 0.2s;
          ">
            ${markerData.iconUrl
                            ? `<img src="${markerData.iconUrl}" style="width: 100%; height: 100%; object-fit: contain; padding: 4px;" />`
                            : '👤'
                        }
          </div>`,
                    iconSize: [44, 44],
                    iconAnchor: [22, 22]
                })
            });

            marker.addTo(mapInstanceRef.current!);

            // Create popup content
            const popupContent = document.createElement('div');
            popupContent.innerHTML = `
        <div class="p-1">
          <h3 class="font-semibold text-sm mb-1">${markerData.title}</h3>
          ${markerData.description ? `<p class="text-xs text-gray-600 m-0">${markerData.description}</p>` : ''}
        </div>
      `;

            marker.bindPopup(popupContent);

            marker.on('click', () => {
                if (onMarkerClick) {
                    onMarkerClick(markerData);
                }
            });

            markersRef.current.push(marker);
        });

    }, [markers, userLocation]);

    return (
        <div className={`relative ${className} z-0`} style={{ height }}>
            <style>
                {`
                .leaflet-top.leaflet-right {
                    top: 20px;
                    right: 20px;
                }
                .leaflet-control-zoom {
                    display: flex !important;
                    flex-direction: row !important;
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                }
                .leaflet-control-zoom a {
                    width: 36px !important;
                    height: 36px !important;
                    line-height: 36px !important;
                    color: #4b5563 !important;
                    font-size: 18px !important;
                    border: 1px solid #e5e7eb !important;
                    background-color: white !important;
                    transition: all 0.2s;
                }
                .leaflet-control-zoom a:hover {
                    background-color: #f9fafb !important;
                    color: #f97316 !important;
                }
                .leaflet-control-zoom-in {
                    border-right: none !important;
                    border-radius: 8px 0 0 8px !important;
                }
                .leaflet-control-zoom-out {
                    border-radius: 0 8px 8px 0 !important;
                }
                `}
            </style>
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};
