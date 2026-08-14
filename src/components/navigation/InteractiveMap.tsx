import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Layers, Maximize2, Minimize2, Compass, Crosshair, Navigation } from "lucide-react";

export type MapTileLayer = "dark" | "satellite" | "light" | "osm";

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  notes?: string;
}

interface InteractiveMapProps {
  currentLat: number;
  currentLng: number;
  targetLat?: number;
  targetLng?: number;
  waypoints?: Waypoint[];
  tileLayer: MapTileLayer;
  onTileLayerChange: (layer: MapTileLayer) => void;
  onMapClick?: (lat: number, lng: number) => void;
  routeCoordinates?: [number, number][];
  activeWaypointId?: string;
  onSelectWaypoint?: (wp: Waypoint) => void;
  showRadarOverlay?: boolean;
}

const TILE_URLS: Record<MapTileLayer, { url: string; attribution: string }> = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap contributors'
  }
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentLat,
  currentLng,
  targetLat,
  targetLng,
  waypoints = [],
  tileLayer,
  onTileLayerChange,
  onMapClick,
  routeCoordinates = [],
  activeWaypointId,
  onSelectWaypoint,
  showRadarOverlay = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create custom leaflet icons
    const map = L.map(mapContainerRef.current, {
      center: [currentLat, currentLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    const initialTiles = L.tileLayer(TILE_URLS[tileLayer].url, {
      maxZoom: 19,
      attribution: TILE_URLS[tileLayer].attribution
    }).addTo(map);

    tileLayerRef.current = initialTiles;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const newTiles = L.tileLayer(TILE_URLS[tileLayer].url, {
      maxZoom: 19,
      attribution: TILE_URLS[tileLayer].attribution
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTiles;
  }, [tileLayer]);

  // Update Radar Overlay Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (showRadarOverlay) {
      if (!radarLayerRef.current) {
        const radar = L.tileLayer("https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02", {
          maxZoom: 18,
          opacity: 0.55
        }).addTo(mapInstanceRef.current);
        radarLayerRef.current = radar;
      }
    } else {
      if (radarLayerRef.current) {
        mapInstanceRef.current.removeLayer(radarLayerRef.current);
        radarLayerRef.current = null;
      }
    }
  }, [showRadarOverlay]);

  // Update Center and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. User Position Pulsing Icon
    const userHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-5 h-5 bg-cyan-400 border-2 border-white rounded-full shadow-lg shadow-cyan-400/50 flex items-center justify-center">
          <div class="w-1.5 h-1.5 bg-black rounded-full"></div>
        </div>
        <div class="absolute inset-[-6px] border-2 border-cyan-400/60 rounded-full animate-ping pointer-events-none"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: "custom-leaflet-user-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const userMarker = L.marker([currentLat, currentLng], { icon: userIcon }).addTo(markersGroup);
    userMarker.bindPopup(`
      <div style="font-family: monospace; font-size: 11px; padding: 4px;">
        <strong style="color: #00f2ff;">CURRENT POSITION</strong><br/>
        Lat: ${currentLat.toFixed(5)}<br/>
        Lng: ${currentLng.toFixed(5)}
      </div>
    `);
    userMarkerRef.current = userMarker;

    // 2. Waypoint Markers
    waypoints.forEach(wp => {
      const isActive = wp.id === activeWaypointId;
      const isTarget = targetLat !== undefined && targetLng !== undefined && 
                       Math.abs(wp.lat - targetLat) < 0.0001 && Math.abs(wp.lng - targetLng) < 0.0001;

      const markerColor = isTarget ? "#ec4899" : isActive ? "#eab308" : "#8b5cf6";

      const wpHtml = `
        <div class="relative group cursor-pointer">
          <div style="background-color: ${markerColor};" class="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center text-black font-mono font-bold text-[10px] shadow-lg shadow-purple-500/40">
            <span>●</span>
          </div>
          <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 text-white border border-white/20 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-90 font-mono">
            ${wp.name}
          </div>
        </div>
      `;

      const wpIcon = L.divIcon({
        html: wpHtml,
        className: "custom-leaflet-wp-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: wpIcon }).addTo(markersGroup);
      marker.on("click", () => {
        if (onSelectWaypoint) onSelectWaypoint(wp);
      });
      marker.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; padding: 4px;">
          <strong style="color: ${markerColor};">${wp.name}</strong><br/>
          ${wp.category ? `Category: ${wp.category}<br/>` : ''}
          Lat: ${wp.lat.toFixed(5)}<br/>
          Lng: ${wp.lng.toFixed(5)}
        </div>
      `);
    });

    // 3. Target Destination Pin if set and distinct
    if (targetLat !== undefined && targetLng !== undefined) {
      const targetHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-6 h-6 bg-pink-500 border-2 border-white rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-500/50">
            <span style="font-size: 10px; font-weight: bold;">★</span>
          </div>
          <div class="absolute inset-[-4px] border-2 border-pink-400/70 rounded-full animate-pulse"></div>
        </div>
      `;
      const targetIcon = L.divIcon({
        html: targetHtml,
        className: "custom-leaflet-target-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      const targetMarker = L.marker([targetLat, targetLng], { icon: targetIcon }).addTo(markersGroup);
      targetMarker.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; padding: 4px;">
          <strong style="color: #ec4899;">DESTINATION NODE</strong><br/>
          Lat: ${targetLat.toFixed(5)}<br/>
          Lng: ${targetLng.toFixed(5)}
        </div>
      `);
    }

    // 4. Route Polyline
    if (routeCoordinates.length > 0) {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
      }
      const polyline = L.polyline(routeCoordinates, {
        color: "#00f2ff",
        weight: 4,
        opacity: 0.85,
        dashArray: "8, 8",
        lineCap: "round"
      }).addTo(map);

      routeLayerRef.current = polyline;

      // Fit bounds to cover both origin and destination
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    } else {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
    }
  }, [currentLat, currentLng, targetLat, targetLng, waypoints, activeWaypointId, routeCoordinates]);

  const handleCenterUser = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([currentLat, currentLng], 14, {
      duration: 1.2
    });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-nexus-border/60 shadow-2xl bg-black">
      {/* Real Interactive Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Futuristic Map Vignette / Corner Accents */}
      <div className="absolute inset-0 pointer-events-none border border-cyan-500/20 rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />

      {/* Top Controls Overlay: Tile Switcher */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl">
        <span className="text-[10px] font-mono text-nexus-text-dim px-2 hidden sm:inline flex items-center gap-1">
          <Layers className="w-3 h-3 text-nexus-accent" /> Mode:
        </span>
        {(["dark", "satellite", "light", "osm"] as MapTileLayer[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onTileLayerChange(mode)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono capitalize transition-all ${
              tileLayer === mode
                ? "bg-nexus-accent text-black font-bold shadow-md shadow-cyan-400/20"
                : "text-nexus-text-dim hover:text-white hover:bg-white/10"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Top Right: Status Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30 flex items-center gap-2 text-xs font-mono text-white shadow-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-bold">GPS ACTIVE</span>
          <span className="text-[10px] text-nexus-text-dim border-l border-white/10 pl-2">
            {currentLat.toFixed(4)}°, {currentLng.toFixed(4)}°
          </span>
        </div>
      </div>

      {/* Bottom Right: Zoom & Center Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleCenterUser}
          title="Recenter on current coordinates"
          className="p-3 bg-black/80 hover:bg-nexus-accent hover:text-black text-cyan-400 rounded-2xl border border-cyan-500/30 shadow-xl backdrop-blur-md transition-all group"
        >
          <Crosshair className="w-4 h-4 group-hover:rotate-45 transition-transform" />
        </button>

        <div className="flex flex-col bg-black/80 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2.5 text-white hover:bg-white/10 transition-colors text-xs font-mono font-bold text-center"
          >
            +
          </button>
          <div className="h-px bg-white/10" />
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2.5 text-white hover:bg-white/10 transition-colors text-xs font-mono font-bold text-center"
          >
            -
          </button>
        </div>
      </div>

      {/* Bottom Left: Hint Bar */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-nexus-text-dim flex items-center gap-2">
        <Navigation className="w-3 h-3 text-nexus-accent" />
        <span>Click anywhere on map to set Destination or inspect coordinates</span>
      </div>
    </div>
  );
};
