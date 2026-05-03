import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Cpu, 
  Share2, 
  TrendingUp, 
  Navigation, 
  BookOpen, 
  FileText, 
  Mail, 
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  Zap,
  Globe,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  FilePlus,
  Download,
  Eye
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Module } from "@/src/types";

// Module Components
import { AIEngine } from "./components/AIEngine";
import { MarketingSuite } from "./components/MarketingSuite";
import { NavigationSystem } from "./components/NavigationSystem";
import { InstantBuilder } from "./components/InstantBuilder";
import { SocialControl } from "./components/SocialControl";
import { DeploymentHub } from "./components/DeploymentHub";
import { AppSettings } from "./components/AppSettings";
import { SalesIntelligence } from "./components/SalesIntelligence";

const Dashboard = () => (
  <div className="space-y-8 p-8">
    <header className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-display font-extrabold tracking-tight neon-text">NEXUS ONE</h1>
        <p className="text-nexus-text-dim mt-2">System Status: <span className="text-nexus-accent">OPTIMAL</span></p>
      </div>
      <div className="flex gap-4">
        <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
          <Zap className="w-4 h-4 text-nexus-accent" />
          <span className="text-xs font-mono">AI CORE: 98%</span>
        </div>
        <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
          <Globe className="w-4 h-4 text-nexus-accent" />
          <span className="text-xs font-mono">NETWORK: ACTIVE</span>
        </div>
      </div>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { 
          label: "Active Campaigns", 
          value: "12", 
          icon: TrendingUp, 
          color: "text-blue-400",
          tooltip: "Total number of ongoing marketing initiatives currently running in the neural network."
        },
        { 
          label: "Social Reach", 
          value: "1.2M", 
          icon: Share2, 
          color: "text-purple-400",
          tooltip: "Aggregate impressions and interactions across all linked social matrix nodes."
        },
        { 
          label: "AI Tasks Executed", 
          value: "8,432", 
          icon: Cpu, 
          color: "text-cyan-400",
          tooltip: "Total volume of computational operations processed by the NEXUS core in the current cycle."
        },
      ].map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass p-6 rounded-2xl relative overflow-hidden group cursor-help"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <stat.icon className="w-16 h-16" />
          </div>
          <p className="text-nexus-text-dim text-sm font-medium uppercase tracking-wider">{stat.label}</p>
          <h3 className="text-3xl font-display font-bold mt-2">{stat.value}</h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-nexus-accent">
            <TrendingUp className="w-3 h-3" />
            <span>+12.5% from last cycle</span>
          </div>

          {/* Hover Tooltip */}
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-nexus-bg/95 backdrop-blur-md p-6 flex items-center justify-center text-center">
            <p className="text-xs leading-relaxed text-nexus-text-dim">{stat.tooltip}</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-nexus-accent" />
          Neural Activity
        </h3>
        <div className="space-y-4">
          {[
            { text: "Neural optimization for 'Sigma' complete", status: "completed" },
            { text: "Optimizing marketing strategy for 'Project Alpha'", status: "active" },
            { text: "Generating social media assets for Instagram", status: "active" },
            { text: "Market trend synthesis finalized", status: "completed" }
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group">
              <div className="flex-shrink-0">
                {task.status === "completed" ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      delay: i * 0.2 
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 neon-glow-green" />
                  </motion.div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-nexus-accent animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-sm transition-colors",
                task.status === "completed" ? "text-nexus-text-dim/60 line-through decoration-nexus-accent/30" : "text-nexus-text-dim"
              )}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-nexus-accent" />
          Environmental Intelligence
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-display font-bold">24°C</p>
            <p className="text-nexus-text-dim">San Francisco, CA</p>
          </div>
          <div className="text-right">
            <p className="text-nexus-accent font-mono">CLEAR SKIES</p>
            <p className="text-xs text-nexus-text-dim">Visibility: 10km</p>
          </div>
        </div>
        <div className="mt-6 h-24 bg-gradient-to-r from-nexus-accent/10 to-transparent rounded-xl border border-nexus-accent/20 flex items-center justify-center">
          <span className="text-xs font-mono text-nexus-accent/60">GEOSPATIAL DATA STREAM ACTIVE</span>
        </div>
      </div>
    </div>
  </div>
);

