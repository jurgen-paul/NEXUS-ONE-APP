import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Film, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Sliders, 
  Camera, 
  Clock, 
  Layers, 
  Maximize2, 
  Share2, 
  Check, 
  Copy,
  Zap,
  Flame,
  Ratio,
  Compass,
  Video,
  Monitor
} from "lucide-react";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export interface VideoProject {
  id: string;
  title: string;
  prompt: string;
  cameraMotion: string;
  style: string;
  duration: number;
  aspectRatio: "16:9" | "9:16" | "1:1" | "21:9";
  fps: number;
  resolution: "1080p" | "4K";
  thumbnail: string;
  createdAt: string;
}

const SAMPLE_PROJECTS: VideoProject[] = [
  {
    id: "vid-1",
    title: "Quantum Neural Gateway Ingress",
    prompt: "Cinematic drone flyover descending into a glowing cyberpunk mega-city spire, neon holographic billboards reflecting in rain puddles, volumetric atmospheric mist, photorealistic 8K cinematic lighting.",
    cameraMotion: "Orbital Drone Flyover",
    style: "Cinematic Sci-Fi",
    duration: 10,
    aspectRatio: "16:9",
    fps: 60,
    resolution: "4K",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    createdAt: "Just now"
  },
  {
    id: "vid-2",
    title: "Autonomous Drone Swarm Telemetry",
    prompt: "First-person POV of micro-drones navigating through high-tech server vaults with fiber-optic particle streams and laser grid scanners.",
    cameraMotion: "FPV Hyper-Speed Tilt",
    style: "Unreal Engine 5",
    duration: 5,
    aspectRatio: "9:16",
    fps: 60,
    resolution: "1080p",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    createdAt: "15 mins ago"
  }
];

const CAMERA_MOTIONS = [
  "Dolly Zoom In",
  "Orbital Drone Flyover",
  "FPV Hyper-Speed Tilt",
  "Cinematic Pan & Scan",
  "Slow-Motion Hyperlapse",
  "Isometric Floating Crane"
];

const VIDEO_STYLES = [
  { label: "Cinematic Sci-Fi", desc: "Anamorphic lens, volumetric fog & teal-orange contrast" },
  { label: "Photoreal 8K", desc: "Natural softbox lighting with ultra-fine textures" },
  { label: "Unreal Engine 5", desc: "Raytraced neon reflections & lumen global illumination" },
  { label: "Anime Masterpiece", desc: "Makoto Shinkai style skybox & hand-drawn aesthetic" },
  { label: "Vintage 35mm", desc: "Kodak film grain, subtle halation and warm gate flare" }
];

