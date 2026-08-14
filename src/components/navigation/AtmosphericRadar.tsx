import React from "react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Wind, 
  Droplets, 
  Zap, 
  Eye, 
  Gauge, 
  Radio, 
  ShieldCheck,
  Compass
} from "lucide-react";

export interface EnvironmentalTelemetry {
  temperatureC: number;
  feelsLikeC: number;
  condition: string;
  windSpeedKmh: number;
  windDirectionDeg: number;
  humidityPct: number;
  pressureHpa: number;
  uvIndex: number;
  uvDescription: string;
  airQualityIndex: number;
  airQualityDescription: string;
  visibilityKm: number;
  cloudCoverPct: number;
  hourlyForecast: {
    time: string;
    temp: number;
    icon: string;
    condition: string;
  }[];
}

interface AtmosphericRadarProps {
  telemetry: EnvironmentalTelemetry;
  showRadarOverlay: boolean;
  onToggleRadar: () => void;
}

export const AtmosphericRadar: React.FC<AtmosphericRadarProps> = ({
  telemetry,
  showRadarOverlay,
  onToggleRadar
}) => {
  return (
    <div className="glass p-6 rounded-3xl border border-nexus-border/60 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white leading-tight">
              Atmospheric & Environmental Radar
            </h3>
            <p className="text-[10px] text-nexus-text-dim font-mono">Live Geospatial Weather Feed</p>
          </div>
        </div>

        <button
          onClick={onToggleRadar}
          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
            showRadarOverlay
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-md shadow-cyan-500/20"
              : "bg-white/5 border-white/10 text-nexus-text-dim hover:text-white"
          }`}
          title="Toggle Precipitation Radar Layer"
        >
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>Radar {showRadarOverlay ? "ON" : "OFF"}</span>
        </button>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-baseline justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.04] to-transparent border border-white/5">
        <div>
          <span className="text-5xl font-display font-bold text-white tracking-tight">
            {telemetry.temperatureC.toFixed(1)}°
          </span>
          <span className="text-sm text-nexus-text-dim ml-2 font-mono">
            Feels like {telemetry.feelsLikeC.toFixed(1)}°
          </span>
          <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest mt-1">
            {telemetry.condition}
          </p>
        </div>

        {/* AQI Pill */}
        <div className="text-right space-y-1">
          <span className="text-[10px] font-mono text-nexus-text-dim uppercase block">Air Quality</span>
          <span className="inline-block px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-mono font-bold">
            AQI {telemetry.airQualityIndex} • {telemetry.airQualityDescription}
          </span>
        </div>
      </div>

      {/* 6-Grid Environmental Sensor Metrics */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1 text-nexus-text-dim text-[10px] font-mono">
            <Wind className="w-3 h-3 text-cyan-400" />
            <span>WIND</span>
          </div>
          <p className="text-xs font-bold text-white font-mono">
            {telemetry.windSpeedKmh} km/h
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1 text-nexus-text-dim text-[10px] font-mono">
            <Droplets className="w-3 h-3 text-blue-400" />
            <span>HUMIDITY</span>
          </div>
          <p className="text-xs font-bold text-white font-mono">
            {telemetry.humidityPct}%
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1 text-nexus-text-dim text-[10px] font-mono">
            <Gauge className="w-3 h-3 text-purple-400" />
            <span>PRESSURE</span>
          </div>
          <p className="text-xs font-bold text-white font-mono">
            {telemetry.pressureHpa} hPa
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1 text-nexus-text-dim text-[10px] font-mono">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>UV INDEX</span>
          </div>
          <p className="text-xs font-bold text-white font-mono">
            {telemetry.uvIndex} ({telemetry.uvDescription})
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1 text-nexus-text-dim text-[10px] font-mono">
            <Eye className="w-3 h-3 text-green-400" />
            <span>VISIBILITY</span>
          </div>
          <p className="text-xs font-bold text-white font-mono">
            {telemetry.visibilityKm} km
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1 text-nexus-text-dim text-[10px] font-mono">
            <Cloud className="w-3 h-3 text-gray-400" />
            <span>CLOUD COVER</span>
          </div>
          <p className="text-xs font-bold text-white font-mono">
            {telemetry.cloudCoverPct}%
          </p>
        </div>
      </div>

      {/* Synoptic Hourly Forecast */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-wider block">
          Upcoming Hourly Projections
        </span>
        <div className="grid grid-cols-4 gap-2">
          {telemetry.hourlyForecast.map((hour, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 text-center space-y-1 transition-colors"
            >
              <span className="text-[10px] font-mono text-nexus-text-dim block">{hour.time}</span>
              <div className="flex justify-center text-cyan-400 my-0.5">
                {hour.condition.includes("Rain") ? (
                  <CloudRain className="w-4 h-4 text-blue-400" />
                ) : hour.condition.includes("Cloud") ? (
                  <Cloud className="w-4 h-4 text-gray-400" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <span className="text-xs font-bold text-white font-mono block">{hour.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
