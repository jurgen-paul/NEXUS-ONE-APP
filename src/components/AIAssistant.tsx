import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Volume2, 
  VolumeX,
  ShieldCheck, 
  Zap, 
  Cpu, 
  Activity,
  Check,
  ChevronRight,
  Info,
  Settings,
  X,
  Mic,
  MicOff,
  Radio,
  Navigation,
  Compass,
  HelpCircle,
  Terminal,
  ArrowRight,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Module } from "@/src/types";

interface Avatar {
  id: string;
  name: string;
  personality: string;
  description: string;
  style: "Ethereal" | "Cyberpunk" | "Minimalist";
  color: string;
  image: string;
  traits: string[];
}

interface VoiceCommandMapping {
  moduleId: Module;
  name: string;
  aliases: string[];
  category: "Core" | "Intelligence" | "Engineering" | "Operations";
  description: string;
  samplePhrases: string[];
}

interface CommandLogItem {
  id: string;
  timestamp: string;
  rawText: string;
  matchedAction: string;
  status: "success" | "warning" | "error" | "info";
  targetModule?: Module;
}

const AVATARS: Avatar[] = [
  { 
    id: "aura", 
    name: "Aura", 
    personality: "Strategic & Calm", 
    description: "A holographic synthesis of pure nexus energy. Balanced, analytical, and highly intuitive.",
    style: "Ethereal",
    color: "blue",
    image: "https://picsum.photos/seed/aura-nexus/400/400",
    traits: ["Deep Analysis", "Calm Logic", "Intuitive Routing"]
  },
  { 
    id: "nova", 
    name: "Nova", 
    personality: "Dynamic & Precise", 
    description: "High-octane mechanical consciousness optimized for speed and aggressive performance mapping.",
    style: "Cyberpunk",
    color: "purple",
    image: "https://picsum.photos/seed/nova-cyber/400/400",
    traits: ["Overclocked Logic", "Real-time Auditing", "Threat Neutralization"]
  },
  { 
    id: "echo", 
    name: "Echo", 
    personality: "Adaptive & Helpful", 
    description: "Geometric humanoid construct designed for seamless multi-environment adaptation and user harmony.",
    style: "Minimalist",
    color: "cyan",
    image: "https://picsum.photos/seed/echo-geom/400/400",
    traits: ["Perfect Sync", "Humanoid Empathy", "Adaptive UI Scaling"]
  }
];

