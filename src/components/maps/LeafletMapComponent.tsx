import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Locate } from 'lucide-react';
import { renderToString } from 'react-dom/server';
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
        iconHtml?: string;
        imageUrl?: string;
    }>;
    onMarkerClick?: (marker: any) => void;
    onMapMove?: (center: { lat: number; lng: number }) => void;
    onInteraction?: () => void;
    showControls?: boolean;
    onLocationUpdate?: (location: { lat: number; lng: number }) => void;
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
    showControls = true,
    onLocationUpdate
}) => {
    const isMobile = useIsMobile();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

        const map = L.map(mapContainerRef.current, {
            center: [center.lat, center.lng],
            zoom: zoom,
            minZoom: 3,
            maxBounds: worldBounds,
            maxBoundsViscosity: 1.0,
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
            noWrap: true,
            bounds: worldBounds
        }).addTo(map);

        // Custom Locate Control
        const LocateControl = L.Control.extend({
            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-locate-control');
                const button = L.DomUtil.create('a', 'leaflet-locate-button', container);
                button.innerHTML = renderToString(<Locate size={20} color="white" />);
                button.href = '#';
                button.title = 'Minha Localização';
                button.role = 'button';
                button.style.backgroundColor = '#f97316';
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
                button.style.width = '36px';
                button.style.height = '36px';
                button.style.border = 'none';
                button.style.borderRadius = '8px';
                container.style.border = 'none';
                container.style.marginTop = '10px';
                container.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.2)';

                L.DomEvent.on(button, 'click', function (e) {
                    L.DomEvent.stopPropagation(e);
                    L.DomEvent.preventDefault(e);
                    if (userLocationRef.current) {
                        map.setView([userLocationRef.current.lat, userLocationRef.current.lng], 15);
                    } else if (onInteraction) {
                        onInteraction();
                    }
                });

                return container;
            }
        });

        if (showControls) {
            if (!isMobile) {
                L.control.zoom({ position: 'topright' }).addTo(map);
            }
            new (LocateControl as any)({ position: 'topright' }).addTo(map);
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
                        const loc = { lat: latitude, lng: longitude };
                        setUserLocation(loc);
                        userLocationRef.current = loc;
                        if (onLocationUpdate) {
                            onLocationUpdate(loc);
                        }
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
                    html: `<div class="marker-pin-inner" style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            background-color: #f97316;
            border: 2px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            color: white;
          ">
            ${markerData.iconHtml || '👤'}
          </div>`,
                    iconSize: [44, 44],
                    iconAnchor: [22, 44],
                    popupAnchor: [0, -44]
                })
            });

            marker.addTo(mapInstanceRef.current!);

            // Create popup content
            const popupContent = document.createElement('div');
            popupContent.className = 'custom-popup-content';
            popupContent.innerHTML = `
        <div class="flex flex-col gap-2 p-1">
          <div class="flex items-stretch gap-3 mb-1">
             <div class="w-10 rounded-xl overflow-hidden border border-orange-100 flex items-center justify-center shrink-0 bg-gray-50 flex-col shadow-sm">
               ${markerData.imageUrl
                    ? `<img src="${markerData.imageUrl}" class="w-full h-full object-cover" alt="Categoria" onerror="this.src='https://images.unsplash.com/photo-1558402529-d2638a7023e9?w=100'"/>`
                    : `<div class="text-orange-300 w-full h-full flex items-center justify-center">${markerData.iconHtml || '👤'}</div>`
                }
             </div>
             <div class="flex-1 min-w-0 pr-1 py-0.5 flex flex-col justify-center">
                <span class="block text-[10px] font-black uppercase text-orange-500 leading-none mb-1">${markerData.description || 'Pedido'}</span>
                <h3 class="font-bold text-gray-900 leading-tight text-sm line-clamp-2">${markerData.title}</h3>
             </div>
          </div>
          ${markerData.description ? `<p class="text-xs text-gray-500 font-medium line-clamp-2 mb-1">${markerData.description}</p>` : ''}
          <button class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors outline-none popup-action-btn mt-1 shadow-sm">
             Ver Pedido Completo
          </button>
        </div>
      `;

            const actionBtn = popupContent.querySelector('.popup-action-btn');
            if (actionBtn) {
                actionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (onMarkerClick) {
                        onMarkerClick(markerData);
                    }
                });
            }

            marker.bindPopup(popupContent, {
                closeButton: true,
                minWidth: 220,
                maxWidth: 280,
                className: 'premium-leaflet-popup',
                autoPan: true,
                autoPanPadding: [20, 100] // Padding to keep popup visible, specially useful on mobile to not hide under menus
            });

            // Focus on marker and open popup on click, and ensure it pans nicely
            marker.on('click', function (e) {
                const target = e.target;
                if (mapInstanceRef.current) {
                    // Slight delay to allow popup to render before panning to ensure correct heights
                    setTimeout(() => {
                        const px = mapInstanceRef.current!.project(target.getLatLng());
                        // Offset by -100px on Y axis to center the marker itself slightly lower, giving space to the popup above
                        px.y -= isMobile ? 80 : 120;
                        mapInstanceRef.current!.panTo(mapInstanceRef.current!.unproject(px), { animate: true });
                    }, 50);
                }
            });

            // Hover effects for Z-index and scaling
            marker.on('mouseover', function (e) {
                const icon = e.target.getElement();
                if (icon) {
                    const inner = icon.querySelector('.marker-pin-inner');
                    if (inner) inner.style.transform = 'scale(1.15)';
                    icon.style.zIndex = '1000';
                }
            });

            marker.on('mouseout', function (e) {
                const icon = e.target.getElement();
                if (icon) {
                    const inner = icon.querySelector('.marker-pin-inner');
                    if (inner) inner.style.transform = 'scale(1)';
                    icon.style.zIndex = '';
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
                
                /* Premium Popup Styling */
                .premium-leaflet-popup .leaflet-popup-content-wrapper {
                    background: white;
                    border-radius: 20px;
                    padding: 8px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(249, 115, 22, 0.1);
                }
                .premium-leaflet-popup .leaflet-popup-tip-container {
                    width: 24px;
                    height: 12px;
                }
                .premium-leaflet-popup .leaflet-popup-tip {
                    background: white;
                    box-shadow: 0 3px 14px rgba(0,0,0,0.1);
                }
                .premium-leaflet-popup .leaflet-popup-close-button {
                    top: 12px;
                    right: 12px;
                    color: #9ca3af;
                }
                .premium-leaflet-popup .leaflet-popup-content {
                    margin: 0;
                    line-height: inherit;
                }
                `}
            </style>
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};
