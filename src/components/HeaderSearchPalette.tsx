import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  X, 
  CornerDownLeft, 
  FileText, 
  LayoutDashboard, 
  Cpu, 
  Share2, 
  TrendingUp, 
  Navigation, 
  BookOpen, 
  Cloud, 
  Mail, 
  BarChart3, 
  Eye, 
  User, 
  Inbox, 
  Shield, 
  Users, 
  Newspaper, 
  Wand2, 
  Network, 
  FileSpreadsheet, 
  Settings, 
  Compass, 
  Sparkles, 
  MessageSquare, 
  ShoppingBag, 
  Radio, 
  Flame, 
  ExternalLink 
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Module } from "@/src/types";
import { spatialAudio } from "./ar/SpatialAudioSynth";

interface HeaderSearchPaletteProps {
  onNavigate: (module: Module) => void;
  onOpenTour: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "MODULE" | "BLOGPOST" | "ACTION" | "COMM";
  icon: any;
  badge?: string;
  action: () => void;
}

export const HeaderSearchPalette: React.FC<HeaderSearchPaletteProps> = ({
  onNavigate,
  onOpenTour
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsOpen(true);
        spatialAudio.playScanSweep();
      } else if (e.key === "Escape") {
        if (isOpen || document.activeElement === inputRef.current) {
          inputRef.current?.blur();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Search Items Index
  const items: SearchItem[] = [
    // 1. Content Blogpost entries
    {
      id: "blog-home",
      title: "Content Blogposts Studio",
      subtitle: "Author, edit, and syndicate AI-optimized blog posts",
      category: "BLOGPOST",
      icon: FileText,
      badge: "STUDIO",
      action: () => {
        onNavigate(Module.BLOGPOSTS);
      }
    },
    {
      id: "blog-openssf",
      title: "OpenSSF Level 3 & SLSA Security Assurance",
      subtitle: "Supply chain integrity, SBOM, and ProGuard R8 protection",
      category: "BLOGPOST",
      icon: Shield,
      badge: "SECURITY",
      action: () => {
        onNavigate(Module.BLOGPOSTS);
        window.dispatchEvent(new CustomEvent("nexus-open-blog", { detail: "openssf-level-3-slsa-security-assurance" }));
      }
    },
    {
      id: "blog-spatial",
      title: "The Spatial Computing Renaissance",
      subtitle: "64-Beam LiDAR, WebXR 3.0, and volumetric streaming guide",
      category: "BLOGPOST",
      icon: Eye,
      badge: "WEBXR",
      action: () => {
        onNavigate(Module.BLOGPOSTS);
        window.dispatchEvent(new CustomEvent("nexus-open-blog", { detail: "spatial-computing-renaissance-lidar-webxr" }));
      }
    },
    {
      id: "blog-showbiz",
      title: "Showbiz 2026: Decentralized Royalty Smart Contracts",
      subtitle: "Automated micro-escrow disbursement for entertainment creators",
      category: "BLOGPOST",
      icon: Flame,
      badge: "SHOWBIZ",
      action: () => {
        onNavigate(Module.BLOGPOSTS);
        window.dispatchEvent(new CustomEvent("nexus-open-blog", { detail: "showbiz-decentralized-royalties-hollywood" }));
      }
    },
    {
      id: "blog-swarms",
      title: "Autonomous Multi-Agent Swarms in Creative Studios",
      subtitle: "Orchestrating scriptwriters, 8K shaders, and auto-dispatchers",
      category: "BLOGPOST",
      icon: Sparkles,
      badge: "AI SWARM",
      action: () => {
        onNavigate(Module.BLOGPOSTS);
        window.dispatchEvent(new CustomEvent("nexus-open-blog", { detail: "autonomous-multi-agent-swarms-creative-studio" }));
      }
    },
    {
      id: "blog-prompts",
      title: "10 Proven AI Prompting Paradigms for Brand Sponsorships",
      subtitle: "Cognitive resonance formulas to secure 45%+ reply rates",
      category: "BLOGPOST",
      icon: FileText,
      badge: "GUIDE",
      action: () => {
        onNavigate(Module.BLOGPOSTS);
        window.dispatchEvent(new CustomEvent("nexus-open-blog", { detail: "ai-prompting-paradigms-cold-email-sponsors" }));
      }
    },

    // 2. Core Modules
    {
      id: "mod-dashboard",
      title: "Command Center Dashboard",
      subtitle: "High-level neural telemetry and system operations",
      category: "MODULE",
      icon: LayoutDashboard,
      action: () => onNavigate(Module.DASHBOARD)
    },
    {
      id: "mod-content-hub",
      title: "Nexus Content Matrix",
      subtitle: "Multimodal 4K video, 8K image, book, and code generators",
      category: "MODULE",
      icon: Newspaper,
      badge: "MULTIMODAL",
      action: () => onNavigate(Module.CONTENT_HUB)
    },
    {
      id: "mod-collab-chat",
      title: "Nexus Comms & Chatroom Matrix",
      subtitle: "Multi-channel team chats, AI ghostwriter, and voice channels",
      category: "COMM",
      icon: MessageSquare,
      badge: "COMMS",
      action: () => onNavigate(Module.COLLABORATION)
    },
    {
      id: "mod-collab-market",
      title: "Creator Marketplace & Smart Escrows",
      subtitle: "Gig bounties, 3D shader assets, and automated ratecards",
      category: "MODULE",
      icon: ShoppingBag,
      badge: "ESCROW",
      action: () => onNavigate(Module.COLLABORATION)
    },
    {
      id: "mod-ai-engine",
      title: "Unified AI Engine",
      subtitle: "Multi-model reasoning, parameter tuning, and code intelligence",
      category: "MODULE",
      icon: Cpu,
      action: () => onNavigate(Module.AI_ENGINE)
    },
    {
      id: "mod-marketing",
      title: "Marketing Suite",
      subtitle: "Campaign orchestration, audience growth, and funnel analytics",
      category: "MODULE",
      icon: TrendingUp,
      action: () => onNavigate(Module.MARKETING)
    },
    {
      id: "mod-social",
      title: "Social Control Matrix",
      subtitle: "Omni-channel broadcasting, sentiment feeds, and scheduling",
      category: "MODULE",
      icon: Share2,
      action: () => onNavigate(Module.SOCIAL)
    },
    {
      id: "mod-ar",
      title: "AR Interface & LiDAR Canvas",
      subtitle: "1,400+ point-cloud particles, 6DoF HUD, and spatial audio",
      category: "MODULE",
      icon: Eye,
      action: () => onNavigate(Module.AR_VIEW)
    },
    {
      id: "mod-sheets",
      title: "Google Sheets Data Hub",
      subtitle: "Direct spreadsheet sync, formula generators, and data grids",
      category: "MODULE",
      icon: FileSpreadsheet,
      action: () => onNavigate(Module.SHEETS)
    },
    {
      id: "mod-mail",
      title: "Smart Mail Hub & Communications",
      subtitle: "AI email assistant, thread summarizer, and cold outreach",
      category: "MODULE",
      icon: Mail,
      action: () => onNavigate(Module.COMMUNICATION)
    },
    {
      id: "mod-sales",
      title: "Sales Intelligence",
      subtitle: "Predictive pipelines, deal probability, and revenue forecasting",
      category: "MODULE",
      icon: BarChart3,
      action: () => onNavigate(Module.SALES)
    },
    {
      id: "mod-cloud",
      title: "Cloud Parameters & Security",
      subtitle: "Infrastructure tokens, TLS certs, and container topology",
      category: "MODULE",
      icon: Shield,
      action: () => onNavigate(Module.CLOUD_CONFIG)
    },
    {
      id: "mod-builder",
      title: "Instant Builder Studio",
      subtitle: "Rapid component assembly, live preview, and code export",
      category: "MODULE",
      icon: BookOpen,
      action: () => onNavigate(Module.CREATOR)
    },
    {
      id: "mod-deployment",
      title: "Deployment Hub",
      subtitle: "Continuous integration, edge routes, and production builds",
      category: "MODULE",
      icon: Cloud,
      action: () => onNavigate(Module.DEPLOYMENT)
    },
    {
      id: "mod-navigation",
      title: "Navigation System",
      subtitle: "Atmospheric radar, route planning, and spatial coordinates",
      category: "MODULE",
      icon: Navigation,
      action: () => onNavigate(Module.NAVIGATION)
    },
    {
      id: "mod-settings",
      title: "System Settings",
      subtitle: "Preferences, appearance, security keys, and neural profiles",
      category: "MODULE",
      icon: Settings,
      action: () => onNavigate(Module.SETTINGS)
    },

    // 3. Fast Actions
    {
      id: "act-new-blog",
      title: "Create New BlogPost Entry",
      subtitle: "Open the editor to compose and publish a new article",
      category: "ACTION",
      icon: FileText,
      badge: "ACTION",
      action: () => {
        onNavigate(Module.BLOGPOSTS);
      }
    },
    {
      id: "act-system-tour",
      title: "Launch Interactive System Tour",
      subtitle: "Explore all 19 command hubs with guided neural prompts",
      category: "ACTION",
      icon: Compass,
      badge: "TOUR",
      action: () => onOpenTour()
    },
    {
      id: "act-voice-hud",
      title: "Open Voice Telemetry HUD",
      subtitle: "View microphone telemetry, acoustic waveforms, and log",
      category: "ACTION",
      icon: Radio,
      badge: "ALT+V",
      action: () => {
        window.dispatchEvent(new CustomEvent("nexus-open-voice-history"));
      }
    }
  ];

  const filteredItems = items.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  const handleSelectItem = (item: SearchItem) => {
    spatialAudio.playTargetLock();
    item.action();
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl">
      {/* Input Field Container */}
      <div 
        className={cn(
          "flex items-center gap-3 px-3.5 py-2 rounded-xl transition-all duration-300 border bg-white/[0.03]",
          isOpen 
            ? "border-cyan-400 bg-black/80 shadow-[0_0_20px_rgba(0,242,255,0.2)]" 
            : "border-white/10 hover:border-white/20"
        )}
      >
        <Search className={cn("w-4 h-4 shrink-0 transition-colors", isOpen ? "text-cyan-400" : "text-nexus-text-dim")} />
        
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onFocus={() => {
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search neural network..." 
          className="bg-transparent border-none outline-none text-xs sm:text-sm w-full placeholder:text-nexus-text-dim text-white font-mono"
        />

        {query && (
          <button 
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="text-nexus-text-dim hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Global Keyboard Shortcut Pill Badge */}
        <kbd 
          onClick={() => {
            inputRef.current?.focus();
            setIsOpen(true);
          }}
          className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300/90 bg-cyan-500/10 border border-cyan-500/30 rounded shadow-xs select-none cursor-pointer hover:bg-cyan-500/20 transition-colors"
          title={`Press ${isMac ? "Cmd+K" : "Ctrl+K"} to search`}
        >
          <span>{isMac ? "⌘" : "Ctrl+"}</span>K
        </kbd>
      </div>

      {/* Floating Fast Navigation Palette Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-[#090f1d] border border-cyan-500/40 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] z-50 overflow-hidden flex flex-col max-h-[480px]"
          >
            {/* Palette Header */}
            <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/40 text-[11px] font-mono text-nexus-text-dim">
              <span>NEURAL NAVIGATION INDEX</span>
              <span className="flex items-center gap-1.5 text-nexus-accent">
                <span>{filteredItems.length} destinations</span>
                <span>•</span>
                <span>↑↓ Navigate</span>
                <span>•</span>
                <span>↵ Enter</span>
              </span>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-nexus-text-dim">
                  <Cpu className="w-8 h-8 text-cyan-400/40 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs font-mono">No neural nodes matching "{query}"</p>
                  <p className="text-[10px] text-gray-500 mt-1">Try searching "blog", "comms", "market", "ar", or "ai"</p>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left transition-all font-mono",
                        isSelected 
                          ? "bg-cyan-500/15 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,242,255,0.15)] text-white" 
                          : "hover:bg-white/5 border border-transparent text-nexus-text-dim hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all",
                          isSelected 
                            ? "bg-cyan-400 text-black border-cyan-300" 
                            : "bg-white/5 text-cyan-400 border-white/10"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-bold truncate", isSelected ? "text-cyan-200" : "text-white")}>
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className={cn(
                                "text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0",
                                item.category === "BLOGPOST"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : isSelected
                                    ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40"
                                    : "bg-white/10 text-gray-400"
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-nexus-text-dim truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2 pl-2">
                        {isSelected && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                            <CornerDownLeft className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Filter Footer */}
            <div className="p-2 border-t border-white/10 bg-black/60 flex items-center justify-between text-[10px] font-mono text-nexus-text-dim px-3">
              <div className="flex items-center gap-2">
                <span>Quick:</span>
                <button 
                  onClick={() => { setQuery("blog"); inputRef.current?.focus(); }}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-300"
                >
                  #blog
                </button>
                <button 
                  onClick={() => { setQuery("comms"); inputRef.current?.focus(); }}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-300"
                >
                  #comms
                </button>
                <button 
                  onClick={() => { setQuery("market"); inputRef.current?.focus(); }}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-cyan-300"
                >
                  #market
                </button>
              </div>
              <span>Esc to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
