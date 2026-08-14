import React, { useState, useEffect } from "react";
import { 
  Mic, 
  MicOff, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Search, 
  Download, 
  Play, 
  Copy, 
  Check, 
  X, 
  Activity, 
  Layers, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  ExternalLink,
  Flame,
  Radio,
  Clock,
  Send,
  HelpCircle,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Module } from "@/src/types";

export interface VoiceCommandLog {
  id: string;
  timestamp: string;
  exactTime: string;
  rawSpeech: string;
  matchedAction: string;
  targetModule?: Module | string;
  status: "success" | "warning" | "error" | "info";
  confidenceScore: number;
  latencyMs: number;
  source: "microphone" | "simulation" | "quick_action";
}

const STORAGE_KEY = "nexus_voice_command_history";

const INITIAL_LOGS: VoiceCommandLog[] = [
  {
    id: "init-1",
    timestamp: "Just now",
    exactTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    rawSpeech: "Open Google Sheets",
    matchedAction: "Switched view to Google Sheets Hub",
    targetModule: Module.SHEETS,
    status: "success",
    confidenceScore: 98,
    latencyMs: 120,
    source: "microphone"
  },
  {
    id: "init-2",
    timestamp: "1 min ago",
    exactTime: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    rawSpeech: "Switch to AI Engine",
    matchedAction: "Switched view to Unified AI Engine",
    targetModule: Module.AI_ENGINE,
    status: "success",
    confidenceScore: 95,
    latencyMs: 145,
    source: "microphone"
  },
  {
    id: "init-3",
    timestamp: "2 mins ago",
    exactTime: new Date(Date.now() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    rawSpeech: "Launch quantum teleportation",
    matchedAction: "Unrecognized instruction. Say 'Help' for command list",
    status: "warning",
    confidenceScore: 32,
    latencyMs: 95,
    source: "microphone"
  },
  {
    id: "init-4",
    timestamp: "5 mins ago",
    exactTime: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    rawSpeech: "Voice Engine Calibration",
    matchedAction: "AIAssistant Listener Calibrated",
    status: "info",
    confidenceScore: 100,
    latencyMs: 80,
    source: "simulation"
  }
];

export const VoiceCommandOverlay: React.FC<{
  onNavigate?: (module: Module) => void;
}> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState<VoiceCommandLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not parse saved voice history:", e);
    }
    return INITIAL_LOGS;
  });

  const [filter, setFilter] = useState<"all" | "success" | "warning" | "info">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [simulatedVoiceInput, setSimulatedVoiceInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAudioFeedbackMuted, setIsAudioFeedbackMuted] = useState(false);
  const [lastExecutedLog, setLastExecutedLog] = useState<VoiceCommandLog | null>(null);
  const [audioPulsing, setAudioPulsing] = useState(false);

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn("Could not save voice history to localStorage:", e);
    }
  }, [history]);

  // Listen to global voice command events dispatched from AIAssistant or elsewhere
  useEffect(() => {
    const handleVoiceCommandEvent = (event: CustomEvent<any>) => {
      const detail = event.detail;
      if (!detail) return;

      const newLog: VoiceCommandLog = {
        id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: "Just now",
        exactTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rawSpeech: detail.rawSpeech || detail.rawText || "Vocal input",
        matchedAction: detail.matchedAction || "Executed voice instruction",
        targetModule: detail.targetModule,
        status: detail.status || "success",
        confidenceScore: detail.confidenceScore || (detail.status === "success" ? Math.floor(Math.random() * 8 + 92) : 35),
        latencyMs: detail.latencyMs || Math.floor(Math.random() * 80 + 90),
        source: detail.source || "microphone"
      };

      setHistory(prev => [newLog, ...prev.slice(0, 49)]);
      setLastExecutedLog(newLog);
      setAudioPulsing(true);
      setTimeout(() => setAudioPulsing(false), 2000);
    };

    const handleOpenOverlay = () => {
      setIsOpen(true);
    };

    window.addEventListener("nexus-voice-command-executed" as any, handleVoiceCommandEvent);
    window.addEventListener("nexus-open-voice-history" as any, handleOpenOverlay);

    // Keyboard shortcut: Alt + V or Ctrl + Shift + V to toggle overlay
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "v") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "v")) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("nexus-voice-command-executed" as any, handleVoiceCommandEvent);
      window.removeEventListener("nexus-open-voice-history" as any, handleOpenOverlay);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Calculate Success Feedback Metrics
  const totalCommands = history.length;
  const successfulCommands = history.filter(h => h.status === "success").length;
  const warningCommands = history.filter(h => h.status === "warning").length;
  const successRate = totalCommands > 0 ? Math.round((successfulCommands / totalCommands) * 100) : 100;
  const avgLatency = totalCommands > 0 
    ? Math.round(history.reduce((acc, h) => acc + (h.latencyMs || 100), 0) / totalCommands) 
    : 110;

  // Speak audio confirmation if enabled
  const speakFeedback = (message: string) => {
    if (isAudioFeedbackMuted) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech synth error:", err);
      }
    }
  };

  // Execute or Re-run a command
  const executeCommand = (text: string, source: "simulation" | "quick_action" = "simulation") => {
    const raw = text.trim();
    if (!raw) return;

    const cleaned = raw.toLowerCase();
    let targetMod: Module | undefined;
    let action = `Command executed: "${raw}"`;
    let status: "success" | "warning" = "success";

    if (cleaned.includes("sheet") || cleaned.includes("spreadsheet") || cleaned.includes("excel")) {
      targetMod = Module.SHEETS;
      action = "Navigated to Google Sheets Hub";
    } else if (cleaned.includes("ai") || cleaned.includes("engine") || cleaned.includes("model")) {
      targetMod = Module.AI_ENGINE;
      action = "Navigated to Unified AI Engine";
    } else if (cleaned.includes("dashboard") || cleaned.includes("command") || cleaned.includes("home")) {
      targetMod = Module.DASHBOARD;
      action = "Navigated to Command Center";
    } else if (cleaned.includes("topology") || cleaned.includes("map") || cleaned.includes("dependency")) {
      targetMod = Module.DEPENDENCY_MAP;
      action = "Navigated to Topology Map";
    } else if (cleaned.includes("inbox") || cleaned.includes("notification")) {
      targetMod = Module.SMART_INBOX;
      action = "Navigated to Smart Inbox";
    } else if (cleaned.includes("deploy") || cleaned.includes("pipeline")) {
      targetMod = Module.DEPLOYMENT;
      action = "Navigated to Deployment Hub";
    } else if (cleaned.includes("docs") || cleaned.includes("contract") || cleaned.includes("form")) {
      targetMod = Module.DOCS;
      action = "Navigated to Smart Docs";
    } else if (cleaned.includes("marketing") || cleaned.includes("seo")) {
      targetMod = Module.MARKETING;
      action = "Navigated to Marketing Suite";
    } else if (cleaned.includes("social") || cleaned.includes("feed")) {
      targetMod = Module.SOCIAL;
      action = "Navigated to Social Control";
    } else if (cleaned.includes("sales") || cleaned.includes("deal") || cleaned.includes("revenue")) {
      targetMod = Module.SALES;
      action = "Navigated to Sales Intelligence";
    } else if (cleaned.includes("ar") || cleaned.includes("augmented") || cleaned.includes("vision")) {
      targetMod = Module.AR_VIEW;
      action = "Navigated to AR Interface";
    } else if (cleaned.includes("avatar") || cleaned.includes("assistant") || cleaned.includes("persona")) {
      targetMod = Module.ASSISTANT;
      action = "Navigated to Avatar Sync Hub";
    } else if (cleaned.includes("setting") || cleaned.includes("config")) {
      targetMod = Module.SETTINGS;
      action = "Navigated to App Settings";
    } else if (cleaned.includes("help")) {
      action = "Displayed Voice Command Help Index";
    } else {
      status = "warning";
      action = `Unrecognized instruction: "${raw}". Say "Help" for valid commands.`;
    }

    if (targetMod) {
      if (onNavigate) {
        onNavigate(targetMod);
      } else {
        window.dispatchEvent(new CustomEvent("nexus-navigate", { detail: targetMod }));
      }
    }

    const log: VoiceCommandLog = {
      id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: "Just now",
      exactTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawSpeech: raw,
      matchedAction: action,
      targetModule: targetMod,
      status,
      confidenceScore: status === "success" ? Math.floor(Math.random() * 8 + 92) : 28,
      latencyMs: Math.floor(Math.random() * 60 + 80),
      source
    };

    setHistory(prev => [log, ...prev.slice(0, 49)]);
    setLastExecutedLog(log);
    setSimulatedVoiceInput("");
    speakFeedback(status === "success" ? action : `Command unrecognized: ${raw}`);
  };

  const handleCopyLog = (log: VoiceCommandLog) => {
    const text = `[${log.exactTime}] Voice Input: "${log.rawSpeech}" -> Action: ${log.matchedAction} (Status: ${log.status.toUpperCase()}, Confidence: ${log.confidenceScore}%)`;
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJournal = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexus-voice-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearHistory = () => {
    setHistory([]);
    setLastExecutedLog(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const filteredLogs = history.filter(item => {
    if (filter !== "all" && item.status !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.rawSpeech.toLowerCase().includes(q) ||
        item.matchedAction.toLowerCase().includes(q) ||
        (item.targetModule && String(item.targetModule).toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <>
      {/* 1. Floating Voice HUD Trigger Button in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative group flex items-center gap-3 px-4 py-3 rounded-2xl glass border shadow-2xl transition-all ${
            isOpen 
              ? "border-nexus-accent bg-nexus-accent/20 text-white shadow-nexus-accent/20" 
              : audioPulsing 
              ? "border-green-400 bg-green-500/20 text-green-300 shadow-green-500/20 animate-pulse" 
              : "border-white/10 hover:border-nexus-accent/50 bg-black/60 text-white"
          }`}
          title="Open Voice Activation History & Telemetry HUD (Alt + V)"
        >
          {/* Animated Glow Wave */}
          <div className="relative flex items-center justify-center">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              audioPulsing ? "bg-green-500/30 text-green-400" : "bg-nexus-accent/20 text-nexus-accent"
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            {audioPulsing && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            )}
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-white font-mono">
                Voice History
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                successRate >= 90 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}>
                {successRate}% OK
              </span>
            </div>
            <p className="text-[10px] text-nexus-text-dim truncate max-w-[130px]">
              {lastExecutedLog ? `"${lastExecutedLog.rawSpeech}"` : `${totalCommands} commands logged`}
            </p>
          </div>

          {/* Quick Expand Chevron */}
          <div className="pl-1 text-nexus-text-dim group-hover:text-nexus-accent transition-colors">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </motion.button>
      </div>

      {/* 2. Full Glassmorphic Voice Command History & Feedback Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`glass border border-nexus-accent/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all relative ${
                isExpanded 
                  ? "w-full max-w-5xl h-[90vh]" 
                  : "w-full max-w-3xl h-[82vh]"
              }`}
            >
              {/* Top Accent Scanline */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-nexus-accent to-purple-500" />

              {/* HUD Header */}
              <div className="p-5 sm:p-6 border-b border-nexus-border/60 flex items-center justify-between gap-4 bg-black/30">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-nexus-accent/20 border border-nexus-accent/40 text-nexus-accent flex items-center justify-center neon-glow shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-display font-bold text-white tracking-tight">
                        Voice Activation Command Journal
                      </h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/30 font-mono">
                        AIAssistant Feedback
                      </span>
                    </div>
                    <p className="text-xs text-nexus-text-dim">
                      Live recognition telemetry, activation success scoring, and vocal audit trail
                    </p>
                  </div>
                </div>

                {/* Header Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAudioFeedbackMuted(prev => !prev)}
                    title={isAudioFeedbackMuted ? "Unmute Voice Synthesis" : "Mute Voice Synthesis"}
                    className={`p-2 rounded-xl border transition-all ${
                      isAudioFeedbackMuted 
                        ? "bg-red-500/10 border-red-500/30 text-red-400" 
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-nexus-accent"
                    }`}
                  >
                    {isAudioFeedbackMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsExpanded(prev => !prev)}
                    title={isExpanded ? "Collapse View" : "Expand Fullscreen"}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors"
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    title="Close Overlay (Esc)"
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 text-nexus-text-dim hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Feedback Success Metric Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:p-6 bg-white/[0.02] border-b border-nexus-border/40">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-nexus-text-dim">
                    <span className="text-[10px] font-mono uppercase">Success Rate</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-display font-bold text-white">{successRate}%</span>
                    <span className="text-[10px] text-green-400 font-mono">
                      {successfulCommands}/{totalCommands}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-nexus-text-dim">
                    <span className="text-[10px] font-mono uppercase">Total Commands</span>
                    <Terminal className="w-3.5 h-3.5 text-nexus-accent" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-display font-bold text-white">{totalCommands}</span>
                    <span className="text-[10px] text-nexus-text-dim font-mono">logged</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-nexus-text-dim">
                    <span className="text-[10px] font-mono uppercase">Unrecognized</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-display font-bold text-white">{warningCommands}</span>
                    <span className="text-[10px] text-yellow-400/80 font-mono">warnings</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-nexus-text-dim">
                    <span className="text-[10px] font-mono uppercase">Avg Latency</span>
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-display font-bold text-white">{avgLatency}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">ms</span>
                  </div>
                </div>
              </div>

              {/* Quick Command Simulator & Spoken Input Test Bar */}
              <div className="p-4 sm:p-5 border-b border-nexus-border/40 bg-black/20 space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeCommand(simulatedVoiceInput, "simulation");
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Mic className="w-4 h-4 text-nexus-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Simulate vocal instruction (e.g. 'Open Google Sheets', 'Go to AI Engine', 'Show Topology Map')..."
                      value={simulatedVoiceInput}
                      onChange={(e) => setSimulatedVoiceInput(e.target.value)}
                      className="w-full bg-white/5 border border-nexus-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-nexus-text-dim focus:outline-none focus:border-nexus-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-nexus-accent hover:bg-white text-black font-bold text-xs rounded-xl transition-all shadow-md neon-glow flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Test Command</span>
                  </button>
                </form>

                {/* Fast Trigger Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
                  <span className="text-[10px] font-mono text-nexus-text-dim shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-nexus-accent" /> Quick Test:
                  </span>
                  {[
                    "Open Google Sheets",
                    "Go to AI Engine",
                    "Show Topology Map",
                    "Open Smart Inbox",
                    "Go to Deployment Hub",
                    "Open Command Center",
                    "Help"
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => executeCommand(phrase, "quick_action")}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-nexus-accent/20 border border-white/10 hover:border-nexus-accent/40 text-nexus-text-dim hover:text-white transition-all whitespace-nowrap text-[10px] font-mono"
                    >
                      &quot;{phrase}&quot;
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter, Search & Export Bar */}
              <div className="px-5 py-3 border-b border-nexus-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      filter === "all"
                        ? "bg-nexus-accent text-black neon-glow"
                        : "bg-white/5 text-nexus-text-dim hover:text-white"
                    }`}
                  >
                    All ({history.length})
                  </button>
                  <button
                    onClick={() => setFilter("success")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      filter === "success"
                        ? "bg-green-500 text-black font-bold shadow-lg shadow-green-500/20"
                        : "bg-white/5 text-nexus-text-dim hover:text-green-400"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Success ({successfulCommands})
                  </button>
                  <button
                    onClick={() => setFilter("warning")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      filter === "warning"
                        ? "bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20"
                        : "bg-white/5 text-nexus-text-dim hover:text-yellow-400"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Warnings ({warningCommands})
                  </button>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3 h-3 text-nexus-text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search voice history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/5 border border-nexus-border rounded-lg pl-7 pr-3 py-1 text-xs text-white placeholder:text-nexus-text-dim focus:outline-none focus:border-nexus-accent w-36 sm:w-48"
                    />
                  </div>

                  <button
                    onClick={handleExportJournal}
                    title="Export JSON Journal"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white border border-white/5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleClearHistory}
                    title="Clear Log History"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-nexus-text-dim hover:text-red-400 border border-white/5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable History Log Stream */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-2.5 custom-scrollbar">
                {filteredLogs.length === 0 ? (
                  <div className="py-20 text-center text-nexus-text-dim space-y-3">
                    <Radio className="w-10 h-10 mx-auto text-nexus-text-dim/30 animate-pulse" />
                    <p className="text-sm font-medium text-white">No voice commands recorded</p>
                    <p className="text-xs text-nexus-text-dim max-w-sm mx-auto">
                      Speak into your microphone in Avatar Sync or use the test bar above to simulate vocal triggers.
                    </p>
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    const isCopied = copiedId === log.id;
                    const isSuccess = log.status === "success";
                    const isWarning = log.status === "warning";
                    const isInfo = log.status === "info";

                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                          isSuccess
                            ? "bg-green-500/[0.03] hover:bg-green-500/[0.07] border-green-500/20"
                            : isWarning
                            ? "bg-yellow-500/[0.03] hover:bg-yellow-500/[0.07] border-yellow-500/20"
                            : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"
                        }`}
                      >
                        {/* Left: Status icon + Raw Speech & Parsed Action */}
                        <div className="flex items-start gap-3.5 overflow-hidden">
                          <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                            isSuccess
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : isWarning
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/30"
                          }`}>
                            {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                            {isWarning && <AlertTriangle className="w-4 h-4" />}
                            {isInfo && <Radio className="w-4 h-4" />}
                          </div>

                          <div className="space-y-1 overflow-hidden">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10">
                                &quot;{log.rawSpeech}&quot;
                              </span>
                              
                              {log.targetModule && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/30 font-mono font-bold">
                                  {log.targetModule}
                                </span>
                              )}

                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                log.confidenceScore >= 90
                                  ? "text-green-400 bg-green-500/10"
                                  : log.confidenceScore >= 60
                                  ? "text-yellow-400 bg-yellow-500/10"
                                  : "text-red-400 bg-red-500/10"
                              }`}>
                                {log.confidenceScore}% conf
                              </span>
                            </div>

                            <p className="text-xs text-nexus-text leading-relaxed">
                              {log.matchedAction}
                            </p>
                          </div>
                        </div>

                        {/* Right: Telemetry metadata & Action buttons */}
                        <div className="flex items-center gap-3 sm:shrink-0 justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                          <div className="text-left sm:text-right text-[10px] font-mono text-nexus-text-dim space-y-0.5">
                            <div>{log.exactTime}</div>
                            <div className="text-cyan-400/80">{log.latencyMs}ms</div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => executeCommand(log.rawSpeech, "quick_action")}
                              title="Re-execute command"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-nexus-accent hover:text-black text-nexus-text-dim transition-all"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleCopyLog(log)}
                              title="Copy details to clipboard"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* HUD Footer */}
              <div className="p-4 border-t border-nexus-border/60 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-nexus-text-dim">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Web Speech Listener: READY
                  </span>
                  <span className="text-[11px] font-mono opacity-60">
                    Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Alt+V</kbd>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span>Feedback Level: <strong className="text-white">Active Synthesized</strong></span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-nexus-accent hover:underline font-bold"
                  >
                    Dismiss HUD
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
