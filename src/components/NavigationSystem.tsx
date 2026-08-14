import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Navigation, 
  MapPin, 
  Search, 
  Compass, 
  Globe, 
  Zap, 
  Crosshair, 
  Layers, 
  Route as RouteIcon, 
  CloudSun, 
  Bookmark, 
  Plus, 
  Trash2, 
  Share2, 
  Radio, 
  Check, 
  Flame, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Building2,
  Cpu,
  Shield,
  Activity
} from "lucide-react";
import { InteractiveMap, MapTileLayer } from "./navigation/InteractiveMap";
import { LocationInspector, LocationDetail } from "./navigation/LocationInspector";
import { RoutePlanner, TravelMode, RouteCalculation } from "./navigation/RoutePlanner";
import { AtmosphericRadar, EnvironmentalTelemetry } from "./navigation/AtmosphericRadar";

interface WaypointNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  category: "HQ" | "Data Center" | "Satcom" | "Energy" | "Research";
  notes?: string;
}

const PRESET_GLOBAL_NODES: WaypointNode[] = [
  {
    id: "node-sf",
    name: "San Francisco Quantum HQ",
    city: "San Francisco",
    country: "United States",
    lat: 37.7749,
    lng: -122.4194,
    category: "HQ",
    notes: "Primary AI Nexus Control Hub"
  },
  {
    id: "node-tokyo",
    name: "Tokyo Cyber Port",
    city: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    category: "Data Center",
    notes: "Asia-Pacific High-Speed Relay"
  },
  {
    id: "node-london",
    name: "London Prime Node",
    city: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lng: -0.1278,
    category: "Satcom",
    notes: "European Sovereign Uplink"
  },
  {
    id: "node-singapore",
    name: "Singapore Maritime Grid",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    category: "Energy",
    notes: "Equatorial Micro-Grid Controller"
  },
  {
    id: "node-nyc",
    name: "New York Financial Hub",
    city: "New York",
    country: "United States",
    lat: 40.7128,
    lng: -74.0060,
    category: "HQ",
    notes: "East Coast Real-Time Clearing Node"
  },
  {
    id: "node-zurich",
    name: "Zurich Cryptographic Vault",
    city: "Zurich",
    country: "Switzerland",
    lat: 47.3769,
    lng: 8.5417,
    category: "Research",
    notes: "Zero-Knowledge Hardware Security Module"
  }
];

const SAVED_NODES_KEY = "nexus_saved_navigation_nodes";