export const VideoGeneratorTab: React.FC = () => {
  const [prompt, setPrompt] = useState(
    "Hyper-realistic camera orbit around a floating quantum microprocessor core emitting blue ionized plasma filaments, 4K raytracing, cinematic depth of field."
  );
  const [selectedMotion, setSelectedMotion] = useState(CAMERA_MOTIONS[1]);
  const [selectedStyle, setSelectedStyle] = useState(VIDEO_STYLES[0].label);
  const [duration, setDuration] = useState<number>(10);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1" | "21:9">("16:9");
  const [fps, setFps] = useState<number>(60);
  const [resolution, setResolution] = useState<"1080p" | "4K">("4K");
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [projects, setProjects] = useState<VideoProject[]>(SAMPLE_PROJECTS);
  const [activeProject, setActiveProject] = useState<VideoProject>(SAMPLE_PROJECTS[0]);

  // Video Simulator Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeProject.duration) {
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeProject.duration]);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    spatialAudio.playScanSweep();
    setIsGenerating(true);
    setGenProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        clearInterval(interval);
        setGenProgress(100);
        setIsGenerating(false);
        spatialAudio.playTargetLock();

        const uniqueId = `vid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newProj: VideoProject = {
          id: uniqueId,
          title: prompt.slice(0, 32) + "...",
          prompt,
          cameraMotion: selectedMotion,
          style: selectedStyle,
          duration,
          aspectRatio,
          fps,
          resolution,
          thumbnail: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
          createdAt: "Just now"
        };
        setProjects((prev) => [newProj, ...prev.filter((p) => p.id !== uniqueId)]);
        setActiveProject(newProj);
        setCurrentTime(0);
        setIsPlaying(true);
      } else {
        setGenProgress(current);
      }
    }, 150);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeProject.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt & Video Generation Controls (5 Cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-white/10 space-y-5 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
              <Film className="w-5 h-5" />
              <span>AI Video Studio Prompt</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              GEN-3 SPATIAL RIG
            </span>
          </div>

          {/* Prompt Area */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">
              VIDEO DESCRIPTION / CAMERA DIRECTIVE
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe scene, subjects, lighting, transitions, and environmental dynamics..."
              className="w-full bg-black/70 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none transition-colors leading-relaxed resize-none"
            />
          </div>

          {/* Camera Motion Rig */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim flex items-center justify-between">
              <span>CAMERA CHOREOGRAPHY</span>
              <span className="text-cyan-300 font-bold">{selectedMotion}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAMERA_MOTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMotion(m)}
                  className={`p-2 rounded-xl text-left text-[11px] font-mono transition-all border ${
                    selectedMotion === m
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                      : "bg-white/[0.02] text-nexus-text-dim border-white/5 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Style Presets */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">VISUAL RENDER STYLE</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
              {VIDEO_STYLES.map((st) => (
                <button
                  key={st.label}
                  onClick={() => setSelectedStyle(st.label)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                    selectedStyle === st.label
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                      : "bg-white/[0.02] text-nexus-text-dim border-white/5 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white font-mono">{st.label}</p>
                    <p className="text-[10px] text-nexus-text-dim">{st.desc}</p>
                  </div>
                  {selectedStyle === st.label && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio, Duration & FPS */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 font-mono text-xs">
            <div>
              <span className="text-[10px] text-nexus-text-dim block mb-1">ASPECT</span>
              <select
                value={aspectRatio}
                onChange={(e: any) => setAspectRatio(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="9:16">9:16 Shorts/Reels</option>
                <option value="1:1">1:1 Square</option>
                <option value="21:9">21:9 Cinema</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-nexus-text-dim block mb-1">DURATION</span>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-black border border-white/10 rounded-xl p-2 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value={5}>5 Seconds</option>
                <option value={10}>10 Seconds</option>
                <option value={15}>15 Seconds</option>
                <option value={30}>30 Seconds</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-nexus-text-dim block mb-1">RENDER RES</span>
              <select
                value={resolution}
                onChange={(e: any) => setResolution(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="1080p">1080p HD</option>
                <option value="4K">4K Cinema</option>
              </select>
            </div>
          </div>

          {/* Generate Button with Progress */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-black font-bold text-xs font-mono rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 text-black animate-spin" />
                  <span>Synthesizing Video Neural Frames ({genProgress}%)...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 text-black" />
                  <span>Generate Cinematic AI Video</span>
                </>
              )}
            </button>

            {isGenerating && (
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  animate={{ width: `${genProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Video Player Simulator & Timeline (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Main Video Viewport */}
          <div className="relative flex-1 min-h-[380px] rounded-3xl overflow-hidden border border-white/10 bg-black flex flex-col justify-between shadow-2xl group">
            {/* Simulated Animated Video Canvas Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105 group-hover:scale-100"
              style={{ backgroundImage: `url(${activeProject.thumbnail})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
            </div>

            {/* Top Video Overlay Details */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 text-xs font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold">{activeProject.resolution}</span>
                <span className="text-nexus-text-dim">| {activeProject.fps} FPS</span>
                <span className="text-cyan-300 font-bold">| {activeProject.cameraMotion}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
                  title="Copy Video Prompt"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedPrompt ? "Copied!" : "Copy Prompt"}</span>
                </button>
              </div>
            </div>

            {/* Center Play Button Overlay (when paused) */}
            <div className="relative z-10 self-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center backdrop-blur-md transition-all shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-110"
              >
                {isPlaying ? <Pause className="w-7 h-7 text-white fill-white" /> : <Play className="w-7 h-7 text-white fill-white ml-1" />}
              </button>
            </div>

            {/* Bottom Playback & Scrubber Controls */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">{currentTime.toFixed(1)}s</span>
                  <span className="text-nexus-text-dim">/ {activeProject.duration}.0s</span>
                </div>
                <span className="text-[10px] text-nexus-text-dim font-mono uppercase">
                  {activeProject.style} • {activeProject.aspectRatio}
                </span>
              </div>

              {/* Timeline Bar */}
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = clickX / rect.width;
                  setCurrentTime(pct * activeProject.duration);
                }}
                className="relative h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer overflow-hidden transition-all"
              >
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${(currentTime / activeProject.duration) * 100}%` }}
                />
              </div>

              {/* Prompt Readout */}
              <p className="text-[11px] text-gray-300 line-clamp-1 italic pt-1">
                "{activeProject.prompt}"
              </p>
            </div>
          </div>

          {/* Video Projects Storyboard Reel */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-nexus-text-dim block uppercase">
              RECENT GENERATED VIDEO REELS ({projects.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    spatialAudio.playHoloPinch();
                    setActiveProject(proj);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`relative p-2.5 rounded-2xl border transition-all cursor-pointer group overflow-hidden ${
                    activeProject.id === proj.id
                      ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 bg-black/60 hover:border-white/30"
                  }`}
                >
                  <div className="relative h-20 rounded-xl overflow-hidden mb-2">
                    <img 
                      src={proj.thumbnail} 
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300 font-bold">
                      {proj.duration}s
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white font-mono truncate">{proj.title}</p>
                  <p className="text-[10px] text-nexus-text-dim font-mono">{proj.cameraMotion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
