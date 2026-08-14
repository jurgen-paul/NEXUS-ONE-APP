import React, { useState } from "react";
import { 
  Navigation, 
  Car, 
  Plane, 
  Footprints, 
  Clock, 
  Route as RouteIcon, 
  CheckCircle2, 
  Compass, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Zap
} from "lucide-react";

export type TravelMode = "driving" | "flight" | "transit" | "walking";

export interface RouteStep {
  id: string;
  instruction: string;
  distanceKm: number;
  durationMin: number;
  icon?: string;
}

export interface RouteCalculation {
  originName: string;
  destinationName: string;
  distanceKm: number;
  estimatedMinutes: number;
  travelMode: TravelMode;
  elevationGainMeters: number;
  carbonSavedKg: number;
  steps: RouteStep[];
}

interface RoutePlannerProps {
  originLat: number;
  originLng: number;
  originName: string;
  destLat?: number;
  destLng?: number;
  destName?: string;
  routeData?: RouteCalculation | null;
  isLoading?: boolean;
  onCalculateRoute?: (mode: TravelMode) => void;
  onClearRoute?: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  originName,
  destName,
  destLat,
  destLng,
  routeData,
  isLoading = false,
  onCalculateRoute,
  onClearRoute
}) => {
  const [selectedMode, setSelectedMode] = useState<TravelMode>("driving");

  const handleModeChange = (mode: TravelMode) => {
    setSelectedMode(mode);
    if (onCalculateRoute) {
      onCalculateRoute(mode);
    }
  };

  const hasDestination = destLat !== undefined && destLng !== undefined;

  return (
    <div className="glass p-6 rounded-3xl border border-nexus-border/60 shadow-xl space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center">
            <RouteIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white leading-tight">
              Route Engine & Turn Guidance
            </h3>
            <p className="text-[10px] text-nexus-text-dim font-mono">OSRM Geodesic Telemetry</p>
          </div>
        </div>

        {routeData && onClearRoute && (
          <button
            onClick={onClearRoute}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-nexus-text-dim hover:text-red-400 transition-colors"
            title="Reset Route"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Origin & Destination Nodes */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
          <div className="flex-1 truncate">
            <span className="text-[10px] text-nexus-text-dim uppercase block">Origin</span>
            <span className="text-white font-bold truncate">{originName || "Current GPS Location"}</span>
          </div>
        </div>

        <div className="h-px bg-white/5 mx-1" />

        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
          <div className="flex-1 truncate">
            <span className="text-[10px] text-nexus-text-dim uppercase block">Destination</span>
            <span className={`font-bold truncate ${hasDestination ? "text-white" : "text-nexus-text-dim italic"}`}>
              {hasDestination ? (destName || `${destLat?.toFixed(4)}, ${destLng?.toFixed(4)}`) : "Click map or select POI..."}
            </span>
          </div>
        </div>
      </div>

      {/* Travel Mode Selector */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "driving" as TravelMode, label: "Vehicle", icon: Car, speed: "65 km/h" },
          { id: "flight" as TravelMode, label: "Drone / Air", icon: Plane, speed: "220 km/h" },
          { id: "walking" as TravelMode, label: "Walking", icon: Footprints, speed: "5 km/h" }
        ].map((m) => {
          const Icon = m.icon;
          const isActive = selectedMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                isActive
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-500/20"
                  : "bg-white/[0.02] border-white/5 text-nexus-text-dim hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] font-bold">{m.label}</span>
              <span className="text-[9px] font-mono text-nexus-text-dim">{m.speed}</span>
            </button>
          );
        })}
      </div>

      {/* Computed Metrics Summary */}
      {routeData ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block">Distance</span>
              <span className="text-lg font-display font-bold text-white">
                {routeData.distanceKm.toFixed(1)} <span className="text-xs font-normal">km</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <span className="text-[10px] font-mono text-purple-400 uppercase block">Est. Time</span>
              <span className="text-lg font-display font-bold text-white">
                {routeData.estimatedMinutes >= 60 
                  ? `${Math.floor(routeData.estimatedMinutes / 60)}h ${routeData.estimatedMinutes % 60}m`
                  : `${routeData.estimatedMinutes} min`}
              </span>
            </div>
          </div>

          {/* Turn-by-Turn Guidance List */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-wider block">
              Step Guidance ({routeData.steps.length} checkpoints)
            </span>
            <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
              {routeData.steps.map((step, idx) => (
                <div 
                  key={step.id || idx}
                  className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-white/5 text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-white text-xs leading-tight">{step.instruction}</span>
                  </div>
                  <span className="font-mono text-[10px] text-nexus-text-dim shrink-0">
                    {step.distanceKm.toFixed(1)} km
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : hasDestination ? (
        <button
          onClick={() => onCalculateRoute && onCalculateRoute(selectedMode)}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="animate-pulse">Computing Geodesic Path...</span>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Calculate Optimal Route</span>
            </>
          )}
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-nexus-text-dim space-y-1">
          <Navigation className="w-6 h-6 mx-auto text-nexus-text-dim/40" />
          <p className="text-xs font-medium text-white">No Destination Set</p>
          <p className="text-[11px]">Click anywhere on the map or select a preset operational node to calculate route.</p>
        </div>
      )}
    </div>
  );
};
