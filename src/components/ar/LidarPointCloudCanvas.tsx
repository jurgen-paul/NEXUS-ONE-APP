import React, { useRef, useEffect, useState } from "react";
import { Layers, RotateCcw, Crosshair, Sparkles, Sliders, Zap, Eye } from "lucide-react";
import { spatialAudio } from "./SpatialAudioSynth";

interface Point3D {
  x: number;
  y: number;
  z: number;
  category: "ground" | "obstacle" | "node" | "beacon";
  intensity: number;
}

interface LidarPointCloudCanvasProps {
  hudColor: string;
  depthSlice: number; // 0 to 100 filter
  onPointInspect?: (info: string) => void;
}

export const LidarPointCloudCanvas: React.FC<LidarPointCloudCanvasProps> = ({
  hudColor,
  depthSlice,
  onPointInspect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 25, y: -45 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pointsCount, setPointsCount] = useState(1400);
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);

  // Generate 3D point cloud coordinates (representing a room + spatial objects)
  const pointsRef = useRef<Point3D[]>([]);

  useEffect(() => {
    const pts: Point3D[] = [];
    // 1. Ground Grid
    for (let x = -200; x <= 200; x += 15) {
      for (let z = -200; z <= 200; z += 15) {
        const noise = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 8;
        pts.push({
          x,
          y: 80 + noise,
          z,
          category: "ground",
          intensity: Math.random() * 0.5 + 0.5
        });
      }
    }

    // 2. Central Quantum Obelisk / Geometric Structure
    for (let h = -80; h <= 80; h += 8) {
      const radius = 30 + Math.sin(h * 0.08) * 12;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
        pts.push({
          x: Math.cos(a) * radius,
          y: h,
          z: Math.sin(a) * radius,
          category: "node",
          intensity: 1.0
        });
      }
    }

    // 3. Orbiting Peripheral Beacons
    for (let b = 0; b < 6; b++) {
      const angle = (b / 6) * Math.PI * 2;
      const bx = Math.cos(angle) * 140;
      const bz = Math.sin(angle) * 140;
      for (let i = 0; i < 20; i++) {
        pts.push({
          x: bx + (Math.random() - 0.5) * 20,
          y: -20 + (Math.random() - 0.5) * 40,
          z: bz + (Math.random() - 0.5) * 20,
          category: "beacon",
          intensity: 0.9
        });
      }
    }

    pointsRef.current = pts;
    setPointsCount(pts.length);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleOffset = 0;

    const render = () => {
      angleOffset += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const fov = 380 * zoom;

      const radX = (rotation.x * Math.PI) / 180;
      const radY = ((rotation.y + angleOffset * 30) * Math.PI) / 180;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      // Depth cutoff from depthSlice slider
      const maxZCutoff = 300 * (depthSlice / 100);

      // Sort points by depth for proper alpha blending
      const projectedPoints: {
        px: number;
        py: number;
        pz: number;
        color: string;
        size: number;
        origIdx: number;
      }[] = [];

      pointsRef.current.forEach((pt, idx) => {
        // Y-axis rotation
        let x1 = pt.x * cosY + pt.z * sinY;
        let y1 = pt.y;
        let z1 = -pt.x * sinY + pt.z * cosY;

        // X-axis rotation
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX + 350; // Camera distance offset

        if (z2 > 10 && z2 < 350 + maxZCutoff) {
          const scale = fov / z2;
          const px = cx + x2 * scale;
          const py = cy + y2 * scale;

          // Compute color based on altitude / intensity
          const depthRatio = Math.max(0.1, 1 - (z2 - 100) / 500);
          let color = `rgba(0, 242, 255, ${depthRatio * pt.intensity})`;

          if (pt.category === "beacon") {
            color = `rgba(236, 72, 153, ${depthRatio})`;
          } else if (pt.category === "node") {
            color = `rgba(168, 85, 247, ${depthRatio * pt.intensity})`;
          } else if (pt.y > 60) {
            color = `rgba(5, 255, 161, ${depthRatio * 0.7})`;
          }

          projectedPoints.push({
            px,
            py,
            pz: z2,
            color,
            size: Math.max(1, (3 - (z2 / 300)) * zoom),
            origIdx: idx
          });
        }
      });

      // Sort back-to-front
      projectedPoints.sort((a, b) => b.pz - a.pz);

      // Draw Points
      projectedPoints.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.origIdx === selectedPointIdx) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(p.px - 6, p.py - 6, 12, 12);
        }
      });

      // Draw Tactical Crosshair in center
      ctx.strokeStyle = "rgba(0, 242, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.moveTo(cx - 50, cy); ctx.lineTo(cx + 50, cy);
      ctx.moveTo(cx, cy - 50); ctx.lineTo(cx, cy + 50);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rotation, zoom, depthSlice, selectedPointIdx]);

  // Mouse drag interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-80, Math.min(80, prev.x + dy * 0.4)),
      y: prev.y + dx * 0.4
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.001)));
  };

  return (
    <div 
      className="relative w-full h-full min-h-[420px] bg-black rounded-3xl overflow-hidden border border-white/10 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas
        ref={canvasRef}
        width={1000}
        height={650}
        className="w-full h-full object-cover"
      />

      {/* Top Left: LiDAR Telemetry Details */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cyan-500/30 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>LiDAR 64-BEAM POINT CLOUD</span>
        </div>
        <div className="text-[10px] text-nexus-text-dim flex items-center gap-3">
          <span>Points: <strong className="text-white">{pointsCount}</strong></span>
          <span>Pitch: <strong className="text-white">{rotation.x.toFixed(0)}°</strong></span>
          <span>Yaw: <strong className="text-white">{rotation.y.toFixed(0)}°</strong></span>
          <span>Zoom: <strong className="text-white">{zoom.toFixed(1)}x</strong></span>
        </div>
      </div>

      {/* Top Right: Reset View */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => {
            spatialAudio.playScanSweep();
            setRotation({ x: 25, y: -45 });
            setZoom(1);
          }}
          className="p-2 rounded-xl bg-black/80 border border-white/10 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
          title="Reset Camera Angles"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Perspective</span>
        </button>
      </div>

      {/* Bottom Floating Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-mono text-nexus-text-dim flex items-center gap-2">
        <Crosshair className="w-3 h-3 text-cyan-400" />
        <span>Drag to rotate 3D point cloud • Scroll to zoom • Depth Slicing Active</span>
      </div>
    </div>
  );
};
