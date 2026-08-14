import React, { useRef, useEffect, useState } from "react";
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Scan, 
  Target, 
  ShieldAlert, 
  Eye, 
  Sparkles,
  Flame,
  Grid3X3,
  Layers,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { spatialAudio } from "./SpatialAudioSynth";

export type VisionFeedMode = "live_camera" | "cyber_lidar" | "wireframe_mesh" | "thermal";

export interface RecognizedObject {
  id: string;
  label: string;
  category: "Structure" | "Neural Gateway" | "Spatial Anchor" | "Biological" | "Sensor Node";
  confidence: number;
  distanceMeters: number;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  details: string;
}

const SAMPLE_RECOGNIZED_TARGETS: RecognizedObject[] = [
  {
    id: "obj-1",
    label: "SPATIAL_ANCHOR_#01",
    category: "Spatial Anchor",
    confidence: 0.98,
    distanceMeters: 1.45,
    xPct: 22,
    yPct: 28,
    widthPct: 18,
    heightPct: 22,
    details: "Zero-drift 6DoF tracking reference point"
  },
  {
    id: "obj-2",
    label: "NEURAL_TERMINAL_NODE",
    category: "Neural Gateway",
    confidence: 0.94,
    distanceMeters: 2.80,
    xPct: 62,
    yPct: 35,
    widthPct: 24,
    heightPct: 30,
    details: "High-bandwidth optical telemetry transceiver"
  },
  {
    id: "obj-3",
    label: "BIOMETRIC_OPERATOR",
    category: "Biological",
    confidence: 0.99,
    distanceMeters: 0.85,
    xPct: 42,
    yPct: 58,
    widthPct: 16,
    heightPct: 18,
    details: "Vital signs stable, Iris scan authenticated"
  }
];

interface CameraFeedLayerProps {
  mode: VisionFeedMode;
  hudColor: string; // CSS color string or class
  showScanSweep: boolean;
  selectedTarget: RecognizedObject | null;
  onSelectTarget: (target: RecognizedObject) => void;
  isCameraActive: boolean;
  onToggleCamera: () => void;
}

export const CameraFeedLayer: React.FC<CameraFeedLayerProps> = ({
  mode,
  hudColor,
  showScanSweep,
  selectedTarget,
  onSelectTarget,
  isCameraActive,
  onToggleCamera
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedTargets, setDetectedTargets] = useState<RecognizedObject[]>(SAMPLE_RECOGNIZED_TARGETS);

  // Initialize or Stop Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isCameraActive && mode === "live_camera") {
      navigator.mediaDevices?.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
      })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
        setCameraError(null);
      })
      .catch((err) => {
        console.warn("Camera stream access unavailable:", err.message);
        setCameraError("Camera device offline or permission denied. Using synthetic spatial matrix.");
      });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const activeStream = videoRef.current.srcObject as MediaStream;
        activeStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, mode]);

  // Handle synthetic background canvas animation for non-camera modes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === "cyber_lidar") {
        // Render glowing LiDAR perspective grid lines
        ctx.strokeStyle = "rgba(0, 242, 255, 0.15)";
        ctx.lineWidth = 1;

        const w = canvas.width;
        const h = canvas.height;
        const vanishingX = w / 2;
        const vanishingY = h / 2 + Math.sin(frame * 0.02) * 10;

        // Radial scan lines
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, vanishingY);
          ctx.lineTo(vanishingX + Math.cos(a) * w, vanishingY + Math.sin(a) * h);
          ctx.stroke();
        }

        // Concentric depth rings
        for (let r = 50; r < w; r += 70) {
          const pulsate = (r + (frame % 70)) % w;
          ctx.beginPath();
          ctx.arc(vanishingX, vanishingY, pulsate, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 242, 255, ${Math.max(0, 0.25 - pulsate / w)})`;
          ctx.stroke();
        }
      } else if (mode === "wireframe_mesh") {
        // Matrix Green Wireframe Mesh
        ctx.strokeStyle = "rgba(5, 255, 161, 0.18)";
        ctx.lineWidth = 1.2;

        const step = 40;
        for (let x = 0; x < canvas.width; x += step) {
          for (let y = 0; y < canvas.height; y += step) {
            const noise = Math.sin((x + frame * 2) * 0.03) * Math.cos((y + frame) * 0.03) * 6;
            ctx.strokeRect(x + noise, y + noise, step - 4, step - 4);
          }
        }
      } else if (mode === "thermal") {
        // Thermal IR Spectrum Gradient
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 20,
          canvas.width / 2, canvas.height / 2, canvas.width / 1.5
        );
        gradient.addColorStop(0, "rgba(255, 60, 0, 0.3)");
        gradient.addColorStop(0.4, "rgba(255, 200, 0, 0.15)");
        gradient.addColorStop(0.7, "rgba(0, 100, 255, 0.2)");
        gradient.addColorStop(1, "rgba(20, 0, 40, 0.5)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [mode]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-auto">
      {/* 1. Live Camera Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isCameraActive && mode === "live_camera" ? "opacity-90 contrast-125 brightness-90" : "opacity-0 absolute"
        }`}
      />

      {/* 2. Synthetic Shader / LiDAR Canvas Layer */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
          mode !== "live_camera" || !isCameraActive ? "opacity-100" : "opacity-40 mix-blend-screen"
        }`}
      />

      {/* 3. Scan Sweep Laser Line */}
      {showScanSweep && (
        <motion.div
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f2ff] pointer-events-none z-20 opacity-80"
        />
      )}

      {/* 4. Spatial Target Reticles */}
      <div className="absolute inset-0 pointer-events-none">
        {detectedTargets.map((target) => {
          const isSelected = selectedTarget?.id === target.id;
          return (
            <motion.div
              key={target.id}
              onClick={(e) => {
                e.stopPropagation();
                spatialAudio.playTargetLock();
                onSelectTarget(target);
              }}
              style={{
                top: `${target.yPct}%`,
                left: `${target.xPct}%`,
                width: `${target.widthPct}%`,
                height: `${target.heightPct}%`
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              className={`absolute border-2 rounded-2xl transition-all cursor-pointer pointer-events-auto flex flex-col justify-between p-2 group ${
                isSelected
                  ? "border-cyan-400 bg-cyan-500/15 shadow-[0_0_30px_rgba(0,242,255,0.4)]"
                  : "border-white/30 hover:border-nexus-accent bg-black/40 hover:bg-black/60"
              }`}
            >
              {/* Corner Reticle Brackets */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                  <Target className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="font-mono text-[9px] font-bold text-white tracking-wider">
                    {target.label}
                  </span>
                </div>
                <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  {(target.confidence * 100).toFixed(0)}% LOCK
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="font-mono text-[8px] text-nexus-text-dim bg-black/70 px-1.5 py-0.5 rounded">
                  DST: <span className="text-white font-bold">{target.distanceMeters}m</span>
                </div>
                <span className="text-[8px] font-mono text-cyan-400 tracking-tight uppercase group-hover:underline">
                  {isSelected ? "ACTIVE FOCUS" : "CLICK TO LOCK"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 5. Camera Offline Alert Banner */}
      {cameraError && isCameraActive && mode === "live_camera" && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 rounded-xl backdrop-blur-md text-xs font-mono text-yellow-300 flex items-center gap-2 shadow-xl">
          <ShieldAlert className="w-4 h-4 text-yellow-400" />
          <span>{cameraError}</span>
        </div>
      )}
    </div>
  );
};