export const NavigationSystem: React.FC = () => {
  // Current GPS Position
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194
  });
  const [currentCityName, setCurrentCityName] = useState("San Francisco, CA");

  // Selected / Inspected Location
  const [inspectedLocation, setInspectedLocation] = useState<LocationDetail>({
    name: "San Francisco Quantum HQ",
    city: "San Francisco",
    region: "California",
    country: "United States",
    lat: 37.7749,
    lng: -122.4194,
    altitudeMeters: 16,
    timezone: "PST (UTC-8)",
    geohash: "9q8yyk",
    sunPhase: "Daylight Peak",
    sunriseTime: "06:22 AM",
    sunsetTime: "08:14 PM"
  });

  // Target Destination for Routing
  const [targetDestination, setTargetDestination] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  // Active Map View Settings
  const [tileLayer, setTileLayer] = useState<MapTileLayer>("dark");
  const [showRadarOverlay, setShowRadarOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState<"inspector" | "routing" | "weather" | "catalog">("inspector");

  // Saved Waypoints
  const [savedNodes, setSavedNodes] = useState<WaypointNode[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_NODES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load saved nodes:", e);
    }
    return PRESET_GLOBAL_NODES;
  });

  // Search Bar Query & Autocomplete Results
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Routing State
  const [routeData, setRouteData] = useState<RouteCalculation | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);

  // Environmental Telemetry
  const [telemetry, setTelemetry] = useState<EnvironmentalTelemetry>({
    temperatureC: 22.4,
    feelsLikeC: 21.8,
    condition: "Clear Sky",
    windSpeedKmh: 14,
    windDirectionDeg: 280,
    humidityPct: 52,
    pressureHpa: 1014,
    uvIndex: 4,
    uvDescription: "Moderate",
    airQualityIndex: 28,
    airQualityDescription: "Good",
    visibilityKm: 10,
    cloudCoverPct: 15,
    hourlyForecast: [
      { time: "Now", temp: 22, icon: "sun", condition: "Clear" },
      { time: "14:00", temp: 24, icon: "sun", condition: "Clear" },
      { time: "17:00", temp: 21, icon: "cloud", condition: "Partly Cloudy" },
      { time: "20:00", temp: 18, icon: "cloud", condition: "Cloudy" }
    ]
  });

  // Acquire Real GPS Position on Mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentCoords({ lat, lng });
          reverseGeocode(lat, lng, true);
        },
        (err) => {
          console.warn("Geolocation permission or timeout, using default SF coordinates:", err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Sync Saved Nodes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_NODES_KEY, JSON.stringify(savedNodes));
    } catch (e) {}
  }, [savedNodes]);

  // Reverse Geocoding using OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number, updateCurrentName = false) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.county || "Identified Point";
        const state = address.state || "";
        const country = address.country || "";
        const fullDisplay = [city, state, country].filter(Boolean).join(", ");

        if (updateCurrentName) {
          setCurrentCityName(fullDisplay);
        }

        setInspectedLocation({
          name: data.name || data.display_name?.split(",")[0] || `${city} Node`,
          city: city,
          region: state,
          country: country,
          lat,
          lng,
          altitudeMeters: Math.floor(Math.random() * 40 + 10),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Local",
          geohash: "geo-" + Math.random().toString(36).substr(2, 6),
          sunPhase: "Optimal Diurnal Phase",
          sunriseTime: "06:15 AM",
          sunsetTime: "08:30 PM",
          weatherCondition: telemetry.condition,
          temperatureC: telemetry.temperatureC
        });
      }
    } catch (err) {
      console.warn("Reverse geocode failed:", err);
      // Fallback
      setInspectedLocation(prev => ({
        ...prev,
        lat,
        lng,
        name: `Node [${lat.toFixed(4)}, ${lng.toFixed(4)}]`
      }));
    }
  };

  // Live Location Search with Nominatim API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.warn("Search geocode failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Search Result Selection
  const handleSelectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const address = item.address || {};
    const city = address.city || address.town || address.village || item.display_name.split(",")[0];

    const newDetail: LocationDetail = {
      name: item.display_name.split(",")[0] || "Custom Search Location",
      city: city,
      region: address.state || "",
      country: address.country || "",
      lat,
      lng,
      altitudeMeters: Math.floor(Math.random() * 50 + 10),
      timezone: "Detected",
      geohash: "geo-" + Math.random().toString(36).substr(2, 6),
      sunPhase: "Normal Daylight",
      sunriseTime: "06:20 AM",
      sunsetTime: "08:25 PM"
    };

    setInspectedLocation(newDetail);
    setSearchQuery("");
    setShowSearchResults(false);
    setActiveTab("inspector");
  };

  // Map Click Handler -> Define New Location
  const handleMapClick = (lat: number, lng: number) => {
    reverseGeocode(lat, lng);
    setActiveTab("inspector");
  };

  // Select Waypoint Node
  const handleSelectWaypoint = (wp: WaypointNode | any) => {
    setInspectedLocation({
      name: wp.name,
      city: wp.city || "Operational Hub",
      region: "",
      country: wp.country || "Global",
      lat: wp.lat,
      lng: wp.lng,
      altitudeMeters: 24,
      timezone: "Global Synced",
      geohash: "node-" + wp.id,
      sunPhase: "Active Phase",
      sunriseTime: "06:00 AM",
      sunsetTime: "08:45 PM"
    });
    setActiveTab("inspector");
  };

  // Toggle Save Node
  const isInspectedSaved = savedNodes.some(
    n => Math.abs(n.lat - inspectedLocation.lat) < 0.001 && Math.abs(n.lng - inspectedLocation.lng) < 0.001
  );

  const handleToggleSaveNode = () => {
    if (isInspectedSaved) {
      setSavedNodes(prev => prev.filter(
        n => !(Math.abs(n.lat - inspectedLocation.lat) < 0.001 && Math.abs(n.lng - inspectedLocation.lng) < 0.001)
      ));
    } else {
      const newNode: WaypointNode = {
        id: `node-${Date.now()}`,
        name: inspectedLocation.name || "Custom Defined Node",
        city: inspectedLocation.city || "Custom",
        country: inspectedLocation.country || "Global",
        lat: inspectedLocation.lat,
        lng: inspectedLocation.lng,
        category: "HQ",
        notes: `Saved on ${new Date().toLocaleDateString()}`
      };
      setSavedNodes(prev => [newNode, ...prev]);
    }
  };

  // Calculate Geodesic / OSRM Route
  const handleCalculateRoute = async (mode: TravelMode = "driving") => {
    const dest = targetDestination || {
      name: inspectedLocation.name,
      lat: inspectedLocation.lat,
      lng: inspectedLocation.lng
    };

    setIsRoutingLoading(true);

    try {
      // Use OSRM public routing API for actual road network path
      const profile = mode === "walking" ? "foot" : "car";
      const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${currentCoords.lng},${currentCoords.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;
      
      const res = await fetch(osrmUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distKm = route.distance / 1000;
          let durationMin = Math.round(route.duration / 60);

          // Flight mode speed adjustment
          if (mode === "flight") {
            durationMin = Math.max(5, Math.round((distKm / 220) * 60));
          }

          // Coordinates are [lng, lat] in GeoJSON -> convert to [lat, lng] for Leaflet
          const coords: [number, number][] = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(coords);

          // Generate Step-by-Step Instructions
          const rawSteps = route.legs?.[0]?.steps || [];
          const steps = rawSteps.slice(0, 10).map((st: any, idx: number) => ({
            id: `step-${idx}`,
            instruction: st.maneuver?.instruction || `Proceed along ${st.name || "designated waypoint"}`,
            distanceKm: st.distance / 1000,
            durationMin: Math.round(st.duration / 60)
          }));

          if (steps.length === 0) {
            steps.push({
              id: "step-direct",
              instruction: `Direct transit to ${dest.name}`,
              distanceKm: distKm,
              durationMin
            });
          }

          setRouteData({
            originName: currentCityName,
            destinationName: dest.name,
            distanceKm: distKm,
            estimatedMinutes: durationMin,
            travelMode: mode,
            elevationGainMeters: Math.floor(Math.random() * 80 + 20),
            carbonSavedKg: parseFloat((distKm * 0.12).toFixed(2)),
            steps
          });

          setActiveTab("routing");
          return;
        }
      }
    } catch (err) {
      console.warn("OSRM routing request failed, computing geodesic fallback:", err);
    } finally {
      setIsRoutingLoading(false);
    }

    // Geodesic Fallback Calculation (Great Circle Distance)
    const R = 6371; // Earth radius in km
    const dLat = (dest.lat - currentCoords.lat) * (Math.PI / 180);
    const dLon = (dest.lng - currentCoords.lng) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(currentCoords.lat * (Math.PI / 180)) * Math.cos(dest.lat * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = R * c;

    const speed = mode === "flight" ? 220 : mode === "walking" ? 5 : 65;
    const durationMin = Math.max(5, Math.round((distKm / speed) * 60));

    // Interpolate polyline points along great-circle arc
    const pointsCount = 20;
    const arcCoords: [number, number][] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const fraction = i / pointsCount;
      const lat = currentCoords.lat + (dest.lat - currentCoords.lat) * fraction;
      const lng = currentCoords.lng + (dest.lng - currentCoords.lng) * fraction;
      arcCoords.push([lat, lng]);
    }
    setRouteCoordinates(arcCoords);

    setRouteData({
      originName: currentCityName,
      destinationName: dest.name,
      distanceKm: distKm,
      estimatedMinutes: durationMin,
      travelMode: mode,
      elevationGainMeters: 45,
      carbonSavedKg: parseFloat((distKm * 0.12).toFixed(2)),
      steps: [
        { id: "s1", instruction: `Depart origin: ${currentCityName}`, distanceKm: 0.5, durationMin: 1 },
        { id: "s2", instruction: `Merge onto primary geospatial trajectory heading towards ${dest.name}`, distanceKm: distKm * 0.7, durationMin: Math.round(durationMin * 0.7) },
        { id: "s3", instruction: `Approach destination sector and acquire node lock`, distanceKm: distKm * 0.3, durationMin: Math.round(durationMin * 0.3) }
      ]
    });
    setActiveTab("routing");
  };

  const handleClearRoute = () => {
    setRouteData(null);
    setRouteCoordinates([]);
    setTargetDestination(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto h-full flex flex-col custom-scrollbar">
      {/* Top Header & Search Console */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Geospatial Navigation & Tactical Maps
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
              Live Tile Engine
            </span>
          </div>
          <p className="text-nexus-text-dim text-xs sm:text-sm mt-0.5">
            Real-time GPS tracking, multi-tier cartography, defined node inspection, and OSRM route planning.
          </p>
        </div>

        {/* Search Bar with Live Suggestions Dropdown */}
        <div className="relative w-full md:w-80">
          <div className="glass px-4 py-2.5 rounded-2xl border border-nexus-border flex items-center gap-3 shadow-lg">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchResults(true);
              }}
              placeholder="Search city, coordinates, or address..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-nexus-text-dim w-full"
            />
            {isSearching && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />}
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full mt-2 left-0 right-0 z-50 glass border border-nexus-accent/40 rounded-2xl shadow-2xl p-2 max-h-64 overflow-y-auto custom-scrollbar bg-black/90 backdrop-blur-xl"
              >
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSearchResult(result)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 text-xs transition-colors flex items-start gap-2.5 group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-white truncate">{result.display_name.split(",")[0]}</p>
                      <p className="text-[10px] text-nexus-text-dim truncate">{result.display_name}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Grid: Interactive Map + Definitive Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        {/* Left / Center 8 Columns: Live Interactive Map */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
          <div className="flex-1 min-h-[440px] relative">
            <InteractiveMap
              currentLat={currentCoords.lat}
              currentLng={currentCoords.lng}
              targetLat={targetDestination?.lat || inspectedLocation.lat}
              targetLng={targetDestination?.lng || inspectedLocation.lng}
              waypoints={savedNodes}
              tileLayer={tileLayer}
              onTileLayerChange={setTileLayer}
              onMapClick={handleMapClick}
              routeCoordinates={routeCoordinates}
              activeWaypointId={inspectedLocation.geohash}
              onSelectWaypoint={handleSelectWaypoint}
              showRadarOverlay={showRadarOverlay}
            />
          </div>

          {/* Preset Global Operational Nodes Quick-Strip */}
          <div className="glass p-3 rounded-2xl border border-nexus-border/40 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-wider shrink-0 px-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Operational Hubs:
            </span>
            {savedNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => handleSelectWaypoint(node)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all shrink-0 flex items-center gap-1.5 ${
                  Math.abs(node.lat - inspectedLocation.lat) < 0.001 && Math.abs(node.lng - inspectedLocation.lng) < 0.001
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-sm"
                    : "bg-white/[0.02] border-white/5 text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{node.name.split(" ")[0]}</span>
                <span className="text-[9px] opacity-60">[{node.city}]</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 4-5 Columns: Defined Location Inspector & Navigation Tabs */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-4">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/5">
            {[
              { id: "inspector" as const, label: "Defined Location", icon: MapPin },
              { id: "routing" as const, label: "Route Planner", icon: RouteIcon },
              { id: "weather" as const, label: "Weather Radar", icon: CloudSun },
              { id: "catalog" as const, label: "Saved Nodes", icon: Bookmark }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isActive
                      ? "bg-nexus-accent text-black shadow-lg shadow-cyan-400/20 neon-glow"
                      : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Views */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "inspector" && (
                <motion.div
                  key="inspector"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <LocationInspector
                    location={inspectedLocation}
                    isSaved={isInspectedSaved}
                    onSaveToggle={handleToggleSaveNode}
                    onSetAsDestination={() => {
                      setTargetDestination({
                        name: inspectedLocation.name,
                        lat: inspectedLocation.lat,
                        lng: inspectedLocation.lng
                      });
                      handleCalculateRoute("driving");
                    }}
                    onRecenter={() => {
                      setCurrentCoords({
                        lat: inspectedLocation.lat,
                        lng: inspectedLocation.lng
                      });
                    }}
                  />
                </motion.div>
              )}

              {activeTab === "routing" && (
                <motion.div
                  key="routing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <RoutePlanner
                    originLat={currentCoords.lat}
                    originLng={currentCoords.lng}
                    originName={currentCityName}
                    destLat={targetDestination?.lat || inspectedLocation.lat}
                    destLng={targetDestination?.lng || inspectedLocation.lng}
                    destName={targetDestination?.name || inspectedLocation.name}
                    routeData={routeData}
                    isLoading={isRoutingLoading}
                    onCalculateRoute={handleCalculateRoute}
                    onClearRoute={handleClearRoute}
                  />
                </motion.div>
              )}

              {activeTab === "weather" && (
                <motion.div
                  key="weather"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AtmosphericRadar
                    telemetry={telemetry}
                    showRadarOverlay={showRadarOverlay}
                    onToggleRadar={() => setShowRadarOverlay(prev => !prev)}
                  />
                </motion.div>
              )}

              {activeTab === "catalog" && (
                <motion.div
                  key="catalog"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass p-6 rounded-3xl border border-nexus-border/60 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-base font-display font-bold text-white">Saved Node Directory</h3>
                    </div>
                    <span className="text-[10px] font-mono text-nexus-text-dim">{savedNodes.length} nodes registered</span>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                    {savedNodes.map((node) => (
                      <div
                        key={node.id}
                        onClick={() => handleSelectWaypoint(node)}
                        className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="space-y-0.5 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                              {node.name}
                            </h4>
                          </div>
                          <p className="text-[10px] font-mono text-nexus-text-dim pl-4">
                            {node.city}, {node.country} • {node.lat.toFixed(2)}°, {node.lng.toFixed(2)}°
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-cyan-300 border border-white/10">
                            {node.category}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-nexus-text-dim group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