const SmartDocs = () => (
  <div className="p-8 space-y-8 max-w-5xl mx-auto">
    <header className="flex justify-between items-start">
      <div>
        <h2 className="text-3xl font-display font-bold">Smart Documents</h2>
        <p className="text-nexus-text-dim mt-1">Automated form and legal document generation.</p>
      </div>
      <button className="px-6 py-2 bg-nexus-accent text-black font-bold rounded-xl flex items-center gap-2 hover:bg-white transition-all">
        <FilePlus className="w-4 h-4" />
        CREATE NEW
      </button>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: "Service Agreement", type: "Legal", date: "2 mins ago" },
        { title: "Onboarding Flow", type: "Business", date: "1 hour ago" },
        { title: "Customer Survey", type: "Marketing", date: "Yesterday" },
      ].map((doc, i) => (
        <div key={i} className="glass p-6 rounded-2xl group hover:border-nexus-accent/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-nexus-accent/10 transition-colors">
            <FileText className="w-6 h-6 text-nexus-text-dim group-hover:text-nexus-accent transition-colors" />
          </div>
          <h4 className="font-bold mb-1">{doc.title}</h4>
          <p className="text-xs text-nexus-text-dim uppercase tracking-widest font-mono">{doc.type}</p>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-[10px] text-nexus-text-dim">{doc.date}</span>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-colors">
                <Cloud className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-nexus-text-dim hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
      active ? "bg-nexus-accent/10 text-nexus-accent" : "text-nexus-text-dim hover:bg-white/5 hover:text-white"
    )}
  >
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="absolute left-0 w-1 h-6 bg-nexus-accent rounded-full"
      />
    )}
    <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active && "neon-glow")} />
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </button>
);

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>(Module.DASHBOARD);
  const [isSidebarOpen] = useState(true);

  const navItems = [
    { id: Module.DASHBOARD, label: "Command Center", icon: LayoutDashboard },
    { id: Module.AI_ENGINE, label: "Unified AI Engine", icon: Cpu },
    { id: Module.SOCIAL, label: "Social Control", icon: Share2 },
    { id: Module.MARKETING, label: "Marketing Suite", icon: TrendingUp },
    { id: Module.NAVIGATION, label: "Navigation Sys", icon: Navigation },
    { id: Module.CREATOR, label: "Instant Builder", icon: BookOpen },
    { id: Module.DEPLOYMENT, label: "Deployment Hub", icon: Cloud },
    { id: Module.DOCS, label: "Smart Forms", icon: FileText },
    { id: Module.COMMUNICATION, label: "Mail Hub", icon: Mail },
    { id: Module.SALES, label: "Sales Intelligence", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen w-full bg-nexus-bg text-white selection:bg-nexus-accent/30 selection:text-nexus-accent scanline">
      {/* Sidebar */}
      <aside 
        className={cn(
          "glass h-full transition-all duration-500 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-nexus-accent flex items-center justify-center neon-glow">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          {isSidebarOpen && (
            <span className="font-display font-bold text-xl tracking-tighter neon-text">NEXUS</span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ""}
              active={activeModule === item.id}
              onClick={() => setActiveModule(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-nexus-border">
          <button 
            onClick={() => setActiveModule(Module.SETTINGS)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
              activeModule === Module.SETTINGS 
                ? "bg-nexus-accent/10 text-nexus-accent" 
                : "text-nexus-text-dim hover:bg-white/5 hover:text-white"
            )}
          >
            <Settings className={cn("w-5 h-5", activeModule === Module.SETTINGS && "neon-glow")} />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
          <div className="mt-4 flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-nexus-accent/20 flex items-center justify-center border border-nexus-accent/30">
              <User className="w-4 h-4 text-nexus-accent" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">COMMANDER</p>
                <p className="text-[10px] text-nexus-text-dim truncate">nexus.one/admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-nexus-border flex items-center justify-between px-8 glass z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <Search className="w-4 h-4 text-nexus-text-dim" />
            <input 
              type="text" 
              placeholder="Search neural network..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-nexus-text-dim"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-mono text-nexus-text-dim">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              ENCRYPTION: AES-256
            </div>
            <button className="relative p-2 text-nexus-text-dim hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-nexus-accent rounded-full neon-glow" />
            </button>
          </div>
        </header>

        {/* Module Content */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {activeModule === Module.DASHBOARD && <Dashboard />}
              {activeModule === Module.AI_ENGINE && <AIEngine />}
              {activeModule === Module.MARKETING && <MarketingSuite />}
              {activeModule === Module.NAVIGATION && <NavigationSystem />}
              {activeModule === Module.CREATOR && <InstantBuilder />}
              {activeModule === Module.SOCIAL && <SocialControl />}
              {activeModule === Module.DOCS && <SmartDocs />}
              {activeModule === Module.DEPLOYMENT && <DeploymentHub />}
              {activeModule === Module.SALES && <SalesIntelligence />}
              {activeModule === Module.SETTINGS && <AppSettings />}
              
              {![Module.DASHBOARD, Module.AI_ENGINE, Module.MARKETING, Module.NAVIGATION, Module.CREATOR, Module.SOCIAL, Module.DOCS, Module.DEPLOYMENT, Module.SETTINGS, Module.SALES].includes(activeModule) && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Cpu className="w-16 h-16 text-nexus-accent/20 mb-6 animate-pulse" />
                  <h2 className="text-2xl font-display font-bold mb-2">Module Initialization</h2>
                  <p className="text-nexus-text-dim max-w-md">
                    The {activeModule.replace("_", " ")} module is currently being calibrated for your neural signature.
                  </p>
                  <button 
                    onClick={() => setActiveModule(Module.DASHBOARD)}
                    className="mt-8 px-6 py-2 bg-nexus-accent text-black font-bold rounded-lg hover:bg-white transition-colors"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nexus-accent/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
        </div>
      </main>
    </div>
  );
}
