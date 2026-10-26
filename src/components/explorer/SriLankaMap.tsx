import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ZoomIn, ZoomOut, Compass, Sparkles, Navigation } from 'lucide-react';
import { ExplorerPlace } from '../../types/explorer';

interface SriLankaMapProps {
  places: ExplorerPlace[];
  selectedPlaceId?: string | null;
  onSelectPlace: (place: ExplorerPlace) => void;
  onMapClickCoordinates?: (lat: number, lng: number) => void;
  isPinPlacingMode?: boolean;
}

declare global {
  interface Window {
    L?: any;
  }
}

export const SriLankaMap: React.FC<SriLankaMapProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onMapClickCoordinates,
  isPinPlacingMode = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(7.5);

  // Sri Lanka Geographic Center coordinates
  const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };

  // Load Leaflet CSS and JS dynamically if not already on window
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (window.L) {
        if (isMounted) setMapLoaded(true);
        return;
      }

      // Add CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add Script
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          if (isMounted) setMapLoaded(true);
        };
        script.onerror = () => {
          console.warn('Leaflet remote script failed to load. Vector fallback active.');
          if (isMounted) setMapLoaded(false);
        };
        document.body.appendChild(script);
      } else {
        // Wait for script to finish loading
        const checkL = setInterval(() => {
          if (window.L) {
            clearInterval(checkL);
            if (isMounted) setMapLoaded(true);
          }
        }, 100);
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !window.L || mapInstanceRef.current) return;

    try {
      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: [SRI_LANKA_CENTER.lat, SRI_LANKA_CENTER.lng],
        zoom: 7.5,
        minZoom: 2, // Allows zooming all the way out to full World View
        maxZoom: 18, // Allows zooming in to street and building detail
        zoomControl: false // Custom controls
      });

      // OpenStreetMap high-resolution standard tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Marker group
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      map.on('click', (e: any) => {
        if (onMapClickCoordinates) {
          onMapClickCoordinates(e.latlng.lat, e.latlng.lng);
        }
      });
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !window.L) return;

    const L = window.L;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    places.forEach((place) => {
      if (!place.latitude || !place.longitude) return;

      const isSelected = place.id === selectedPlaceId;

      // Color based on classification
      const color =
        place.status === 'visited'
          ? '#10B981' // emerald
          : place.status === 'favourite'
          ? '#F59E0B' // amber
          : '#3B82F6'; // blue

      const iconHtml = `
        <div style="
          background-color: ${color};
          width: ${isSelected ? '32px' : '26px'};
          height: ${isSelected ? '32px' : '26px'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          <span style="color: white; font-size: ${isSelected ? '14px' : '11px'}; font-weight: bold;">
            ${place.status === 'favourite' ? '★' : place.status === 'visited' ? '✓' : '●'}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: iconHtml,
        iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13]
      });

      const marker = L.marker([place.latitude, place.longitude], { icon: customIcon });

      marker.on('click', () => {
        onSelectPlace(place);
      });

      // Tooltip
      marker.bindTooltip(`<strong>${place.title}</strong><br/><span style="font-size:10px; opacity:0.8">${place.district} • ${place.status.replace('_', ' ')}</span>`, {
        direction: 'top',
        offset: [0, -10]
      });

      marker.addTo(markersLayer);
    });
  }, [places, selectedPlaceId, mapLoaded]);

  // Center on selected place if changed
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlaceId) return;
    const selected = places.find((p) => p.id === selectedPlaceId);
    if (selected && selected.latitude && selected.longitude) {
      mapInstanceRef.current.flyTo([selected.latitude, selected.longitude], 12, { duration: 1.2 });
    }
  }, [selectedPlaceId]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetToSriLanka = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([SRI_LANKA_CENTER.lat, SRI_LANKA_CENTER.lng], 7.5, { duration: 1 });
    }
  };

  const handleZoomToWorld = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([15, 75], 3, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-[450px] sm:h-[540px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-[#0d131f]">
      {/* Map Target Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Pin Placing Mode Banner */}
      {isPinPlacingMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4 fill-slate-950" />
          <span>Click anywhere on the map to set location coordinates!</span>
        </div>
      )}

      {/* Floating Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 shadow-md transition-all active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 shadow-md transition-all active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Reset to Sri Lanka View */}
        <button
          onClick={handleResetToSriLanka}
          className="px-2.5 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-md flex items-center gap-1 transition-all active:scale-95"
          title="Focus on Sri Lanka"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>SL Focus</span>
        </button>

        {/* Zoom to World View */}
        <button
          onClick={handleZoomToWorld}
          className="px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-[11px] font-bold shadow-md flex items-center gap-1 hover:bg-white transition-all active:scale-95"
          title="Zoom out to World Map"
        >
          <Compass className="w-3.5 h-3.5 text-blue-500" />
          <span>World</span>
        </button>
      </div>

      {/* Legend Badge Bar */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-[#0E1522]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-2.5 rounded-2xl shadow-lg flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 border border-white" />
          <span>Want to Visit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
          <span>Favourite ★</span>
        </div>
        <span className="text-slate-400 font-mono text-[10px]">
          Zoom: {currentZoom.toFixed(1)}x
        </span>
      </div>
    </div>
  );
};
