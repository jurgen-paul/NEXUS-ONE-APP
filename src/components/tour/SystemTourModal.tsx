import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Cpu, 
  LayoutDashboard, 
  Newspaper, 
  Navigation, 
  Eye, 
  Mic, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Award,
  BookOpen,
  FileText,
  Share2,
  Users,
  Film,
  Code2,
  Mail,
  HelpCircle
} from "lucide-react";
import { Module } from "@/src/types";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  targetModule: Module;
  icon: any;
  badge: string;
  description: string;
  keyFeatures: string[];
  shortcut: string;
  visualPreview: {
    theme: string;
    accentColor: string;
    metrics: { label: string; value: string }[];
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "step-welcome",
    title: "Welcome to NEXUS ONE",
    subtitle: "Enterprise Accountholder Onboarding",
    targetModule: Module.DASHBOARD,
    icon: Zap,
    badge: "ACCOUNT LEVEL: COMMANDER",
    description: "Welcome to the next-generation autonomous neural operations platform. NEXUS ONE unifies generative multi-modal intelligence, real-time spatial computing, global navigation, and decentralized publishing into one seamless command center.",
    keyFeatures: [
      "256-Bit Quantum-Resistant Neural Encryption",
      "Unified Multimodal Workflow Orchestration",
      "Real-time Cloud Node Synchronization",
      "Global Telemetry & Sub-millimeter Odometry"
    ],
    shortcut: "Cmd+K / Ctrl+K for Global Neural Search",
    visualPreview: {
      theme: "Cyber Obsidian",
      accentColor: "#00f2ff",
      metrics: [
        { label: "SECURITY", value: "AES-256" },
        { label: "NODES", value: "64 ACTIVE" },
        { label: "UPTIME", value: "99.999%" }
      ]
    }
  },
  {
    id: "step-blogposts",
    title: "Content BlogPost Studio",
    subtitle: "AI Ghostwriting, SEO Scoring & Multi-Dispatch",
    targetModule: Module.BLOGPOSTS,
    icon: FileText,
    badge: "MODULE: BLOGPOSTS",
    description: "Author technical thought leadership, showbiz breakdowns, and dev guides. Includes instant AI outline ghostwriter, live Markdown split-preview, OpenSSF security articles, and 1-click syndication to Substack, Medium, and Dev.to.",
    keyFeatures: [
      "AI Outline Ghostwriter with Key Takeaway Synthesis",
      "Live Markdown Editor with Instant Social Previews",
      "1-Click Syndication to Medium, Substack, and Dev.to",
      "Interactive Reader Mode with Reactions & Deep Linking"
    ],
    shortcut: "Cmd+K / Ctrl+K -> #blog",
    visualPreview: {
      theme: "Publishing Hub",
      accentColor: "#06b6d4",
      metrics: [
        { label: "SEO SCORE", value: "98/100" },
        { label: "CHANNELS", value: "5 SYNDICATED" },
        { label: "READER", value: "VOLUMETRIC" }
      ]
    }
  },
  {
    id: "step-dashboard",
    title: "Command Center & KPIs",
    subtitle: "Real-Time Telemetry & System Core",
    targetModule: Module.DASHBOARD,
    icon: LayoutDashboard,
    badge: "MODULE: DASHBOARD",
    description: "Monitor high-frequency operational metrics, system health, revenue velocity, active neural pipelines, and resource utilization directly from a single high-contrast telemetry deck.",
    keyFeatures: [
      "Live Network Load & GPU Cluster Visualizer",
      "Multi-Module Task Quick Launches",
      "Real-time Alerts & Threat Prevention Logs",
      "Dynamic Custom Widget Reorganization"
    ],
    shortcut: "Click Command Center on Sidebar",
    visualPreview: {
      theme: "Telemetry Matrix",
      accentColor: "#05ffa1",
      metrics: [
        { label: "THROUGHPUT", value: "4.8 GB/s" },
        { label: "RESPONSE", value: "1.2 ms" },
        { label: "HEALTH", value: "OPTIMAL" }
      ]
    }
  },
  {
    id: "step-ai-engine",
    title: "Unified AI Engine & Neural Hub",
    subtitle: "Multi-Model Reasoning & Calibration",
    targetModule: Module.AI_ENGINE,
    icon: Cpu,
    badge: "MODULE: AI ENGINE",
    description: "Harness cutting-edge generative AI models for complex cognitive reasoning, semantic data ingestion, real-time transcription, automated decision matrixes, and multi-turn workflows.",
    keyFeatures: [
      "Gemini 3.7 Pro / Flash Inference Pipeline",
      "Hyper-parameter Temperature & Top-P Tuner",
      "Automated Prompt Fine-Tuning Benchmarks",
      "Vector Memory & Context Window Manager"
    ],
    shortcut: "Module.AI_ENGINE",
    visualPreview: {
      theme: "Neural Synapse",
      accentColor: "#ec4899",
      metrics: [
        { label: "CONTEXT", value: "1.0M Tokens" },
        { label: "LATENCY", value: "85 ms" },
        { label: "COHERENCE", value: "99.8%" }
      ]
    }
  },
  {
    id: "step-content-matrix",
    title: "Enhanced Content Matrix Studio",
    subtitle: "Videos, Images, Text, Code, Books & Emails",
    targetModule: Module.CONTENT_HUB,
    icon: Newspaper,
    badge: "MODULE: CONTENT MATRIX",
    description: "Your all-in-one generative creation suite. Create 4K AI videos with custom camera angles, synthesize photorealistic images, generate long-form articles, write production-grade code, architect full multi-chapter books, and craft automated email sequences.",
    keyFeatures: [
      "AI Video Generator with Storyboard & Camera Rig",
      "High-Fidelity Multi-Aspect Image Synthesis",
      "Smart Code Architect with Live Simulation",
      "Full E-Book Generator & Drip Email Automator"
    ],
    shortcut: "Newspaper Icon on Sidebar",
    visualPreview: {
      theme: "Creative Studio",
      accentColor: "#a855f7",
      metrics: [
        { label: "MODES", value: "6 GENERATORS" },
        { label: "OUTPUT", value: "4K CINEMATIC" },
        { label: "FORMATS", value: "EPUB/MP4/TS" }
      ]
    }
  },
  {
    id: "step-navigation",
    title: "Global Navigation & Geospatial Maps",
    subtitle: "Live Interactive Leaflet Telemetry",
    targetModule: Module.NAVIGATION,
    icon: Navigation,
    badge: "MODULE: NAVIGATION",
    description: "Explore the globe in real-time with 4 distinct cartography map styles (Cyber Dark, Satellite Photorealism, Light Vector, and OpenStreetMap). Inspect solar cycles, sunrise/sunset times, geodetic coordinates, and turn-by-turn route planning.",
    keyFeatures: [
      "4 Map Themes with Live Tile Layer Switching",
      "OSRM Driving & Drone Waypoint Route Optimizer",
      "Geodetic Solar Calculator (Azimuth & Elevation)",
      "Real-time Atmospheric Radar & Wind Vectors"
    ],
    shortcut: "Click Navigation Sys on Sidebar",
    visualPreview: {
      theme: "Orbital Cartography",
      accentColor: "#3b82f6",
      metrics: [
        { label: "TILES", value: "100% VECTOR" },
        { label: "WAYPOINTS", value: "GLOBAL GPS" },
        { label: "RADAR", value: "ACTIVE" }
      ]
    }
  },
  {
    id: "step-ar-interface",
    title: "AR & Spatial Viewfinder",
    subtitle: "6DoF SLAM & 3D LiDAR Point Cloud",
    targetModule: Module.AR_VIEW,
    icon: Eye,
    badge: "MODULE: AR INTERFACE",
    description: "Activate augmented reality optics. Seamlessly stream live camera feeds, visualize 1,400+ point 3D LiDAR scans with orbital rotation, and manipulate interactive quantum holographic components in real-time.",
    keyFeatures: [
      "Live Optical Webcam Viewfinder with LiDAR Shaders",
      "64-Beam Interactive 3D LiDAR Point Cloud",
      "Interactive 3D Holographic Gyroscope Core",
      "Synthesized Spatial Audio Haptics"
    ],
    shortcut: "Click AR Interface on Sidebar",
    visualPreview: {
      theme: "Spatial Vision",
      accentColor: "#00f2ff",
      metrics: [
        { label: "REFRESH", value: "120 FPS" },
        { label: "POINTS", value: "1,400+ 3D" },
        { label: "DRIFT", value: "±0.003mm" }
      ]
    }
  },
  {
    id: "step-voice-hud",
    title: "Voice HUD & Teleportation Engine",
    subtitle: "Hands-Free Natural Language Control",
    targetModule: Module.ASSISTANT,
    icon: Mic,
    badge: "GLOBAL SHORTCUT: ALT + V",
    description: "Control your entire workspace hands-free. Say 'Launch quantum teleportation' to jump instantly to navigation, 'Generate video' for content studio, or 'Show system health' for real-time diagnostics.",
    keyFeatures: [
      "Low-Latency Web Speech Recognition Engine",
      "Interactive Voice Telemetry Overlay (Alt + V)",
      "Multi-Module Fuzzy Speech Pattern Matching",
      "Full Acoustic Feedback & Transcript Logs"
    ],
    shortcut: "Press Alt + V or click Voice HUD in top bar",
    visualPreview: {
      theme: "Acoustic Neural",
      accentColor: "#f59e0b",
      metrics: [
        { label: "VOICE", value: "ACTIVE" },
        { label: "CONFIDENCE", value: "98.5%" },
        { label: "LATENCY", value: "65 ms" }
      ]
    }
  }
];

