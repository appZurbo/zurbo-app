import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapComponentProps {
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

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
    center = { lat: -11.87, lng: -55.5 }, // Sinop, MT
    zoom = 12,
    className = '',
    height = '400px',
    markers = [],
    onMarkerClick,
    showControls = true
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Load Google Maps Script
    useEffect(() => {
        const loadGoogleMaps = () => {
            if ((window as any).google && (window as any).google.maps) {
                setMapLoaded(true);
                return;
            }

            const script = document.createElement('script');
            // Using Google Maps without API key (limited features but works for basic usage)
            // For production, you should get a free API key from Google Cloud Console
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
            script.async = true;
            script.defer = true;
            script.onload = () => setMapLoaded(true);
            script.onerror = () => setLoadError(true);
            document.head.appendChild(script);
        };

        loadGoogleMaps();
    }, []);

    // Get user's geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Geolocation error:', error);
                    // Fallback to default location (Sinop)
                }
            );
        }
    }, []);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || !mapLoaded || !(window as any).google) return;

        try {
            // Determine initial center: user location if available and near Brazil, otherwise default
            let initialCenter = center;
            if (userLocation) {
                // Check if user is in Brazil (rough bounds)
                if (userLocation.lat >= -34 && userLocation.lat <= 5 &&
                    userLocation.lng >= -74 && userLocation.lng <= -34) {
                    initialCenter = userLocation;
                }
            }

            map.current = new google.maps.Map(mapContainer.current, {
                center: initialCenter,
                zoom: zoom,
                mapTypeControl: showControls,
                streetViewControl: showControls,
                fullscreenControl: showControls,
                zoomControl: showControls,
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'geometry',
                        stylers: [{ color: '#f5f5f5' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#c9e6f2' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#ffffff' }]
                    }
                ]
            });

            // Add user location marker if available
            if (userLocation && map.current) {
                new google.maps.Marker({
                    position: userLocation,
                    map: map.current,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    },
                    title: 'Sua Localização'
                });
            }

        } catch (error) {
            console.error('Error initializing map:', error);
            setLoadError(true);
        }
    }, [mapLoaded, center, zoom, showControls, userLocation]);

    // Add markers
    useEffect(() => {
        if (!map.current || !(window as any).google || markers.length === 0) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add new markers
        markers.forEach((markerData) => {
            const marker = new google.maps.Marker({
                position: { lat: markerData.lat, lng: markerData.lng },
                map: map.current!,
                title: markerData.title,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: markerData.color || '#f97316',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 4px 0;">${markerData.title}</h3>
            ${markerData.description ? `<p style="font-size: 12px; color: #666; margin: 0;">${markerData.description}</p>` : ''}
          </div>
        `
            });

            marker.addListener('click', () => {
                infoWindow.open(map.current!, marker);
                if (onMarkerClick) {
                    onMarkerClick(markerData);
                }
            });

            markersRef.current.push(marker);
        });

        // Fit bounds to show all markers if there are any
        if (markers.length > 0 && map.current) {
            const bounds = new google.maps.LatLngBounds();
            markers.forEach(marker => {
                bounds.extend({ lat: marker.lat, lng: marker.lng });
            });
            if (userLocation) {
                bounds.extend(userLocation);
            }
            map.current.fitBounds(bounds);
        }
    }, [markers, onMarkerClick, userLocation]);

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