const VOICE_NAVIGATION_MAP: VoiceCommandMapping[] = [
  {
    moduleId: Module.DASHBOARD,
    name: "Command Center",
    category: "Core",
    aliases: ["dashboard", "command center", "command", "home", "overview", "mission control", "main view", "center"],
    description: "Primary system metrics, throughput radars, and activity pulses.",
    samplePhrases: ["Go to dashboard", "Open command center", "Launch mission control"]
  },
  {
    moduleId: Module.AI_ENGINE,
    name: "Unified AI Engine",
    category: "Intelligence",
    aliases: ["ai engine", "artificial intelligence", "engine", "neural engine", "brain", "core ai", "models", "gemini engine", "ai matrix"],
    description: "Multi-model orchestration, prompt synthesis, and real-time inference.",
    samplePhrases: ["Open AI Engine", "Switch to neural models", "Launch AI brain"]
  },
  {
    moduleId: Module.SOCIAL,
    name: "Social Control",
    category: "Operations",
    aliases: ["social", "social control", "social media", "feeds", "posts", "broadcast", "channels", "community"],
    description: "Unified cross-platform social media dispatch and engagement grid.",
    samplePhrases: ["Open social control", "Navigate to feeds", "Go to social media"]
  },
  {
    moduleId: Module.MARKETING,
    name: "Marketing Suite",
    category: "Operations",
    aliases: ["marketing", "marketing suite", "campaigns", "analytics", "seo", "ads", "growth", "funnel"],
    description: "Autonomous campaign generator, SEO optimizer, and growth tracker.",
    samplePhrases: ["Open marketing suite", "Show marketing analytics", "Go to campaigns"]
  },
  {
    moduleId: Module.NAVIGATION,
    name: "Navigation System",
    category: "Operations",
    aliases: ["navigation", "navigation system", "navigation sys", "gps", "routes", "waypoint", "maps", "traffic matrix", "teleportation", "quantum teleportation", "quantum teleport", "quantum navigation", "teleport"],
    description: "Real-time global telemetry, waypoint routing, and mission paths.",
    samplePhrases: ["Open navigation system", "Show GPS map", "Launch quantum navigation"]
  },
  {
    moduleId: Module.CREATOR,
    name: "Instant Builder",
    category: "Engineering",
    aliases: ["creator", "builder", "instant builder", "app builder", "scaffold", "prototype", "app creator"],
    description: "Rapid prototyping playground with generative full-stack scaffolds.",
    samplePhrases: ["Open instant builder", "Go to app creator", "Launch prototype builder"]
  },
  {
    moduleId: Module.DEPLOYMENT,
    name: "Deployment Hub",
    category: "Engineering",
    aliases: ["deployment", "deployment hub", "deployments", "cloud deploy", "releases", "ci cd", "pipeline", "shipping"],
    description: "Multi-cloud release pipelines, container health, and rollback controls.",
    samplePhrases: ["Open deployment hub", "Show CI CD pipeline", "Go to cloud deployments"]
  },
  {
    moduleId: Module.DOCS,
    name: "Smart Forms & Docs",
    category: "Core",
    aliases: ["docs", "documents", "smart docs", "smart forms", "forms", "contracts", "nda", "invoices", "templates"],
    description: "Automated compliant legal contracts, NDAs, and live invoice generator.",
    samplePhrases: ["Open smart docs", "Go to forms", "Generate NDA contract"]
  },
  {
    moduleId: Module.COMMUNICATION,
    name: "Mail Hub",
    category: "Operations",
    aliases: ["mail", "mail hub", "communication", "email", "messages", "inbox mail", "dispatch"],
    description: "Encrypted enterprise dispatch, automated replies, and mailing relays.",
    samplePhrases: ["Open mail hub", "Go to emails", "Show communications"]
  },
  {
    moduleId: Module.SALES,
    name: "Sales Intelligence",
    category: "Operations",
    aliases: ["sales", "sales intelligence", "revenue", "pipeline sales", "crm", "deals", "leads", "conversions"],
    description: "Predictive revenue forecasting, deal velocity, and pipeline intelligence.",
    samplePhrases: ["Open sales intelligence", "Show revenue deals", "Go to CRM leads"]
  },
  {
    moduleId: Module.AR_VIEW,
    name: "AR Interface",
    category: "Intelligence",
    aliases: ["ar", "ar view", "augmented reality", "ar interface", "vision", "hud", "spatial view", "hologram"],
    description: "Spatial augmented reality HUD overlay and holographic viewport.",
    samplePhrases: ["Open AR interface", "Launch augmented vision", "Switch to AR view"]
  },
  {
    moduleId: Module.ASSISTANT,
    name: "Avatar Sync",
    category: "Intelligence",
    aliases: ["assistant", "ai assistant", "avatar", "avatar sync", "personality", "neural personality", "voice sync"],
    description: "Neural voice persona configuration and interactive speech listener.",
    samplePhrases: ["Open avatar sync", "Go to AI assistant", "Configure voice matrix"]
  },
  {
    moduleId: Module.SMART_INBOX,
    name: "Smart Inbox",
    category: "Core",
    aliases: ["smart inbox", "inbox", "notifications", "alerts", "unread", "activity inbox", "priority feed"],
    description: "AI-categorized priority streams, security alerts, and client digests.",
    samplePhrases: ["Open smart inbox", "Check priority notifications", "Go to inbox"]
  },
  {
    moduleId: Module.CLOUD_CONFIG,
    name: "Cloud Parameters",
    category: "Engineering",
    aliases: ["cloud", "cloud config", "cloud parameters", "gcp", "services", "infrastructure", "terraform", "app engine", "api keys"],
    description: "Google Cloud APIs, App Engine services, and parameter vaults.",
    samplePhrases: ["Open cloud parameters", "Show App Engine services", "Go to cloud config"]
  },
  {
    moduleId: Module.COLLABORATION,
    name: "Collaboration Hub",
    category: "Core",
    aliases: ["collaboration", "collaboration hub", "team", "multiplayer", "collab", "co-working", "active agents"],
    description: "Real-time multi-agent presence, shared whiteboards, and live sessions.",
    samplePhrases: ["Open collaboration hub", "Show team members", "Go to live collab"]
  },
  {
    moduleId: Module.CONTENT_HUB,
    name: "Content Matrix",
    category: "Operations",
    aliases: ["content", "content hub", "content matrix", "articles", "news", "cms", "publications", "editorial"],
    description: "AI multi-channel content curation, editorial queues, and publishing.",
    samplePhrases: ["Open content matrix", "Show editorial queue", "Go to articles"]
  },
  {
    moduleId: Module.AI_GENERATOR,
    name: "Neural Architect",
    category: "Intelligence",
    aliases: ["ai generator", "neural architect", "super ai", "code generator", "generator", "architect", "super generator"],
    description: "Full-scale generative system synthesis and autonomous architectural drafting.",
    samplePhrases: ["Open neural architect", "Launch super AI generator", "Go to code generator"]
  },
  {
    moduleId: Module.DEPENDENCY_MAP,
    name: "Topology Map",
    category: "Engineering",
    aliases: ["topology", "topology map", "dependency map", "dependencies", "architecture map", "network graph", "service graph"],
    description: "Interactive reactive dependency graphs and live microservice clusters.",
    samplePhrases: ["Open topology map", "Show dependency graph", "Go to architecture map"]
  },
  {
    moduleId: Module.SHEETS,
    name: "Google Sheets Hub",
    category: "Operations",
    aliases: ["sheets", "google sheets", "spreadsheet", "spreadsheets", "excel", "sheets hub", "google drive sheets", "tables", "sheet data"],
    description: "Real-time Google Workspace Sheets reader, table editor, and telemetry exporter.",
    samplePhrases: ["Open Google Sheets", "Go to spreadsheets", "Show sheets hub"]
  },
  {
    moduleId: Module.SETTINGS,
    name: "App Settings",
    category: "Core",
    aliases: ["settings", "preferences", "config", "app settings", "configuration", "system setup", "account"],
    description: "System privileges, themes, network endpoints, and profile security.",
    samplePhrases: ["Open settings", "Go to system configuration", "Show preferences"]
  }
];

