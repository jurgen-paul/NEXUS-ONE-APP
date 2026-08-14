import React, { useState } from "react";
import { 
  Scan, 
  Target, 
  Layers, 
  Cpu, 
  Compass, 
  Radio, 
  Camera, 
  Download, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Sliders,
  Volume2,
  VolumeX,
  Maximize2,
  Check
} from "lucide-react";
import { RecognizedObject } from "./CameraFeedLayer";
import { spatialAudio } from "./SpatialAudioSynth";

interface SpatialVisionInspectorProps {
  selectedTarget: RecognizedObject | null;
  mode: string;
  depthSlice: number;
  onDepthSliceChange: (val: number) => void;
  onTakeSnapshot: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SpatialVisionInspector: React.FC<SpatialVisionInspectorProps> = ({
  selectedTarget,
  mode,
  depthSlice,
  onDepthSliceChange,
  onTakeSnapshot,
  isMuted,
  onToggleMute
}) => {
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  const handleCapture = () => {
    spatialAudio.playScanSweep();
    setSnapshotTaken(true);
    onTakeSnapshot();
    setTimeout(() => setSnapshotTaken(false), 2500);
  };

  return (
    <div className="glass p-6 rounded-3xl border border-nexus-border/60 shadow-2xl space-y-6 flex flex-col justify-between h-full bg-black/60 backdrop-blur-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center neon-glow">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white leading-tight">
                Spatial Vision Telemetry
              </h3>
              <p className="text-[10px] text-nexus-text-dim font-mono">6DoF SLAM & LiDAR Processor</p>
            </div>
          </div>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors border border-white/10"
            title={isMuted ? "Unmute Spatial Audio" : "Mute Spatial Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Target Focus or Default Inspection Card */}
      {selectedTarget ? (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-xs font-bold text-cyan-300 uppercase">{selectedTarget.label}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-400 text-black text-[9px] font-bold">
              {(selectedTarget.confidence * 100).toFixed(0)}% LOCK
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-nexus-text-dim block">CATEGORY</span>
              <span className="text-white font-bold">{selectedTarget.category}</span>
            </div>
            <div>
              <span className="text-nexus-text-dim block">EST. RANGE</span>
              <span className="text-white font-bold">{selectedTarget.distanceMeters} m</span>
            </div>
          </div>

          <p className="text-[10px] text-nexus-text-dim border-t border-white/10 pt-2 leading-relaxed">
            {selectedTarget.details}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-1">
          <Target className="w-6 h-6 mx-auto text-nexus-text-dim/40" />
          <p className="text-xs font-medium text-white">No Target Locked</p>
          <p className="text-[10px] text-nexus-text-dim font-mono">
            Click any spatial bounding reticle on the viewfinder to inspect distance and optical parameters.
          </p>
        </div>
      )}

      {/* LiDAR Depth Slicing Slider */}
      <div className="space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-nexus-text-dim flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEPTH CUTOFF RANGE</span>
          </span>
          <span className="text-cyan-300 font-bold">{depthSlice}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={depthSlice}
          onChange={(e) => onDepthSliceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-[9px] text-nexus-text-dim">
          <span>Near (0.2m)</span>
          <span>Mid (5.0m)</span>
          <span>Infinity (50m+)</span>
        </div>
      </div>

      {/* Optical Sensor Vitals Breakdown */}
      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-[9px] text-nexus-text-dim uppercase block">TRACKING RATE</span>
          <span className="text-base font-bold text-white">120 <span className="text-xs font-normal text-nexus-text-dim">Hz</span></span>
        </div>
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <span className="text-[9px] text-nexus-text-dim uppercase block">FOV APERTURE</span>
          <span className="text-base font-bold text-white">110° <span className="text-xs font-normal text-nexus-text-dim">diag</span></span>
        </div>
      </div>

      {/* Action Trigger Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleCapture}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          {snapshotTaken ? (
            <>
              <Check className="w-4 h-4 text-black" />
              <span>Spatial Telemetry Captured!</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Capture Holographic Snapshot</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-[10px] font-mono text-nexus-text-dim px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Optics Engine v4.8 Active
          </span>
          <span>6DoF SLAM Stable</span>
        </div>
      </div>
    </div>
  );
};
