import React from "react";
import { 
  MapPin, 
  Globe, 
  Compass, 
  Sun, 
  Moon, 
  Clock, 
  ExternalLink, 
  Bookmark, 
  Check, 
  Navigation, 
  Copy, 
  Share2,
  Sparkles,
  Layers,
  Wind
} from "lucide-react";
import { motion } from "motion/react";

export interface LocationDetail {
  name: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  altitudeMeters: number;
  timezone: string;
  geohash: string;
  sunPhase: string;
  sunriseTime: string;
  sunsetTime: string;
  weatherCondition?: string;
  temperatureC?: number;
}

interface LocationInspectorProps {
  location: LocationDetail;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  onSetAsDestination?: () => void;
  onRecenter?: () => void;
}

export const LocationInspector: React.FC<LocationInspectorProps> = ({
  location,
  isSaved = false,
  onSaveToggle,
  onSetAsDestination,
  onRecenter
}) => {
  const [copied, setCopied] = React.useState(false);

  const formatDMS = (deg: number, isLat: boolean): string => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    const direction = isLat ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W";
    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  };

  const handleCopyCoords = () => {
    const text = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=15/${location.lat}/${location.lng}`;

  return (
    <div className="glass p-6 rounded-3xl border border-nexus-border/60 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
      {/* Background Accent Grid */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Header with Title & Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-nexus-accent/20 border border-nexus-accent/40 text-nexus-accent flex items-center justify-center neon-glow">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                Defined Node Inspector
              </span>
              <h3 className="text-xl font-display font-bold text-white leading-tight">
                {location.name || "Target Coordinate"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onSaveToggle && (
              <button
                onClick={onSaveToggle}
                className={`p-2 rounded-xl border transition-all ${
                  isSaved 
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" 
                    : "bg-white/5 border-white/10 text-nexus-text-dim hover:text-white hover:bg-white/10"
                }`}
                title={isSaved ? "Remove from saved nodes" : "Save node to memory"}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              onClick={handleCopyCoords}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors"
              title="Copy GPS coordinates"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <p className="text-xs text-nexus-text-dim flex items-center gap-1.5 mt-1">
          <Globe className="w-3.5 h-3.5 text-nexus-text-dim/60" />
          <span>{[location.city, location.region, location.country].filter(Boolean).join(", ") || "Global Geographic Point"}</span>
        </p>
      </div>

      {/* Geodetic Coordinates Breakdown */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 font-mono">
        <div className="flex justify-between items-center text-xs">
          <span className="text-nexus-text-dim">DECIMAL GPS</span>
          <span className="text-cyan-300 font-bold tracking-wider">
            {location.lat.toFixed(5)}°, {location.lng.toFixed(5)}°
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px] text-nexus-text-dim border-t border-white/5 pt-2">
          <span>DMS COORDS</span>
          <span className="text-white">
            {formatDMS(location.lat, true)} | {formatDMS(location.lng, false)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2 text-[10px]">
          <div>
            <span className="text-nexus-text-dim block">ELEVATION</span>
            <span className="text-white font-bold">{location.altitudeMeters || 18} m MSL</span>
          </div>
          <div>
            <span className="text-nexus-text-dim block">TIMEZONE</span>
            <span className="text-white font-bold">{location.timezone || "UTC"}</span>
          </div>
        </div>
      </div>

      {/* Solar & Diurnal Ephemeris Cycle */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-yellow-400 text-xs">
            <Sun className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] text-nexus-text-dim">SUNRISE</span>
          </div>
          <p className="text-sm font-bold text-white font-mono">{location.sunriseTime || "06:18 AM"}</p>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-400 text-xs">
            <Moon className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] text-nexus-text-dim">SUNSET</span>
          </div>
          <p className="text-sm font-bold text-white font-mono">{location.sunsetTime || "08:42 PM"}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <div className="grid grid-cols-2 gap-2">
          {onSetAsDestination && (
            <button
              onClick={onSetAsDestination}
              className="px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate Route</span>
            </button>
          )}

          {onRecenter && (
            <button
              onClick={onRecenter}
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-nexus-accent" />
              <span>Center Map</span>
            </button>
          )}
        </div>

        {/* External Deep Links */}
        <div className="flex items-center justify-between text-[11px] px-1 pt-1 font-mono text-nexus-text-dim">
          <span>External Map Deep Links:</span>
          <div className="flex items-center gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              Google Maps <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <a
              href={osmUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              OSM <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
