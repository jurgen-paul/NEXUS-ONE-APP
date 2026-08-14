import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Share2, 
  TrendingUp, 
  Calendar, 
  CheckSquare, 
  Layout, 
  Settings2, 
  Plus, 
  X, 
  BarChart3,
  Users,
  MessageSquare,
  Clock,
  ArrowUpRight,
  Zap,
  LayoutDashboard,
  Globe,
  Activity,
  Cpu,
  Terminal,
  List,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldAlert,
  Inbox,
  Shield,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  Thermometer,
  Wind,
  Laptop,
  Smartphone,
  Tablet,
  Trash2,
  FileText,
  RefreshCw,
  Link2,
  CheckCircle2,
  Edit3,
  FileSpreadsheet
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from "date-fns";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface Widget {
  id: string;
  type: string;
  title: string;
  isVisible: boolean;
  order: number;
  moduleId?: string; // For pinned modules
}

interface Task {
  id: number;
  task: string;
  priority: "HIGH" | "MED" | "LOW";
  completed: boolean;
}

const PINNABLE_MODULES = [
  { id: "SOCIAL", name: "Social Control", icon: Share2, metric: "Reach: 2.4M", trend: "+12%" },
  { id: "MARKETING", name: "Marketing Suite", icon: Zap, metric: "ROI: 4.2x", trend: "+5%" },
  { id: "SALES", name: "Sales Intelligence", icon: BarChart3, metric: "Pipeline: $1.2M", trend: "+18%" },
  { id: "AI_ENGINE", name: "AI Engine", icon: Cpu, metric: "Ops: 12k/s", trend: "Optimal" },
  { id: "SMART_INBOX", name: "Smart Inbox", icon: Inbox, metric: "Unread: 12", trend: "High Priority" },
  { id: "CLOUD_CONFIG", name: "Cloud Config", icon: Shield, metric: "Params: 4", trend: "Secure" },
  { id: "SHEETS", name: "Google Sheets", icon: FileSpreadsheet, metric: "Sync: Live v4", trend: "Google API" },
  { id: "CREATOR", name: "Insta-Builder", icon: Layout, metric: "Drafts: 8", trend: "Active" },
];

const DEFAULT_WIDGETS: Widget[] = [
  { id: "stats", type: "stats", title: "Core Metrics", isVisible: true, order: 0 },
  { id: "diagnostics", type: "diagnostics", title: "Neural Diagnostics", isVisible: true, order: 1 },
  { id: "social", type: "social", title: "Social Engagement", isVisible: true, order: 2 },
  { id: "sales", type: "sales", title: "Sales Pipeline", isVisible: true, order: 3 },
  { id: "appointments", type: "appointments", title: "Upcoming Appointments", isVisible: true, order: 4 },
  { id: "tasks", type: "tasks", title: "Task Reminders", isVisible: true, order: 5 },
  { id: "weather", type: "weather", title: "Atmospheric Forecast", isVisible: true, order: 6 },
  { id: "pin_social", type: "pinned_module", title: "Social Control", isVisible: false, order: 7, moduleId: "SOCIAL" },
];

const DEFAULT_TASKS: Task[] = [
  { id: 1, task: "Update Neural Security Protocols", priority: "HIGH", completed: false },
  { id: 2, task: "Sync Social Matrix for Q3", priority: "MED", completed: false },
  { id: 3, task: "Review Sales Intelligence Report", priority: "LOW", completed: false },
  { id: 4, task: "Calibrate AI Core Variance", priority: "HIGH", completed: false },
];

const DEFAULT_WEATHER_CONFIG = { city: "NEO-TOKYO", unit: "C" };

const WEATHER_DATA: Record<string, { tempC: number, condition: string, humidity: string, wind: string, pressure: string, forecast: { day: string, tempC: number, condition: string }[] }> = {
  "NEO-TOKYO": {
    tempC: 24,
    condition: "Neon Mist",
    humidity: "82%",
    wind: "12 km/h",
    pressure: "1014 hPa",
    forecast: [
      { day: "Tomorrow", tempC: 22, condition: "Acid Rain" },
      { day: "Day 2", tempC: 25, condition: "Overcast" },
      { day: "Day 3", tempC: 26, condition: "Clear Sky" }
    ]
  },
  "NEXUS PRIME": {
    tempC: 42,
    condition: "Solar Flare",
    humidity: "15%",
    wind: "8 km/h",
    pressure: "1008 hPa",
    forecast: [
      { day: "Tomorrow", tempC: 45, condition: "Extreme Heat" },
      { day: "Day 2", tempC: 41, condition: "Dust Storm" },
      { day: "Day 3", tempC: 38, condition: "Clear Sky" }
    ]
  },
  "SAN FRANCISCO": {
    tempC: 14,
    condition: "Coastal Fog",
    humidity: "90%",
    wind: "18 km/h",
    pressure: "1018 hPa",
    forecast: [
      { day: "Tomorrow", tempC: 15, condition: "Overcast" },
      { day: "Day 2", tempC: 13, condition: "Drizzle" },
      { day: "Day 3", tempC: 16, condition: "Partly Cloudy" }
    ]
  },
  "CHRONOS ORBIT": {
    tempC: -3,
    condition: "Cosmic Dust",
    humidity: "0%",
    wind: "0 km/h",
    pressure: "0 hPa",
    forecast: [
      { day: "Tomorrow", tempC: -5, condition: "Solar Winds" },
      { day: "Day 2", tempC: -2, condition: "Meteor Dust" },
      { day: "Day 3", tempC: -4, condition: "Cosmic Dust" }
    ]
  }
};