export const AIAssistant = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(AVATARS[0]);
  const [customization, setCustomization] = useState({
    themeIntensity: 65,
    vocalPitch: 42,
    renderLegacy: false,
    neonSync: true,
    audioFeedback: true,
    continuousWakeWord: false
  });

  // Voice listener states
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [lastFeedback, setLastFeedback] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 30, 60, 40, 75, 50, 20]);
  const [commandHistory, setCommandHistory] = useState<CommandLogItem[]>([
    {
      id: "cmd-init",
      timestamp: "Just now",
      rawText: "System voice engine initialized",
      matchedAction: "Voice Listener Ready",
      status: "info"
    }
  ]);

  // Modal / Cheat sheet state
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [simulatedInput, setSimulatedInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const recognitionRef = useRef<any>(null);
  const audioIntervalRef = useRef<any>(null);

  // Check Web Speech API availability on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Equalizer visualizer effect when listening
  useEffect(() => {
    if (isListening) {
      audioIntervalRef.current = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 60 + 20),
          Math.floor(Math.random() * 85 + 15),
          Math.floor(Math.random() * 95 + 25),
          Math.floor(Math.random() * 70 + 30),
          Math.floor(Math.random() * 90 + 20),
          Math.floor(Math.random() * 80 + 15),
          Math.floor(Math.random() * 55 + 20),
        ]);
      }, 100);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioLevel([15, 20, 25, 20, 25, 20, 15]);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isListening]);

  // Speak synthesized voice confirmation
  const speakFeedback = (message: string) => {
    if (!customization.audioFeedback) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.05;
        utterance.pitch = (customization.vocalPitch / 50);
        
        // Pick a matching voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Zira")));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech synthesis notice:", err);
      }
    }
  };

  // Dispatch navigation event to root App
  const triggerNavigation = (targetModule: Module, moduleName: string) => {
    window.dispatchEvent(new CustomEvent("nexus-navigate", { detail: targetModule }));
    const successMsg = `Navigating to ${moduleName}`;
    setLastFeedback({ text: successMsg, type: "success" });
    speakFeedback(successMsg);

    const logItem: CommandLogItem = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawText: transcript || `Direct command: ${moduleName}`,
      matchedAction: `Switched view to ${moduleName}`,
      status: "success",
      targetModule
    };

    setCommandHistory(prev => [logItem, ...prev.slice(0, 15)]);

    // Dispatch global event for VoiceCommandOverlay
    window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
      detail: {
        rawSpeech: transcript || `Direct command: ${moduleName}`,
        matchedAction: `Switched view to ${moduleName}`,
        targetModule,
        status: "success",
        confidenceScore: 98,
        latencyMs: Math.floor(Math.random() * 60 + 90),
        source: "microphone"
      }
    }));
  };

  // Comprehensive Voice & Command Parser
  const parseAndExecuteVoiceCommand = (rawSpeech: string) => {
    const cleaned = rawSpeech.toLowerCase().trim();
    if (!cleaned) return;

    // 0. Voice History Overlay Trigger
    if (cleaned.includes("voice history") || cleaned.includes("voice log") || cleaned.includes("activation history") || cleaned.includes("feedback log") || cleaned.includes("voice journal")) {
      window.dispatchEvent(new CustomEvent("nexus-open-voice-history"));
      const msg = "Opening Voice Activation Feedback Overlay";
      setLastFeedback({ text: msg, type: "info" });
      speakFeedback(msg);
      window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
        detail: {
          rawSpeech,
          matchedAction: "Opened Voice Activation Telemetry Overlay",
          status: "success",
          confidenceScore: 99,
          latencyMs: 85,
          source: "microphone"
        }
      }));
      return;
    }

    // 1. Navigation Commands
    // Match against any mapped module
    let matchedModule: VoiceCommandMapping | null = null;
    let highestScore = 0;

    for (const mapping of VOICE_NAVIGATION_MAP) {
      for (const alias of mapping.aliases) {
        if (cleaned.includes(alias)) {
          // Score by specificity (length of matched alias)
          if (alias.length > highestScore) {
            highestScore = alias.length;
            matchedModule = mapping;
          }
        }
      }
    }

    if (matchedModule) {
      triggerNavigation(matchedModule.moduleId, matchedModule.name);
      return;
    }

    // 2. Avatar Switch Commands ("set avatar to nova", "change persona to echo", etc.)
    if (cleaned.includes("avatar") || cleaned.includes("persona") || cleaned.includes("character")) {
      const foundAvatar = AVATARS.find(a => cleaned.includes(a.name.toLowerCase()) || cleaned.includes(a.id));
      if (foundAvatar) {
        setSelectedAvatar(foundAvatar);
        const msg = `Avatar personality synced to ${foundAvatar.name}`;
        setLastFeedback({ text: msg, type: "success" });
        speakFeedback(msg);
        setCommandHistory(prev => [
          {
            id: `cmd-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            rawText: rawSpeech,
            matchedAction: `Selected ${foundAvatar.name} Persona`,
            status: "success"
          },
          ...prev.slice(0, 15)
        ]);

        window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
          detail: {
            rawSpeech,
            matchedAction: `Selected ${foundAvatar.name} Persona`,
            status: "success",
            confidenceScore: 96,
            latencyMs: 110,
            source: "microphone"
          }
        }));
        return;
      }
    }

    // 3. UI Toggle Commands
    if (cleaned.includes("neon") || cleaned.includes("glow")) {
      setCustomization(prev => {
        const nextState = !prev.neonSync;
        const msg = `Neon sync ${nextState ? "activated" : "deactivated"}`;
        setLastFeedback({ text: msg, type: "info" });
        speakFeedback(msg);
        window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
          detail: {
            rawSpeech,
            matchedAction: `Neon shader sync ${nextState ? "activated" : "deactivated"}`,
            status: "success",
            confidenceScore: 94,
            latencyMs: 95,
            source: "microphone"
          }
        }));
        return { ...prev, neonSync: nextState };
      });
      return;
    }

    if (cleaned.includes("legacy") || cleaned.includes("projection")) {
      setCustomization(prev => {
        const nextState = !prev.renderLegacy;
        const msg = `Legacy projection mode ${nextState ? "enabled" : "disabled"}`;
        setLastFeedback({ text: msg, type: "info" });
        speakFeedback(msg);
        window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
          detail: {
            rawSpeech,
            matchedAction: `Legacy projection mode ${nextState ? "enabled" : "disabled"}`,
            status: "success",
            confidenceScore: 92,
            latencyMs: 100,
            source: "microphone"
          }
        }));
        return { ...prev, renderLegacy: nextState };
      });
      return;
    }

    if (cleaned.includes("mute") || cleaned.includes("audio feedback") || cleaned.includes("voice feedback") || cleaned.includes("speech synthesis")) {
      setCustomization(prev => {
        const nextState = !prev.audioFeedback;
        const msg = `Audio confirmation ${nextState ? "enabled" : "muted"}`;
        setLastFeedback({ text: msg, type: "info" });
        if (nextState) speakFeedback("Voice feedback enabled");
        window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
          detail: {
            rawSpeech,
            matchedAction: `Audio confirmation ${nextState ? "enabled" : "muted"}`,
            status: "info",
            confidenceScore: 95,
            latencyMs: 85,
            source: "microphone"
          }
        }));
        return { ...prev, audioFeedback: nextState };
      });
      return;
    }

    // 4. Help / Cheat sheet trigger
    if (cleaned.includes("help") || cleaned.includes("what can i say") || cleaned.includes("commands")) {
      setIsCheatSheetOpen(true);
      const msg = "Displaying full voice navigation index.";
      setLastFeedback({ text: msg, type: "info" });
      speakFeedback(msg);
      window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
        detail: {
          rawSpeech,
          matchedAction: "Displayed Voice Command Cheat Sheet",
          status: "info",
          confidenceScore: 99,
          latencyMs: 70,
          source: "microphone"
        }
      }));
      return;
    }

    // Fallback: Unknown command
    const warnMsg = `Command unrecognized: "${rawSpeech}". Say "Help" for list of valid navigation commands.`;
    setLastFeedback({ text: warnMsg, type: "warning" });
    speakFeedback(`Unrecognized command: ${rawSpeech}`);
    setCommandHistory(prev => [
      {
        id: `cmd-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rawText: rawSpeech,
        matchedAction: "Unrecognized instruction",
        status: "warning"
      },
      ...prev.slice(0, 15)
    ]);

    window.dispatchEvent(new CustomEvent("nexus-voice-command-executed", {
      detail: {
        rawSpeech,
        matchedAction: `Unrecognized instruction: "${rawSpeech}". Say "Help" for command list`,
        status: "warning",
        confidenceScore: Math.floor(Math.random() * 20 + 20),
        latencyMs: Math.floor(Math.random() * 50 + 80),
        source: "microphone"
      }
    }));
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setLastFeedback({ 
        text: "Web Speech Recognition API is unavailable in this environment. Use the manual command trigger or simulation bar below.", 
        type: "warning" 
      });
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = customization.continuousWakeWord;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setInterimText("");
        setLastFeedback({ text: "Microphone active. Listening for voice navigation commands...", type: "info" });
      };

      recognition.onresult = (event: any) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }

        if (interimStr) {
          setInterimText(interimStr);
        }

        if (finalStr) {
          setTranscript(finalStr);
          setInterimText("");
          parseAndExecuteVoiceCommand(finalStr);
          
          if (!customization.continuousWakeWord) {
            stopListening();
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setLastFeedback({ text: "Microphone permission was denied. Please grant microphone access in browser settings.", type: "warning" });
        } else if (event.error !== "no-speech") {
          setLastFeedback({ text: `Voice recognition status: ${event.error}`, type: "info" });
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        if (!customization.continuousWakeWord) {
          setIsListening(false);
        } else if (isListening) {
          // Restart if continuous wake-word mode is desired
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to initialize speech recognition:", err);
      setIsListening(false);
      setLastFeedback({ text: "Unable to start audio stream. Try simulated command testing below.", type: "warning" });
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Safe catch
      }
    }
  };

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedInput.trim()) return;
    setTranscript(simulatedInput);
    parseAndExecuteVoiceCommand(simulatedInput);
    setSimulatedInput("");
  };

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return VOICE_NAVIGATION_MAP;
    const q = searchQuery.toLowerCase();
    return VOICE_NAVIGATION_MAP.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.aliases.some(a => a.includes(q)) ||
      m.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      {/* Header with Master Voice Listener Status */}
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className={cn("w-4 h-4", isListening ? "text-nexus-accent animate-pulse" : "text-nexus-text-dim")} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-nexus-text-dim">
              NEURAL VOICE DISPATCH // PROTOCOL v3.4
            </span>
          </div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight neon-text uppercase">Avatar Sync & Voice Control</h1>
          <p className="text-nexus-text-dim mt-1 tracking-wider text-xs font-mono">
            Direct real-time microphone listener for vocal system navigation & neural personality modulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCheatSheetOpen(true)}
            className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:border-nexus-accent/40 text-xs font-mono uppercase text-nexus-text-dim hover:text-white transition-all"
            title="View all supported voice commands"
          >
            <HelpCircle className="w-4 h-4 text-nexus-accent" />
            <span>Voice Reference Index</span>
          </button>

          <button
            onClick={() => setCustomization(prev => ({ ...prev, audioFeedback: !prev.audioFeedback }))}
            className={cn(
              "p-2.5 rounded-xl glass border transition-all",
              customization.audioFeedback ? "border-nexus-accent/40 text-nexus-accent bg-nexus-accent/10" : "border-white/5 text-nexus-text-dim"
            )}
            title={customization.audioFeedback ? "Audio feedback enabled" : "Audio feedback muted"}
          >
            {customization.audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MASTER VOICE-ACTIVATION LISTENER HUD */}
      <section className={cn(
        "glass p-6 md:p-8 rounded-[36px] border-2 transition-all relative overflow-hidden",
        isListening 
          ? "border-nexus-accent bg-nexus-accent/[0.04] shadow-[0_0_50px_rgba(5,255,161,0.15)]" 
          : "border-white/10 bg-black/40"
      )}>
        {/* Subtle background radar scanline */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Radio className="w-48 h-48 text-nexus-accent" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Microphone Activation Trigger & Audio Frequency Equalizer */}
          <div className="flex items-center gap-6 w-full lg:w-auto">
            <button
              onClick={startListening}
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all shrink-0 relative group shadow-2xl cursor-pointer",
                isListening 
                  ? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse" 
                  : "bg-nexus-accent text-black hover:bg-white hover:shadow-[0_0_30px_rgba(5,255,161,0.5)]"
              )}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-black" />
              )}
              
              {/* Outer pulsing radar ring when listening */}
              {isListening && (
                <span className="absolute -inset-2 rounded-full border-2 border-red-500/50 animate-ping pointer-events-none" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  isListening ? "bg-red-500 animate-ping" : "bg-nexus-accent"
                )} />
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
                  {isListening ? "Listening for Navigation Command..." : "Microphone Listener Inactive"}
                </h3>
              </div>
              <p className="text-xs text-nexus-text-dim font-mono mt-1">
                {isListening 
                  ? 'Say "Open Command Center", "Go to Topology Map", "Show Smart Inbox", etc.' 
                  : 'Click the microphone button to activate real-time speech commands.'}
              </p>

              {/* Animated audio bars */}
              <div className="flex items-center gap-1.5 mt-3 h-6">
                {audioLevel.map((lvl, idx) => (
                  <motion.div
                    key={idx}
                    className={cn(
                      "w-1.5 rounded-full transition-all duration-75",
                      isListening ? "bg-nexus-accent" : "bg-white/10"
                    )}
                    style={{ height: `${lvl}%` }}
                  />
                ))}
                <span className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-wider ml-2">
                  {isListening ? "VOICE INPUT CAPTURE ACTIVE" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Voice Prompt Shortcuts */}
          <div className="w-full lg:w-auto flex flex-col items-start lg:items-end gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-nexus-text-dim">
              Quick Test Prompts
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Dashboard", cmd: "Go to dashboard", mod: Module.DASHBOARD },
                { label: "AI Engine", cmd: "Open AI engine", mod: Module.AI_ENGINE },
                { label: "Cloud Config", cmd: "Open cloud parameters", mod: Module.CLOUD_CONFIG },
                { label: "Smart Inbox", cmd: "Go to smart inbox", mod: Module.SMART_INBOX },
                { label: "Topology Map", cmd: "Launch topology map", mod: Module.DEPENDENCY_MAP },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setTranscript(chip.cmd);
                    parseAndExecuteVoiceCommand(chip.cmd);
                  }}
                  className="px-3 py-1.5 glass rounded-xl text-[11px] font-mono text-nexus-text-dim hover:text-nexus-accent hover:border-nexus-accent/40 flex items-center gap-1.5 transition-all group"
                >
                  <Sparkles className="w-3 h-3 text-nexus-accent group-hover:animate-spin" />
                  <span>"{chip.label}"</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Speech Recognition Transcript Bubble */}
        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 flex items-center gap-3">
            <Terminal className="w-4 h-4 text-nexus-accent shrink-0" />
            <div className="flex-1 overflow-hidden">
              <div className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-widest mb-0.5">
                Active Transcript Stream
              </div>
              <p className="text-sm font-mono text-white truncate">
                {transcript || interimText ? (
                  <span className="text-nexus-accent font-bold">
                    "{transcript || interimText}"
                  </span>
                ) : (
                  <span className="text-nexus-text-dim italic">
                    {isListening ? "Listening... Speak any navigation command clearly." : "No active vocal stream detected."}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Feedback Status Pill */}
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <AnimatePresence mode="wait">
              {lastFeedback && (
                <motion.div
                  key={lastFeedback.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2",
                    lastFeedback.type === "success" && "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]",
                    lastFeedback.type === "warning" && "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
                    lastFeedback.type === "info" && "bg-nexus-accent/10 border-nexus-accent/30 text-nexus-accent"
                  )}
                >
                  {lastFeedback.type === "success" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {lastFeedback.type === "warning" && <AlertCircle className="w-3.5 h-3.5" />}
                  {lastFeedback.type === "info" && <Activity className="w-3.5 h-3.5" />}
                  <span className="truncate max-w-[280px]">{lastFeedback.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Fallback Simulation / Manual Command Prompt for headless testing */}
        <form onSubmit={handleSimulatedSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={simulatedInput}
            onChange={(e) => setSimulatedInput(e.target.value)}
            placeholder="Type or test any voice phrase (e.g., 'open deployment hub', 'change avatar to nova', 'go to smart forms')..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder:text-nexus-text-dim/60 outline-none focus:border-nexus-accent/50 focus:bg-white/[0.03] transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white/10 hover:bg-nexus-accent hover:text-black text-white font-mono text-xs uppercase font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            Execute
          </button>
        </form>
      </section>

      {/* Main Grid: Avatar Selection & Customization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar Selection & Command History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-nexus-text-dim font-mono uppercase tracking-widest">Neural Persona Synchronization</p>
            <span className="text-[10px] font-mono text-nexus-accent uppercase">3/3 Matrices Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => {
                  setSelectedAvatar(avatar);
                  const msg = `Avatar personality synced to ${avatar.name}`;
                  setLastFeedback({ text: msg, type: "success" });
                  speakFeedback(msg);
                }}
                className={cn(
                  "glass p-4 rounded-3xl border-2 transition-all relative overflow-hidden group text-left cursor-pointer",
                  selectedAvatar.id === avatar.id 
                    ? "border-nexus-accent bg-nexus-accent/5 shadow-[0_0_25px_rgba(5,255,161,0.1)]" 
                    : "border-white/5 hover:border-white/20"
                )}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-black">
                  <img 
                    src={avatar.image} 
                    alt={avatar.name} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className={cn(
                    "absolute inset-0 opacity-20",
                    avatar.color === "blue" ? "bg-blue-500" : avatar.color === "purple" ? "bg-purple-500" : "bg-cyan-500"
                  )} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-white">{avatar.name}</h3>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-nexus-text-dim">
                    {avatar.style}
                  </span>
                </div>
                <p className="text-[10px] text-nexus-text-dim uppercase font-mono mt-1">{avatar.personality}</p>
                
                {selectedAvatar.id === avatar.id && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-nexus-accent text-black shadow-lg">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Active Avatar Profile Detail Card */}
          <div className="glass p-8 rounded-[40px] relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-32 h-32 text-nexus-accent" />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="relative w-44 h-44 shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-nexus-accent/20 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border border-dashed border-nexus-accent/10 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-nexus-accent p-1 shadow-[0_0_30px_rgba(5,255,161,0.2)]">
                  <img 
                    src={selectedAvatar.image} 
                    alt={selectedAvatar.name}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                    {selectedAvatar.name} Profile
                  </h2>
                  <div className="px-3 py-1 rounded-full bg-nexus-accent/10 border border-nexus-accent/30 text-[10px] font-bold text-nexus-accent uppercase font-mono">
                    ID: {selectedAvatar.id.toUpperCase()} // ACTIVE
                  </div>
                </div>
                <p className="text-nexus-text-dim text-sm leading-relaxed max-w-xl">
                  {selectedAvatar.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAvatar.traits.map((trait, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-nexus-accent/10 border border-nexus-accent/20 text-[10px] font-bold text-nexus-accent uppercase font-mono">
                      <Zap className="w-3 h-3" />
                      {trait}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Voice Command Execution History Log */}
          <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-nexus-accent" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Voice Command Journal</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("nexus-open-voice-history"))}
                  className="text-[10px] font-mono text-nexus-accent hover:text-white transition-colors uppercase flex items-center gap-1 bg-nexus-accent/10 border border-nexus-accent/20 px-2 py-0.5 rounded-lg"
                  title="Launch full Voice Activation Telemetry Overlay"
                >
                  <Activity className="w-3 h-3 text-nexus-accent" />
                  Launch Overlay HUD
                </button>
                <button
                  onClick={() => setCommandHistory([])}
                  className="text-[10px] font-mono text-nexus-text-dim hover:text-white transition-colors uppercase flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {commandHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 text-xs font-mono"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      item.status === "success" && "bg-green-400",
                      item.status === "warning" && "bg-yellow-400",
                      item.status === "error" && "bg-red-400",
                      item.status === "info" && "bg-nexus-accent"
                    )} />
                    <span className="text-white font-bold truncate">"{item.rawText}"</span>
                    <span className="text-nexus-text-dim text-[11px] truncate">→ {item.matchedAction}</span>
                  </div>
                  <span className="text-[10px] text-nexus-text-dim shrink-0">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Neural Customization & Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 rounded-3xl space-y-6 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-nexus-accent" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Neural Voice Engine Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-nexus-text-dim uppercase">
                  <span>Theme Resonance</span>
                  <span className="text-nexus-accent">{customization.themeIntensity}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={customization.themeIntensity}
                  onChange={(e) => setCustomization(prev => ({ ...prev, themeIntensity: parseInt(e.target.value) }))}
                  className="w-full appearance-none h-1 bg-white/10 rounded-full accent-nexus-accent"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-nexus-text-dim uppercase">
                  <span>Speech Synthesis Frequency</span>
                  <span className="text-nexus-accent">{customization.vocalPitch * 10} Hz</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="100"
                  value={customization.vocalPitch}
                  onChange={(e) => setCustomization(prev => ({ ...prev, vocalPitch: parseInt(e.target.value) }))}
                  className="w-full appearance-none h-1 bg-white/10 rounded-full accent-nexus-accent"
                />
              </div>

              <div className="pt-4 space-y-3">
                {/* Audio Feedback Confirmation Toggle */}
                <button 
                  onClick={() => setCustomization(prev => ({ ...prev, audioFeedback: !prev.audioFeedback }))}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-nexus-accent/30 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-nexus-accent" />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-white block">Speech Feedback</span>
                      <span className="text-[9px] text-nexus-text-dim font-mono">Vocal navigation confirmations</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors",
                    customization.audioFeedback ? "bg-nexus-accent" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                      customization.audioFeedback ? "left-6" : "left-1"
                    )} />
                  </div>
                </button>

                {/* Neon Sync Processing */}
                <button 
                  onClick={() => setCustomization(prev => ({ ...prev, neonSync: !prev.neonSync }))}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-nexus-accent/30 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-nexus-accent" />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-white block">Neon Sync Processing</span>
                      <span className="text-[9px] text-nexus-text-dim font-mono">Real-time shader pulsing</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors",
                    customization.neonSync ? "bg-nexus-accent" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                      customization.neonSync ? "left-6" : "left-1"
                    )} />
                  </div>
                </button>

                {/* Legacy Projection */}
                <button 
                  onClick={() => setCustomization(prev => ({ ...prev, renderLegacy: !prev.renderLegacy }))}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-nexus-accent/30 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-white block">Legacy Projection Mode</span>
                      <span className="text-[9px] text-nexus-text-dim font-mono">Compatibility shaders</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors",
                    customization.renderLegacy ? "bg-purple-500" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                      customization.renderLegacy ? "left-6" : "left-1"
                    )} />
                  </div>
                </button>
              </div>
            </div>

            <button 
              onClick={() => {
                const msg = `Global parameters synchronized to ${selectedAvatar.name}`;
                setLastFeedback({ text: msg, type: "success" });
                speakFeedback(msg);
              }}
              className="w-full py-4 bg-nexus-accent text-black font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(5,255,161,0.4)] hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest text-xs cursor-pointer"
            >
              Sync Neural Parameters
            </button>
          </div>

          <div className="glass p-6 rounded-3xl border border-nexus-accent/20 bg-nexus-accent/5 space-y-3">
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4 text-nexus-accent" />
              <h4 className="text-[10px] font-bold uppercase text-nexus-accent tracking-widest">Voice Navigation Quick Tip</h4>
            </div>
            <p className="text-[11px] text-nexus-text-dim leading-relaxed font-mono">
              You can navigate to any view by saying <span className="text-white font-bold">"Open [Module Name]"</span> or <span className="text-white font-bold">"Go to [Module Name]"</span>. Click the Voice Reference Index above to see all mapped commands.
            </p>
          </div>
        </div>
      </div>

      {/* VOICE COMMAND CHEAT SHEET MODAL */}
      <AnimatePresence>
        {isCheatSheetOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass max-w-3xl w-full h-[80vh] rounded-[36px] border border-nexus-accent/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col"
            >
              {/* Header */}
              <header className="p-6 border-b border-white/5 flex items-center justify-between bg-nexus-accent/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-nexus-accent/20 border border-nexus-accent/30 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-nexus-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">Voice Navigation Command Index</h3>
                    <p className="text-[10px] text-nexus-text-dim font-mono uppercase tracking-wider">MAPPED PHRASES & DIRECT MODULE DISPATCH</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCheatSheetOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all text-nexus-text-dim hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Search filter input */}
              <div className="p-4 border-b border-white/5 bg-black/20">
                <div className="relative">
                  <Search className="w-4 h-4 text-nexus-text-dim absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search voice commands, module names, or keywords..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder:text-nexus-text-dim/60 outline-none focus:border-nexus-accent/50"
                  />
                </div>
              </div>

              {/* Mapped Command List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCommands.map((mapping) => (
                    <div 
                      key={mapping.moduleId}
                      className="glass p-4 rounded-2xl border border-white/5 hover:border-nexus-accent/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-white uppercase tracking-wide">{mapping.name}</span>
                          <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-nexus-accent uppercase">
                            {mapping.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-nexus-text-dim leading-relaxed mb-3">{mapping.description}</p>
                        
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono uppercase text-nexus-accent tracking-widest block">Sample Voice Phrases:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {mapping.samplePhrases.map((phrase, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => {
                                  setIsCheatSheetOpen(false);
                                  setTranscript(phrase);
                                  parseAndExecuteVoiceCommand(phrase);
                                }}
                                className="text-[10px] font-mono bg-white/5 hover:bg-nexus-accent hover:text-black border border-white/5 px-2 py-1 rounded-lg text-nexus-text-dim transition-all text-left"
                              >
                                🎙 "{phrase}"
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-nexus-text-dim">ID: {mapping.moduleId}</span>
                        <button
                          onClick={() => {
                            setIsCheatSheetOpen(false);
                            triggerNavigation(mapping.moduleId, mapping.name);
                          }}
                          className="text-[10px] font-mono text-nexus-accent hover:underline flex items-center gap-1 uppercase"
                        >
                          Navigate Now <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AIAssistant;
