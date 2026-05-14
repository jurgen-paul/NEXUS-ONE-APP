import { useState, useEffect } from "react";
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
  Users,
  Zap,
  Globe,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  FilePlus,
  Download,
  Eye,
  Inbox,
  Shield,
  Newspaper,
  Wand2,
  Network
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Module } from "@/src/types";

// Module Components
import { AIEngine } from "./components/AIEngine";
import { CustomDashboard } from "./components/CustomDashboard";
import { MarketingSuite } from "./components/MarketingSuite";
import { NavigationSystem } from "./components/NavigationSystem";
import { InstantBuilder } from "./components/InstantBuilder";
import { SocialControl } from "./components/SocialControl";
import { DeploymentHub } from "./components/DeploymentHub";
import { AppSettings } from "./components/AppSettings";
import { SalesIntelligence } from "./components/SalesIntelligence";
import { ARInterface } from "./components/ARInterface";
import { AIAssistant } from "./components/AIAssistant";
import { SmartInbox } from "./components/SmartInbox";
import { CloudConfig } from "./components/CloudConfig";
import { CollaborationHub } from "./components/CollaborationHub";
import { ContentHub } from "./components/ContentHub";
import { SuperAIGenerator } from "./components/SuperAIGenerator";
import { DependencyMap } from "./components/DependencyMap";

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
  useEffect(() => {
    const handleNavigate = (e: any) => {
      if (Object.values(Module).includes(e.detail)) {
        setActiveModule(e.detail as Module);
      }
    };
    window.addEventListener("nexus-navigate", handleNavigate);
    return () => window.removeEventListener("nexus-navigate", handleNavigate);
  }, []);

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
    { id: Module.AR_VIEW, label: "AR Interface", icon: Eye },
    { id: Module.ASSISTANT, label: "Avatar Sync", icon: User },
    { id: Module.SMART_INBOX, label: "Smart Inbox", icon: Inbox },
    { id: Module.CLOUD_CONFIG, label: "Cloud Parameters", icon: Shield },
    { id: Module.COLLABORATION, label: "Collaboration", icon: Users },
    { id: Module.CONTENT_HUB, label: "Content Matrix", icon: Newspaper },
    { id: Module.AI_GENERATOR, label: "Neural Architect", icon: Wand2 },
    { id: Module.DEPENDENCY_MAP, label: "Topology Map", icon: Network },
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
              {activeModule === Module.DASHBOARD && <CustomDashboard />}
              {activeModule === Module.AI_ENGINE && <AIEngine />}
              {activeModule === Module.MARKETING && <MarketingSuite />}
              {activeModule === Module.NAVIGATION && <NavigationSystem />}
              {activeModule === Module.CREATOR && <InstantBuilder />}
              {activeModule === Module.SOCIAL && <SocialControl />}
              {activeModule === Module.DOCS && <SmartDocs />}
              {activeModule === Module.DEPLOYMENT && <DeploymentHub />}
              {activeModule === Module.SALES && <SalesIntelligence />}
              {activeModule === Module.AR_VIEW && <ARInterface />}
              {activeModule === Module.ASSISTANT && <AIAssistant />}
              {activeModule === Module.SMART_INBOX && <SmartInbox />}
              {activeModule === Module.CLOUD_CONFIG && <CloudConfig />}
              {activeModule === Module.COLLABORATION && <CollaborationHub />}
              {activeModule === Module.CONTENT_HUB && <ContentHub />}
              {activeModule === Module.AI_GENERATOR && <SuperAIGenerator />}
              {activeModule === Module.DEPENDENCY_MAP && <DependencyMap />}
              {activeModule === Module.SETTINGS && <AppSettings />}
              
              {![Module.DASHBOARD, Module.AI_ENGINE, Module.MARKETING, Module.NAVIGATION, Module.CREATOR, Module.SOCIAL, Module.DOCS, Module.DEPLOYMENT, Module.SETTINGS, Module.SALES, Module.AR_VIEW, Module.ASSISTANT, Module.SMART_INBOX, Module.CLOUD_CONFIG, Module.COLLABORATION, Module.CONTENT_HUB, Module.AI_GENERATOR, Module.DEPENDENCY_MAP].includes(activeModule) && (
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