const STORAGE_KEY = "nexus_dashboard_widgets";
const PROFILE_KEY = "nexus_sync_profile_id";

export const CustomDashboard = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [latency, setLatency] = useState<number[]>([]);
  const [deviceType, setDeviceType] = useState<"Desktop" | "Tablet" | "Mobile">("Desktop");

  // Sync Profile States
  const [syncProfileId, setSyncProfileId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(PROFILE_KEY) || "default-commander";
    }
    return "default-commander";
  });
  const [tempProfileInput, setTempProfileInput] = useState("");
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline" | "loading">("loading");

  // Core App states that sync to Firestore
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [weatherConfig, setWeatherConfig] = useState(DEFAULT_WEATHER_CONFIG);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);

  // Platform layout detection
  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth < 768) setDeviceType("Mobile");
      else if (window.innerWidth < 1024) setDeviceType("Tablet");
      else setDeviceType("Desktop");
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Mean latency fiber simulation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).renderCount = ((window as any).renderCount || 0) + 1;
      setRenderCount((window as any).renderCount);
    }
    const interval = setInterval(() => {
      setLatency(prev => {
        const next = [...prev, Math.random() * 50 + 10].slice(-20);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Subscribe to Cloud Sync Profile in Firestore
  useEffect(() => {
    setSyncStatus("loading");
    const docRef = doc(db, "nexus_profiles", syncProfileId);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          // Prevent feedback loop by checking deep structural equality
          setWidgets(prev => {
            if (data.widgets && JSON.stringify(prev) !== JSON.stringify(data.widgets)) {
              return data.widgets;
            }
            return prev;
          });
          setTasks(prev => {
            if (data.tasks && JSON.stringify(prev) !== JSON.stringify(data.tasks)) {
              return data.tasks;
            }
            return prev;
          });
          setWeatherConfig(prev => {
            if (data.weatherConfig && JSON.stringify(prev) !== JSON.stringify(data.weatherConfig)) {
              return data.weatherConfig;
            }
            return prev;
          });
          setNotes(prev => {
            if (data.notes && JSON.stringify(prev) !== JSON.stringify(data.notes)) {
              return data.notes;
            }
            return prev;
          });
          setSyncStatus("synced");
        }
      } else {
        // Document doesn't exist yet, initialize it with local values
        setDoc(docRef, {
          widgets: DEFAULT_WIDGETS,
          tasks: DEFAULT_TASKS,
          weatherConfig: DEFAULT_WEATHER_CONFIG,
          notes: {},
          updatedAt: new Date().toISOString()
        }).then(() => {
          setSyncStatus("synced");
        }).catch(err => {
          console.error("Firestore init error:", err);
          setSyncStatus("offline");
        });
      }
    }, (err) => {
      console.error("Firestore live sync error:", err);
      setSyncStatus("offline");
    });

    localStorage.setItem(PROFILE_KEY, syncProfileId);
    return () => unsubscribe();
  }, [syncProfileId]);

  // 2. Local State modifications auto-commit back to Cloud (Debounced)
  useEffect(() => {
    if (syncStatus === "loading") return;

    const timer = setTimeout(() => {
      setSyncStatus("saving");
      const docRef = doc(db, "nexus_profiles", syncProfileId);
      setDoc(docRef, {
        widgets,
        tasks,
        weatherConfig,
        notes,
        updatedAt: new Date().toISOString()
      })
      .then(() => setSyncStatus("synced"))
      .catch((err) => {
        console.error("Firestore write failure:", err);
        setSyncStatus("offline");
      });
    }, 400); // 400ms debounce to aggregate high-frequency UI updates

    return () => clearTimeout(timer);
  }, [widgets, tasks, weatherConfig, notes, syncProfileId]);

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isVisible: !w.isVisible } : w));
  };

  const addPinnedModule = (module: typeof PINNABLE_MODULES[0]) => {
    const id = `pin_${module.id.toLowerCase()}`;
    if (widgets.find(w => w.id === id)) {
      toggleWidget(id);
      return;
    }
    const newWidget: Widget = {
      id,
      type: "pinned_module",
      title: module.name,
      isVisible: true,
      order: widgets.length,
      moduleId: module.id
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const addNewWidget = (type: string) => {
    const id = `widget_${type}_${Date.now()}`;
    let title = "Custom Module";
    if (type === "weather") title = "Atmospheric Forecast";
    else if (type === "custom_note") title = "Neural Memo";
    else if (type === "tasks") title = "Priority Tasks";
    else if (type === "sales") title = "Pipeline Velocity";
    else if (type === "social") title = "Social Sentiment";
    else if (type === "diagnostics") title = "Neural Diagnostics";
    else if (type === "stats") title = "Core Metrics";

    const newWidget: Widget = {
      id,
      type,
      title,
      isVisible: true,
      order: widgets.length,
    };
    setWidgets(prev => [...prev, newWidget]);
    setIsAddWidgetModalOpen(false);
  };

  const removeWidgetCompletely = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const sorted = [...widgets].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(w => w.id === id);
    if (direction === 'up' && index > 0) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index - 1].order;
      sorted[index - 1].order = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index + 1].order;
      sorted[index + 1].order = temp;
    }
    setWidgets([...sorted]);
  };

  const visibleWidgets = widgets
    .filter(w => w.isVisible)
    .sort((a, b) => a.order - b.order);

  const switchProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempProfileInput.trim()) {
      setSyncProfileId(tempProfileInput.trim());
      setIsSyncModalOpen(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Synchronization Bar & Device Diagnostics */}
      <div className="glass p-4 rounded-2xl border border-nexus-accent/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-nexus-accent/10 flex items-center justify-center animate-pulse">
            <Link2 className="w-5 h-5 text-nexus-accent" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">NEXUS LINK SYNCHRONIZATION</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-mono text-nexus-text-dim">PROFILE KEY:</span>
              <span className="text-[10px] font-mono text-nexus-accent font-bold uppercase">{syncProfileId}</span>
              <button 
                onClick={() => {
                  setTempProfileInput(syncProfileId);
                  setIsSyncModalOpen(true);
                }}
                className="text-[9px] font-bold text-cyan-400 hover:underline ml-2 uppercase font-mono"
              >
                [Change Profile]
              </button>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] text-nexus-text-dim uppercase font-mono tracking-widest">ACTIVE HARDWARE</p>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              {deviceType === "Desktop" && <Laptop className="w-3.5 h-3.5 text-white" />}
              {deviceType === "Tablet" && <Tablet className="w-3.5 h-3.5 text-white" />}
              {deviceType === "Mobile" && <Smartphone className="w-3.5 h-3.5 text-white" />}
              <span className="text-xs font-mono font-bold text-white uppercase">[{deviceType}]</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="text-right">
            <p className="text-[8px] text-nexus-text-dim uppercase font-mono tracking-widest">CLOUD CONNECTION</p>
            <div className="flex items-center gap-2 justify-end mt-1">
              {syncStatus === "loading" && (
                <>
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-yellow-500 uppercase">CALIBRATING...</span>
                </>
              )}
              {syncStatus === "saving" && (
                <>
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase">COMMITTING SEEDS...</span>
                </>
              )}
              {syncStatus === "synced" && (
                <>
                  <div className="w-2 h-2 rounded-full bg-nexus-accent shadow-[0_0_8px_rgba(5,255,161,0.5)]" />
                  <span className="text-[10px] font-mono font-bold text-nexus-accent uppercase">CLOUD SYNCED</span>
                </>
              )}
              {syncStatus === "offline" && (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase">OFFLINE MODE</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <header className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight neon-text uppercase">NEXUS COMMAND</h1>
          <p className="text-nexus-text-dim mt-2 tracking-widest text-[10px] uppercase font-mono">
            Neural Desktop Interface <span className="text-nexus-accent ml-2">// OS_v.4.2</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddWidgetModalOpen(true)}
            className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-nexus-accent/15 transition-all text-xs font-bold uppercase tracking-wider group text-nexus-accent"
          >
            <Plus className="w-4 h-4 text-nexus-accent" />
            Add Widget
          </button>
          <button 
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={cn(
              "px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-xs font-bold uppercase tracking-wider group border",
              isCustomizing 
                ? "bg-nexus-accent text-black border-nexus-accent hover:bg-white" 
                : "glass border-white/5 hover:bg-white/5 text-white"
            )}
          >
            <Settings2 className={cn("w-4 h-4 group-hover:rotate-90 transition-transform", isCustomizing ? "text-black" : "text-nexus-accent")} />
            {isCustomizing ? "Lock Calibration" : "Calibrate Layout"}
          </button>
        </div>
      </header>

      {/* Grid of Dynamic Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleWidgets.map((widget) => (
            <motion.div
              key={widget.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className={cn(
                "glass rounded-3xl overflow-hidden flex flex-col relative min-h-[250px] group",
                widget.type === "stats" ? "md:col-span-2 lg:col-span-3 min-h-[140px]" : "",
                isCustomizing ? "ring-2 ring-nexus-accent/30 bg-nexus-accent/5 cursor-move" : ""
              )}
            >
              {/* Calibration Control Overlay on top of widget */}
              {isCustomizing && (
                <div className="absolute inset-x-0 top-0 bg-nexus-bg/95 border-b border-nexus-accent/30 p-3 flex items-center justify-between z-50 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-3.5 h-3.5 text-nexus-accent" />
                    <input
                      type="text"
                      value={widget.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setWidgets(prev => prev.map(w => w.id === widget.id ? { ...w, title: newTitle } : w));
                      }}
                      className="bg-white/10 border border-white/10 rounded px-2 py-0.5 text-xs font-bold text-white focus:border-nexus-accent/50 outline-none w-36 font-display"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => moveWidget(widget.id, 'up')}
                      className="p-1 hover:text-nexus-accent text-nexus-text-dim transition-colors"
                      title="Move Up/Left"
                    >
                      <ChevronLeft className="w-4 h-4 rotate-90" />
                    </button>
                    <button 
                      onClick={() => moveWidget(widget.id, 'down')}
                      className="p-1 hover:text-nexus-accent text-nexus-text-dim transition-colors"
                      title="Move Down/Right"
                    >
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </button>
                    <button 
                      onClick={() => removeWidgetCompletely(widget.id)}
                      className="p-1 hover:text-red-400 text-nexus-text-dim transition-colors ml-1"
                      title="Remove Widget"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Widget Actual Content */}
              <div className={cn("flex-1 h-full", isCustomizing ? "pt-12 pointer-events-none opacity-50" : "")}>
                {renderWidgetContent(widget, { 
                  renderCount, 
                  latency, 
                  tasks, 
                  setTasks, 
                  weatherConfig, 
                  setWeatherConfig,
                  notes,
                  setNotes
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleWidgets.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 glass rounded-3xl border-dashed border-2 border-white/10">
          <LayoutDashboard className="w-16 h-16 text-nexus-text-dim/20 mb-4" />
          <p className="text-nexus-text-dim font-mono text-sm uppercase">No modules active on primary receptor</p>
          <button 
            onClick={() => setWidgets(DEFAULT_WIDGETS)}
            className="mt-6 px-6 py-2 bg-nexus-accent text-black font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(5,255,161,0.3)] font-mono text-xs"
          >
            RESTORE COMMAND INTERFACE
          </button>
        </div>
      )}

      {/* Sync Profile Switcher Modal */}
      <AnimatePresence>
        {isSyncModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass max-w-md w-full rounded-3xl overflow-hidden border border-nexus-accent/30 shadow-[0_0_50px_rgba(5,255,161,0.15)]"
            >
              <header className="p-6 border-b border-white/5 flex items-center justify-between bg-nexus-accent/5">
                <div className="flex items-center gap-3">
                  <Link2 className="w-5 h-5 text-nexus-accent" />
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight text-white">Device Synchronization</h3>
                </div>
                <button 
                  onClick={() => setIsSyncModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-nexus-text-dim" />
                </button>
              </header>

              <form onSubmit={switchProfile} className="p-6 space-y-4">
                <p className="text-xs text-nexus-text-dim font-mono uppercase tracking-widest leading-relaxed">
                  Enter an existing Profile Passkey to pull down preferences, tasks, weather configurations, and customized layouts instantly. Any modifications will instantly stream back to the cloud.
                </p>

                <div className="space-y-2">
                  <label className="text-[9px] text-nexus-accent uppercase tracking-widest font-mono">Sync Profile Key</label>
                  <input 
                    type="text" 
                    value={tempProfileInput}
                    onChange={(e) => setTempProfileInput(e.target.value)}
                    placeholder="e.g. commander-alpha"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-mono text-white outline-none focus:border-nexus-accent/50 transition-colors uppercase"
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsSyncModalOpen(false)}
                    className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs font-bold uppercase text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-nexus-accent text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(5,255,161,0.4)] transition-all font-mono text-xs uppercase"
                  >
                    Sync Device
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Widget Catalog Modal */}
      <AnimatePresence>
        {isAddWidgetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass max-w-2xl w-full rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <header className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5 text-nexus-accent" />
                  <h3 className="text-lg font-display font-bold uppercase tracking-tight">Widget Repository</h3>
                </div>
                <button 
                  onClick={() => setIsAddWidgetModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-nexus-text-dim" />
                </button>
              </header>

              <div className="p-6 space-y-6">
                <div>
                  <p className="text-[10px] text-nexus-text-dim font-mono uppercase tracking-widest mb-4">Core Neural Modules</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "weather", label: "Atmospheric Forecast", desc: "Interactive weather for futuristic megacities.", icon: Cloud },
                      { type: "custom_note", label: "Neural Memo Pad", desc: "A fast, cloud-synced thought repository.", icon: FileText },
                      { type: "tasks", label: "Priority Tasks", desc: "Dynamic list with priority sorting & sync.", icon: CheckSquare },
                      { type: "stats", label: "Core Stats Dashboard", desc: "System wide latency, load, and engagement.", icon: TrendingUp },
                      { type: "diagnostics", label: "Neural Diagnostics", desc: "Real-time render cycle & fibers monitoring.", icon: Activity },
                      { type: "social", label: "Social Sentiment", desc: "Multi-platform brand engagement stats.", icon: Share2 },
                      { type: "sales", label: "Sales Pipeline Velocity", desc: "Funnels, stage leads, and pipeline revenue.", icon: BarChart3 },
                    ].map((catalogItem) => (
                      <button
                        key={catalogItem.type}
                        onClick={() => addNewWidget(catalogItem.type)}
                        className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 text-left hover:border-nexus-accent/30 hover:bg-nexus-accent/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-nexus-accent/15 group-hover:text-nexus-accent transition-colors">
                          <catalogItem.icon className="w-5 h-5 text-nexus-text-dim group-hover:text-nexus-accent" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-nexus-accent transition-colors">{catalogItem.label}</h4>
                          <p className="text-[10px] text-nexus-text-dim mt-1 font-mono leading-relaxed">{catalogItem.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-nexus-text-dim font-mono uppercase tracking-widest mb-4">Quick Pinned Modules</p>
                  <div className="grid grid-cols-2 gap-3">
                    {PINNABLE_MODULES.map((module) => {
                      const isPinned = widgets.some(w => w.moduleId === module.id && w.isVisible);
                      return (
                        <button
                          key={module.id}
                          onClick={() => {
                            addPinnedModule(module);
                            setIsAddWidgetModalOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all text-left text-xs font-bold",
                            isPinned 
                              ? "bg-nexus-accent/10 border-nexus-accent/30 text-nexus-accent" 
                              : "bg-white/5 border-white/5 text-nexus-text-dim hover:border-white/10 hover:text-white"
                          )}
                        >
                          <module.icon className="w-4 h-4" />
                          <span className="uppercase tracking-tight font-mono text-[9px]">{module.name}</span>
                          {isPinned && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-nexus-accent" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 flex justify-end">
                <button 
                  onClick={() => setIsAddWidgetModalOpen(false)}
                  className="px-6 py-2 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all font-mono text-xs uppercase"
                >
                  Dismiss Library
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getWidgetIcon = (type: string, moduleId?: string) => {
  if (type === "pinned_module" && moduleId) {
    const module = PINNABLE_MODULES.find(m => m.id === moduleId);
    if (module) return <module.icon className="w-5 h-5" />;
  }
  switch (type) {
    case "stats": return <TrendingUp className="w-5 h-5" />;
    case "diagnostics": return <Activity className="w-5 h-5" />;
    case "social": return <Share2 className="w-5 h-5" />;
    case "sales": return <BarChart3 className="w-5 h-5" />;
    case "appointments": return <Calendar className="w-5 h-5" />;
    case "tasks": return <CheckSquare className="w-5 h-5" />;
    case "weather": return <Cloud className="w-5 h-5" />;
    case "custom_note": return <FileText className="w-5 h-5" />;
    default: return <Layout className="w-5 h-5" />;
  }
};

const AppointmentsWidget = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    { id: 1, date: new Date(), time: "09:00", title: "Global Sync", subtitle: "Strategic Ops", icon: Globe },
    { id: 2, date: new Date(), time: "11:30", title: "Product Demo", subtitle: "Nexus V5 Preview", icon: Zap },
    { id: 3, date: new Date(), time: "15:00", title: "Investor Brief", subtitle: "Growth Metrics", icon: TrendingUp },
    { id: 4, date: addDays(new Date(), 1), time: "10:00", title: "Marketing Review", subtitle: "Q3 Campaign", icon: Share2 },
    { id: 5, date: addDays(new Date(), 2), time: "14:00", title: "Security Audit", subtitle: "Nexus Core", icon: ShieldAlert },
  ];

  const renderHeader = () => {
    return (
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Neural Meetings</h3>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "p-1.5 rounded-md transition-all",
              viewMode === 'list' ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
            )}
          >
            <List className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={cn(
              "p-1.5 rounded-md transition-all",
              viewMode === 'calendar' ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
            )}
          >
            <LayoutDashboard className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "MMMM yyyy";
    const days = ["S", "M", "T", "W", "T", "F", "S"];

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="p-5 space-y-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono font-bold text-nexus-text-dim uppercase">
            {format(currentMonth, dateFormat)}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:text-nexus-accent transition-colors">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:text-nexus-accent transition-colors">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {days.map((day, i) => (
            <div key={i} className="text-[9px] font-mono text-nexus-text-dim/50 font-bold">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const hasAppointment = appointments.some(a => isSameDay(a.date, day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);

            return (
              <div 
                key={i} 
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "relative aspect-square flex items-center justify-center text-[10px] rounded-lg cursor-pointer transition-all border",
                  !isCurrentMonth ? "opacity-20 pointer-events-none" : "hover:bg-white/5",
                  isToday ? "border-nexus-accent/50 text-nexus-accent" : "border-transparent",
                  isSelected ? "bg-nexus-accent text-black font-bold" : "text-white/60"
                )}
              >
                {format(day, "d")}
                {hasAppointment && (
                  <div className={cn(
                    "absolute bottom-1 w-1 h-1 rounded-full",
                    isSelected ? "bg-black" : "bg-nexus-accent"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2">
          <p className="text-[9px] font-mono text-nexus-text-dim uppercase">Agenda: {format(selectedDate, "MMM d")}</p>
          <div className="space-y-1">
            {appointments.filter(a => isSameDay(a.date, selectedDate)).length > 0 ? (
              appointments.filter(a => isSameDay(a.date, selectedDate)).map(a => (
                <div key={a.id} className="flex items-center gap-2 text-[10px]">
                  <span className="text-nexus-accent font-mono">{a.time}</span>
                  <span className="text-white/80">{a.title}</span>
                </div>
              ))
            ) : (
              <p className="text-[9px] italic text-nexus-text-dim">No events today</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="p-5 space-y-3 flex-1 overflow-y-auto max-h-[300px]">
        {appointments.map((a, i) => (
          <div key={i} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex flex-col items-center justify-center border-r border-white/5 pr-4">
              <span className="text-[10px] font-bold text-nexus-accent font-mono">{a.time}</span>
              <div className="w-1 h-1 rounded-full bg-nexus-accent mt-1 shadow-[0_0_5px_rgba(5,255,161,1)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold">{a.title}</h4>
                <span className="text-[8px] text-nexus-text-dim uppercase font-mono px-1 border border-white/10 rounded">{format(a.date, "MMM d")}</span>
              </div>
              <p className="text-[10px] text-nexus-text-dim">{a.subtitle}</p>
            </div>
            <a.icon className="w-3 h-3 ml-auto text-nexus-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {renderHeader()}
      {viewMode === 'list' ? renderList() : renderCalendar()}
    </div>
  );
};

const TasksWidget = ({ tasks, setTasks }: { tasks: Task[], setTasks: any }) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"HIGH" | "MED" | "LOW">("HIGH");

  const [completingId, setCompletingId] = useState<number | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "COMPLETED" | "ALL">("PENDING");

  const completeTask = (id: number) => {
    if (completingId) return;
    setCompletingId(id);
    setTimeout(() => {
      setTasks((prev: Task[]) => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
      setCompletingId(null);
    }, 600);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      task: newTaskName.trim(),
      priority: newTaskPriority,
      completed: false
    };
    setTasks((prev: Task[]) => [...prev, newTask]);
    setNewTaskName("");
  };

  const filteredTasks = tasks.filter(t => {
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    const matchesStatus = statusFilter === "ALL" || 
                         (statusFilter === "PENDING" && !t.completed) || 
                         (statusFilter === "COMPLETED" && t.completed);
    return matchesPriority && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="p-5 border-b border-white/5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-nexus-accent" />
            Priority Tasking
          </h3>
          <span className="text-[10px] font-mono text-nexus-text-dim">
            {tasks.filter(t => !t.completed).length} PENDING
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Status Filters */}
          <div className="flex gap-1">
            {["PENDING", "COMPLETED", "ALL"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-mono border transition-all uppercase tracking-tighter",
                  statusFilter === s 
                    ? "bg-nexus-accent/20 border-nexus-accent/50 text-nexus-accent" 
                    : "bg-white/5 border-white/5 text-nexus-text-dim hover:bg-white/10"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Priority Filters */}
          <div className="flex gap-1">
            {["ALL", "HIGH", "MED", "LOW"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-mono border transition-all uppercase tracking-tighter",
                  priorityFilter === p 
                    ? "bg-white/20 border-white/40 text-white" 
                    : "bg-white/5 border-white/5 text-nexus-text-dim hover:bg-white/10"
                )}
              >
                {p === "ALL" ? "ANY PR" : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-2 flex-1 relative overflow-hidden overflow-y-auto no-scrollbar max-h-[220px]">
        <AnimatePresence initial={false} mode="popLayout">
          {filteredTasks.map((t) => (
            <motion.div 
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: completingId === t.id ? 0.5 : 1, 
                scale: completingId === t.id ? 0.98 : 1,
                filter: completingId === t.id ? "blur(2px)" : "blur(0px)",
              }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ duration: 0.3 }}
              onClick={() => completeTask(t.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer relative overflow-hidden group",
                t.completed ? "bg-nexus-accent/5 border border-nexus-accent/10" : "bg-white/5 hover:bg-white/10 border border-white/5",
                completingId === t.id && "pointer-events-none"
              )}
            >
              <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-500",
                  (completingId === t.id || t.completed) ? "scale-0" : "scale-100",
                  t.priority === "HIGH" ? "bg-red-400" : t.priority === "MED" ? "bg-yellow-400" : "bg-blue-400"
                )} />
                <AnimatePresence>
                  {(completingId === t.id || t.completed) && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <CheckSquare className="w-4 h-4 text-nexus-accent" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className={cn(
                "text-xs transition-all duration-500 flex-1 truncate font-display",
                (completingId === t.id || t.completed) ? "text-nexus-accent line-through opacity-50" : "text-white/80 group-hover:text-white"
              )}>
                {t.task}
              </span>
              
              <span className="text-[8px] font-mono text-nexus-text-dim opacity-40">{t.priority}</span>

              {/* Progress Sweep for completion */}
              {completingId === t.id && (
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 bg-nexus-accent/10 pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full py-8 text-center"
          >
            <Zap className="w-8 h-8 text-nexus-accent/20 mb-2 animate-pulse" />
            <p className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-tighter">No tasks match filter</p>
          </motion.div>
        )}
      </div>

      {/* Interactive New Task Add Input Form */}
      <form onSubmit={handleAddTask} className="p-5 border-t border-white/5 flex gap-2">
        <input 
          type="text" 
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="New core protocol..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-nexus-accent/50"
        />
        <select 
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as any)}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[9px] font-mono text-white outline-none focus:border-nexus-accent/50"
        >
          <option value="HIGH" className="bg-nexus-bg text-red-400 font-mono">HIGH</option>
          <option value="MED" className="bg-nexus-bg text-yellow-400 font-mono">MED</option>
          <option value="LOW" className="bg-nexus-bg text-blue-400 font-mono">LOW</option>
        </select>
        <button 
          type="submit"
          className="px-3 bg-nexus-accent text-black rounded-lg text-xs font-bold hover:bg-white transition-colors"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

const WeatherWidget = ({ config, setConfig }: { config: { city: string, unit: string }, setConfig: any }) => {
  const data = WEATHER_DATA[config.city] || WEATHER_DATA["NEO-TOKYO"];
  
  const getTempDisplay = (tempC: number) => {
    if (config.unit === "F") {
      return `${Math.round((tempC * 9/5) + 32)}°F`;
    }
    return `${tempC}°C`;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Neon Mist":
      case "Coastal Fog":
        return <Wind className="w-8 h-8 text-cyan-400" />;
      case "Solar Flare":
      case "Extreme Heat":
      case "Clear Sky":
        return <Sun className="w-8 h-8 text-yellow-400 animate-pulse" />;
      case "Acid Rain":
      case "Drizzle":
        return <CloudRain className="w-8 h-8 text-blue-400 animate-bounce" />;
      case "Dust Storm":
      case "Meteor Dust":
      case "Solar Winds":
        return <Globe className="w-8 h-8 text-purple-400 animate-spin-slow" />;
      default:
        return <Cloud className="w-8 h-8 text-nexus-text-dim" />;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[250px]">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Meteorology Matrix</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* City Selector */}
          <select 
            value={config.city}
            onChange={(e) => setConfig((prev: any) => ({ ...prev, city: e.target.value }))}
            className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-white outline-none focus:border-cyan-500/50"
          >
            {Object.keys(WEATHER_DATA).map(city => (
              <option key={city} value={city} className="bg-nexus-bg text-white font-mono">{city}</option>
            ))}
          </select>
          {/* Unit Toggle */}
          <button 
            type="button"
            onClick={() => setConfig((prev: any) => ({ ...prev, unit: prev.unit === "C" ? "F" : "C" }))}
            className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono hover:text-nexus-accent text-white transition-colors"
          >
            °{config.unit}
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Main Conditions */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-3xl font-display font-extrabold tracking-tight text-white">
              {getTempDisplay(data.tempC)}
            </h4>
            <p className="text-xs text-nexus-accent font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-nexus-accent animate-ping" />
              {data.condition}
            </p>
          </div>
          {getWeatherIcon(data.condition)}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-2 bg-white/5 p-3 rounded-2xl border border-white/5">
          <div className="text-center">
            <p className="text-[8px] text-nexus-text-dim uppercase font-mono">HUMIDITY</p>
            <p className="text-xs font-bold text-white font-mono">{data.humidity}</p>
          </div>
          <div className="text-center border-x border-white/5">
            <p className="text-[8px] text-nexus-text-dim uppercase font-mono">WIND FORCE</p>
            <p className="text-xs font-bold text-white font-mono">{data.wind}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] text-nexus-text-dim uppercase font-mono">BAROMETER</p>
            <p className="text-xs font-bold text-white font-mono">{data.pressure}</p>
          </div>
        </div>

        {/* 3-Day Forecast */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <p className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest">Quantum Predictive Forecast</p>
          <div className="grid grid-cols-3 gap-2">
            {data.forecast.map((f, i) => (
              <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/5 text-center space-y-1">
                <p className="text-[8px] text-nexus-text-dim font-mono">{f.day}</p>
                <div className="flex justify-center">{getWeatherIcon(f.condition)}</div>
                <p className="text-[10px] font-bold text-white font-mono mt-1">{getTempDisplay(f.tempC)}</p>
                <p className="text-[7px] text-nexus-accent uppercase font-mono truncate">{f.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomNoteWidget = ({ 
  widget, 
  notes, 
  setNotes 
}: { 
  widget: Widget, 
  notes: Record<string, string>, 
  setNotes: any 
}) => {
  const content = notes[widget.id] || "";

  return (
    <div className="flex flex-col h-full min-h-[250px]">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-widest">{widget.title}</h3>
        </div>
        <span className="text-[8px] font-mono text-purple-400 border border-purple-500/20 px-1 rounded uppercase">NEURAL MEMO</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <textarea
          value={content}
          onChange={(e) => {
            const val = e.target.value;
            setNotes((prev: any) => ({ ...prev, [widget.id]: val }));
          }}
          placeholder="Sync thoughts across space-time matrix..."
          className="w-full flex-1 bg-transparent border-none outline-none text-xs font-mono text-white/80 placeholder:text-nexus-text-dim/40 resize-none h-full leading-relaxed focus:ring-0"
        />
        <div className="text-[8px] text-nexus-text-dim font-mono text-right mt-2 uppercase">
          AUTO-SYNCING TO CLOUD...
        </div>
      </div>
    </div>
  );
};

const renderWidgetContent = (widget: Widget, extra: any = {}) => {
  const { 
    renderCount, 
    latency, 
    tasks, 
    setTasks, 
    weatherConfig, 
    setWeatherConfig,
    notes,
    setNotes
  } = extra;

  switch (widget.type) {
    case "diagnostics":
      return (
        <>
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-nexus-accent" />
              {widget.title}
            </h3>
            <span className="text-[10px] font-mono text-nexus-accent animate-pulse">MONITORING</span>
          </div>
          <div className="p-5 space-y-4 flex-1 font-mono">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-nexus-text-dim uppercase">Render Cycle</p>
                <p className="text-xl font-bold text-white">{renderCount || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-nexus-text-dim uppercase">Mean Latency</p>
                <p className="text-xl font-bold text-nexus-accent">
                  {latency?.length ? (latency.reduce((a: any, b: any) => a + b, 0) / latency.length).toFixed(2) : 0}ms
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-nexus-text-dim uppercase flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Fiber Pulse
              </p>
              <div className="h-12 flex items-end gap-1 px-1">
                {latency?.map((l: number, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(100, (l / 80) * 100)}%` }}
                    className="flex-1 bg-nexus-accent/30 rounded-t-sm"
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <p className="text-[8px] text-nexus-text-dim uppercase tracking-tighter">Memory Snapshot (Simulated Internals)</p>
              <div className="text-[9px] text-nexus-accent/60 leading-tight">
                <p>$r.memoizedState: OK</p>
                <p>$r.props.user: ACTIVE</p>
                <p>updateQueue.lastEffect: SYNCED</p>
              </div>
            </div>
          </div>
        </>
      );
    case "stats":
      return (
        <div className="p-6">
          <div className="flex items-center gap-2 text-nexus-accent/80 border-b border-white/5 pb-3 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest font-display">{widget.title}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Neural Reach", value: "2.4M", trend: "+14.2%", icon: Users, color: "text-blue-400" },
              { label: "Active Nodes", value: "842", trend: "+2.1%", icon: Zap, color: "text-nexus-accent" },
              { label: "Comm Streams", value: "12.8k", trend: "+34.5%", icon: MessageSquare, color: "text-purple-400" },
              { label: "System Load", value: "24%", trend: "Stable", icon: TrendingUp, color: "text-cyan-400" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-nexus-text-dim">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <h4 className="text-2xl font-display font-bold">{stat.value}</h4>
                  <span className={cn(
                    "text-[10px] font-bold",
                    stat.trend.startsWith("+") ? "text-nexus-accent" : "text-nexus-text-dim"
                  )}>{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "social":
      return (
        <>
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              {widget.title}
            </h3>
            <span className="text-[10px] font-mono text-nexus-accent">LIVE FEED</span>
          </div>
          <div className="p-5 space-y-4 flex-1">
            {[
              { platform: "Instagram", engagement: "84%", trend: "up" },
              { platform: "Twitter / X", engagement: "62%", trend: "down" },
              { platform: "LinkedIn", engagement: "91%", trend: "up" },
            ].map((p, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-nexus-text-dim uppercase font-mono">{p.platform}</span>
                  <span className="font-bold">{p.engagement}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: p.engagement }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      p.trend === "up" ? "bg-nexus-accent" : "bg-red-400"
                    )}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-white/5">
              <p className="text-[9px] text-nexus-text-dim uppercase font-mono leading-relaxed">
                Most performing node: <span className="text-white">PROJECT_ZENITH_TEASER</span> with 42k interactions.
              </p>
            </div>
          </div>
        </>
      );
    case "sales":
      return (
        <>
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              {widget.title}
            </h3>
            <ArrowUpRight className="w-3 h-3 text-nexus-accent" />
          </div>
          <div className="p-5 space-y-3 flex-1">
            {[
              { stage: "Discovery", count: 24, value: "$124k" },
              { stage: "Proposal", count: 12, value: "$450k" },
              { stage: "Negotiation", count: 5, value: "$210k" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-nexus-accent/30 transition-all">
                <div>
                  <p className="text-[10px] text-nexus-text-dim uppercase font-mono">{s.stage}</p>
                  <p className="text-sm font-bold">{s.count} Leads</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-nexus-accent">{s.value}</p>
                  <p className="text-[8px] text-nexus-text-dim underline underline-offset-2">CALCULATE ROI</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    case "appointments":
      return <AppointmentsWidget />;
    case "tasks":
      return <TasksWidget tasks={tasks} setTasks={setTasks} />;
    case "weather":
      return <WeatherWidget config={weatherConfig} setConfig={setWeatherConfig} />;
    case "custom_note":
      return <CustomNoteWidget widget={widget} notes={notes} setNotes={setNotes} />;
    case "pinned_module":
      const moduleInfo = PINNABLE_MODULES.find(m => m.id === widget.moduleId);
      if (!moduleInfo) return null;
      return (
        <div className="p-6 flex flex-col h-full justify-between group cursor-pointer hover:bg-nexus-accent/5 transition-all">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-nexus-accent/10 text-nexus-accent group-hover:scale-110 transition-transform">
              <moduleInfo.icon className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-nexus-text-dim opacity-40 group-hover:text-nexus-accent transition-colors" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-display font-bold text-white mb-1">{moduleInfo.name}</h3>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono text-nexus-accent">{moduleInfo.metric}</p>
              <span className="text-[9px] font-bold text-nexus-text-dim uppercase tracking-tighter">{moduleInfo.trend}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[8px] text-nexus-text-dim uppercase font-mono tracking-widest">Neural Link Active</span>
            <div className="flex gap-0.5">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-nexus-accent/20 rounded-full" />)}
            </div>
          </div>
        </div>
      );
    default:
      return <div className="p-10 text-center text-nexus-text-dim uppercase font-mono text-xs">Module under maintenance</div>;
  }
};
