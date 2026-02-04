import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

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
    }>;
    onMarkerClick?: (marker: any) => void;
    showControls?: boolean;
}

export const LeafletMapComponent: React.FC<LeafletMapComponentProps> = ({
    center = { lat: -11.87, lng: -55.5 }, // Sinop, MT
    zoom = 13,
    className = '',
    height = '400px',
    markers = [],
    onMarkerClick,
    showControls = true
}) => {
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
        });

        // Add Tile Layer (CartoDB Positron for minimalist look)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        if (showControls) {
            L.control.zoom({ position: 'bottomright' }).addTo(map);
        }

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
            width: 30px;
            height: 30px;
            background-color: ${markerData.color || '#f97316'};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            font-size: 14px;
            cursor: pointer;
          ">👤</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
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
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};
