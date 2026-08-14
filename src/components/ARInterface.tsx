import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Box, 
  Layers, 
  Navigation, 
  Zap, 
  Layout, 
  Maximize2, 
  ChevronRight,
  Target,
  Activity,
  Cpu,
  Globe,
  Maximize,
  Compass,
  Camera,
  CameraOff,
  Radio,
  Sliders,
  Scan,
  Sparkles,
  Eye,
  Crosshair,
  Volume2,
  VolumeX,
  RefreshCw,
  Sun,
  ShieldCheck
} from "lucide-react";
import { CameraFeedLayer, VisionFeedMode, RecognizedObject } from "./ar/CameraFeedLayer";
import { LidarPointCloudCanvas } from "./ar/LidarPointCloudCanvas";
import { SpatialHoloCube } from "./ar/SpatialHoloCube";
import { SpatialVisionInspector } from "./ar/SpatialVisionInspector";
import { spatialAudio } from "./ar/SpatialAudioSynth";

export type ARDisplayMode = "camera_hud" | "lidar_cloud" | "holo_core";
export type HUDColorTheme = "cyan" | "emerald" | "amber" | "violet";

export const ARInterface: React.FC = () => {
  // Main AR Viewport Mode
  const [displayMode, setDisplayMode] = useState<ARDisplayMode>("camera_hud");
  const [feedMode, setFeedMode] = useState<VisionFeedMode>("cyber_lidar");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [hudTheme, setHudTheme] = useState<HUDColorTheme>("cyan");
  const [showScanSweep, setShowScanSweep] = useState<boolean>(true);
  const [depthSlice, setDepthSlice] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<RecognizedObject | null>(null);

  // Mouse Parallax Offset
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
        y: (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleModeChange = (mode: ARDisplayMode) => {
    if (!isMuted) spatialAudio.playScanSweep();
    setDisplayMode(mode);
  };

  const handleFeedChange = (feed: VisionFeedMode) => {
    if (!isMuted) spatialAudio.playHoloPinch();
    setFeedMode(feed);
  };

  const handleTakeSnapshot = () => {
    // Generate snapshot download payload
    const reportData = {
      timestamp: new Date().toISOString(),
      displayMode,
      feedMode,
      selectedTarget,
      depthSlice,
      opticalResolution: "1080p 6DoF",
      spatialAnchorsDetected: 3,
      quantumCoherence: "99.982%"
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-spatial-scan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 select-none custom-scrollbar"
    >
      {/* Top Header & Optical Controller Bar */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 z-20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2.5">
              <Eye className="w-6 h-6 text-cyan-400" />
              <span>Augmented Reality & Spatial Optics</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
              6DoF SLAM
            </span>
          </div>
          <p className="text-nexus-text-dim text-xs sm:text-sm mt-0.5">
            Real-time visual odometry, LiDAR point cloud scanning, and holographic spatial projection HUD.
          </p>
        </div>

        {/* Top Control Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
            {[
              { id: "camera_hud" as ARDisplayMode, label: "Spatial Viewfinder", icon: Camera },
              { id: "lidar_cloud" as ARDisplayMode, label: "3D LiDAR Scanner", icon: Zap },
              { id: "holo_core" as ARDisplayMode, label: "Quantum HoloCore", icon: Box }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = displayMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleModeChange(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20"
                      : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Camera On/Off Toggle */}
          {displayMode === "camera_hud" && (
            <button
              onClick={() => setIsCameraActive((prev) => !prev)}
              className={`p-2 rounded-xl border transition-all text-xs font-mono flex items-center gap-1.5 ${
                isCameraActive
                  ? "bg-green-500/20 text-green-400 border-green-500/40"
                  : "bg-white/5 text-nexus-text-dim border-white/10 hover:text-white"
              }`}
              title="Toggle Live Webcam Device"
            >
              {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            </button>
          )}

          {/* Scan Sweep Toggle */}
          <button
            onClick={() => setShowScanSweep((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all ${
              showScanSweep
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                : "bg-white/5 text-nexus-text-dim border-white/10 hover:text-white"
            }`}
            title="Toggle Laser Scan Sweep"
          >
            <Scan className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout: AR Viewport Stage + Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[560px]">
        {/* AR Stage (8 Columns) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
          <div className="relative flex-1 min-h-[460px] rounded-3xl overflow-hidden border border-nexus-border/60 shadow-2xl bg-black flex items-center justify-center">
            {/* Viewport Vignette & Reticles */}
            <div className="absolute inset-0 pointer-events-none z-10 border border-cyan-500/20 rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />

            {/* Top Viewport Status HUD */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-cyan-500/30 flex items-center gap-2 text-xs font-mono text-white shadow-xl">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-bold">SLAM 6DoF</span>
                <span className="text-[10px] text-nexus-text-dim border-l border-white/10 pl-2">
                  X: {mousePos.x.toFixed(2)} | Y: {mousePos.y.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Top Right: Sensor Feed Mode Switcher for Camera View */}
            {displayMode === "camera_hud" && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-2xl border border-white/10">
                {(["live_camera", "cyber_lidar", "wireframe_mesh", "thermal"] as VisionFeedMode[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleFeedChange(f)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-mono uppercase transition-all ${
                      feedMode === f
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold"
                        : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {f.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}

            {/* Display Mode 1: Camera & Visual Odometry HUD */}
            {displayMode === "camera_hud" && (
              <CameraFeedLayer
                mode={feedMode}
                hudColor={hudTheme}
                showScanSweep={showScanSweep}
                selectedTarget={selectedTarget}
                onSelectTarget={(t) => setSelectedTarget(t)}
                isCameraActive={isCameraActive}
                onToggleCamera={() => setIsCameraActive((prev) => !prev)}
              />
            )}

            {/* Display Mode 2: Interactive LiDAR 3D Point Cloud */}
            {displayMode === "lidar_cloud" && (
              <LidarPointCloudCanvas
                hudColor={hudTheme}
                depthSlice={depthSlice}
              />
            )}

            {/* Display Mode 3: Quantum Holographic Core */}
            {displayMode === "holo_core" && (
              <SpatialHoloCube
                mouseOffset={mousePos}
              />
            )}

            {/* Bottom Viewport Hint */}
            <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-nexus-text-dim flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>Move cursor for 3D parallax • Hover/Click targets for spatial lock</span>
            </div>
          </div>

          {/* Quick Spatial Modes Action Row */}
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <div className="glass p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-white text-[11px] font-bold">ODOMETRY LOCK</span>
              </div>
              <span className="text-green-400 font-bold text-[10px]">SUB-MILLIMETER</span>
            </div>

            <div className="glass p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-white text-[11px] font-bold">REFRESH RATE</span>
              </div>
              <span className="text-cyan-400 font-bold text-[10px]">120 FPS</span>
            </div>

            <div className="glass p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-white text-[11px] font-bold">PHOTON LATENCY</span>
              </div>
              <span className="text-purple-400 font-bold text-[10px]">0.12 ms</span>
            </div>
          </div>
        </div>

        {/* Right Telemetry & Spatial Inspector (4-5 Columns) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <SpatialVisionInspector
            selectedTarget={selectedTarget}
            mode={displayMode}
            depthSlice={depthSlice}
            onDepthSliceChange={setDepthSlice}
            onTakeSnapshot={handleTakeSnapshot}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
};
