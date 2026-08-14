import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Box, 
  Cpu, 
  Layers, 
  Zap, 
  Activity, 
  Radio, 
  Compass, 
  Sparkles,
  Maximize2,
  ShieldCheck
} from "lucide-react";
import { spatialAudio } from "./SpatialAudioSynth";

interface HoloSubsystem {
  id: string;
  name: string;
  category: string;
  value: string;
  status: "optimal" | "active" | "standby";
  icon: any;
  color: string;
  details: string;
}

const HOLO_SUBSYSTEMS: HoloSubsystem[] = [
  {
    id: "sub-1",
    name: "QUANTUM COHERENCE",
    category: "Superposition Matrix",
    value: "99.982%",
    status: "optimal",
    icon: Cpu,
    color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
    details: "Zero thermal decoherence in spatial qubit register"
  },
  {
    id: "sub-2",
    name: "6DoF INERTIAL DRIFT",
    category: "Visual Odometry",
    value: "±0.003 mm",
    status: "optimal",
    icon: Compass,
    color: "text-pink-400 border-pink-500/40 bg-pink-500/10",
    details: "Sub-millimeter spatial anchor locking across 360°"
  },
  {
    id: "sub-3",
    name: "NEURAL LATENCY",
    category: "Photon-to-Motion",
    value: "0.12 ms",
    status: "optimal",
    icon: Activity,
    color: "text-green-400 border-green-500/40 bg-green-500/10",
    details: "Near-instantaneous holographic frame presentation"
  },
  {
    id: "sub-4",
    name: "SPATIAL AUDIO RAYTRACING",
    category: "Acoustic Reflection",
    value: "128 Channels",
    status: "active",
    icon: Radio,
    color: "text-purple-400 border-purple-500/40 bg-purple-500/10",
    details: "Binaural HRTF room simulation enabled"
  }
];

interface SpatialHoloCubeProps {
  mouseOffset: { x: number; y: number };
  onSelectSubsystem?: (sub: HoloSubsystem) => void;
}

export const SpatialHoloCube: React.FC<SpatialHoloCubeProps> = ({
  mouseOffset,
  onSelectSubsystem
}) => {
  const [activeSubsystem, setActiveSubsystem] = useState<HoloSubsystem>(HOLO_SUBSYSTEMS[0]);

  const handleSelect = (sub: HoloSubsystem) => {
    spatialAudio.playHoloPinch();
    setActiveSubsystem(sub);
    if (onSelectSubsystem) onSelectSubsystem(sub);
  };

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center perspective-[1200px] overflow-hidden select-none">
      {/* Background Holographic Depth Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="w-[480px] h-[480px] rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite]" />
        <div className="w-[360px] h-[360px] rounded-full border border-dashed border-purple-500/30 animate-[spin_30s_linear_infinite_reverse]" />
        <div className="w-[240px] h-[240px] rounded-full border border-pink-500/20" />
      </div>

      {/* 3D Motion Stage */}
      <motion.div
        animate={{
          rotateX: -mouseOffset.y * 15,
          rotateY: mouseOffset.x * 15
        }}
        transition={{ type: "spring", stiffness: 45, damping: 20 }}
        className="relative w-[340px] sm:w-[420px] preserve-3d z-10 flex flex-col items-center"
      >
        {/* Central Rotating Holographic Qubit Core */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(0,242,255,0.3)] animate-pulse" />
          
          {/* 3D Rotating Gyroscope Rings */}
          <div className="absolute inset-3 rounded-full border border-purple-400/60 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-6 rounded-full border-2 border-dashed border-pink-400/50 animate-[spin_12s_linear_infinite_reverse]" />

          {/* Central Glowing Core Orb */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.6)] transform rotate-45 animate-bounce">
            <Box className="w-7 h-7 text-white transform -rotate-45" />
          </div>
        </div>

        {/* Holographic Core Status Header */}
        <div className="glass px-6 py-3 rounded-2xl border border-cyan-500/30 text-center mb-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-center gap-2 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>NEXUS QUANTUM CORE ONLINE</span>
          </div>
          <p className="text-[10px] text-nexus-text-dim mt-0.5 font-mono">
            Spatial Anchor Stability: 100.0% • Coherence: Ultra-High
          </p>
        </div>

        {/* Interactive Floating Subsystem Cards */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {HOLO_SUBSYSTEMS.map((sub) => {
            const Icon = sub.icon;
            const isSelected = activeSubsystem.id === sub.id;
            return (
              <motion.div
                key={sub.id}
                onClick={() => handleSelect(sub)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? `${sub.color} shadow-[0_0_25px_rgba(0,242,255,0.25)] border-cyan-400`
                    : "bg-black/60 hover:bg-white/5 border-white/10 text-nexus-text-dim"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-[10px] font-bold text-white font-mono">{sub.name}</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-display font-black text-white">{sub.value}</span>
                  <span className="text-[9px] font-mono uppercase text-nexus-text-dim">{sub.category}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