interface SystemTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (module: Module) => void;
}

export const SystemTourModal: React.FC<SystemTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToModule
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIdx(0);
      setHasCompleted(false);
      spatialAudio.playScanSweep();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];
  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === TOUR_STEPS.length - 1;

  const handleNext = () => {
    spatialAudio.playHoloPinch();
    if (isLastStep) {
      setHasCompleted(true);
      localStorage.setItem("nexus_has_completed_tour", "true");
    } else {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    spatialAudio.playHoloPinch();
    setCurrentStepIdx((prev) => Math.max(0, prev - 1));
  };

  const handleJumpToModule = (module: Module) => {
    spatialAudio.playTargetLock();
    onNavigateToModule(module);
    onClose();
  };

  const handleFinishTour = () => {
    spatialAudio.playTargetLock();
    localStorage.setItem("nexus_has_completed_tour", "true");
    onClose();
  };

  const StepIcon = currentStep.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl select-none">
        {/* Subtle Background Glow */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 transition-all duration-700"
          style={{ backgroundColor: currentStep.visualPreview.accentColor }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl glass rounded-3xl border border-white/15 bg-black/90 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center neon-glow">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white tracking-wide flex items-center gap-2">
                  <span>NEXUS ONE SYSTEM TOUR</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                    STEP {currentStepIdx + 1} OF {TOUR_STEPS.length}
                  </span>
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-nexus-text-dim hover:text-white hover:bg-white/10 transition-colors"
              title="Close System Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh] space-y-6">
            {!hasCompleted ? (
              <>
                {/* Step Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500"
                      style={{ 
                        backgroundColor: `${currentStep.visualPreview.accentColor}20`,
                        border: `1px solid ${currentStep.visualPreview.accentColor}50`,
                        color: currentStep.visualPreview.accentColor
                      }}
                    >
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-nexus-accent tracking-wider uppercase">
                        {currentStep.badge}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                        {currentStep.title}
                      </h2>
                      <p className="text-xs text-nexus-text-dim">{currentStep.subtitle}</p>
                    </div>
                  </div>

                  {/* Jump directly to module */}
                  <button
                    onClick={() => handleJumpToModule(currentStep.targetModule)}
                    className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all border border-white/10 hover:border-white/30"
                  >
                    <span>Launch Module</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </button>
                </div>

                {/* Step Description */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Key Features Grid */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-nexus-text-dim uppercase tracking-wider block">
                    CORE CAPABILITIES & ARCHITECTURE
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentStep.keyFeatures.map((feat, i) => (
                      <div 
                        key={i}
                        className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-start gap-2.5"
                      >
                        <CheckCircle2 
                          className="w-4 h-4 mt-0.5 shrink-0" 
                          style={{ color: currentStep.visualPreview.accentColor }}
                        />
                        <span className="text-xs text-gray-200 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telemetry Metrics & Shortcut Strip */}
                <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 font-mono text-center">
                  {currentStep.visualPreview.metrics.map((m, idx) => (
                    <div key={idx} className="p-2">
                      <span className="text-[9px] text-nexus-text-dim block uppercase">{m.label}</span>
                      <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{m.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-nexus-text-dim px-1">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-nexus-accent" />
                    <span>Quick Command: <strong className="text-white">{currentStep.shortcut}</strong></span>
                  </span>
                  <span>AES-256 Neural Sync</span>
                </div>
              </>
            ) : (
              /* Tour Completion View */
              <div className="py-6 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,242,255,0.4)] animate-bounce">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                    Orientation Protocol Complete!
                  </h2>
                  <p className="text-xs sm:text-sm text-nexus-text-dim max-w-md mx-auto mt-2">
                    Your commander security token is authenticated. You now have unrestricted access to all 18 enterprise neural modules across NEXUS ONE.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[9px] text-nexus-text-dim block">SECURITY</span>
                    <span className="text-cyan-400 font-bold">LEVEL 5</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[9px] text-nexus-text-dim block">AI PIPELINES</span>
                    <span className="text-green-400 font-bold">UNLOCKED</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[9px] text-nexus-text-dim block">3D AR ENGINE</span>
                    <span className="text-purple-400 font-bold">CALIBRATED</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[9px] text-nexus-text-dim block">VOICE HUD</span>
                    <span className="text-yellow-400 font-bold">ONLINE</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleFinishTour}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm rounded-2xl shadow-xl shadow-cyan-500/20 transition-all inline-flex items-center gap-2"
                  >
                    <span>Enter Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar Navigation */}
          {!hasCompleted && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      spatialAudio.playHoloPinch();
                      setCurrentStepIdx(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentStepIdx
                        ? "w-6 bg-cyan-400"
                        : i < currentStepIdx
                        ? "w-2 bg-cyan-600/60"
                        : "w-2 bg-white/20"
                    }`}
                    title={`Go to Step ${i + 1}`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-mono text-nexus-text-dim hover:text-white transition-colors"
                >
                  Skip Tour
                </button>

                {!isFirstStep && (
                  <button
                    onClick={handlePrev}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white text-xs font-mono transition-all flex items-center gap-1 border border-white/10"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <span>{isLastStep ? "Complete Tour" : "Next Step"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
