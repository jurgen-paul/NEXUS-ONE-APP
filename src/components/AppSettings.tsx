import { useState } from "react";
import { motion } from "motion/react";
import { 
  Settings, 
  User, 
  Shield, 
  Key, 
  Bell, 
  Monitor, 
  Cpu, 
  Globe, 
  Zap,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Cloud,
  Lock,
  Smartphone,
  Search,
  ArrowRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export const AppSettings = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "neural" | "api" | "security">("profile");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allSettings = [
    { id: "alias", label: "Neural Alias", tab: "profile", icon: User },
    { id: "email", label: "Encryption Email", tab: "profile", icon: Globe },
    { id: "rank", label: "System Rank", tab: "profile", icon: Shield },
    { id: "theme", label: "Interface Aesthetics", tab: "neural", icon: Monitor },
    { id: "animations", label: "Animation Dynamics", tab: "neural", icon: Zap },
    { id: "keys", label: "Neural Key Matrix", tab: "api", icon: Key },
    { id: "2fa", label: "Neural Biometrics", tab: "security", icon: Shield },
    { id: "encryption", label: "Zero-Knowledge Encryption", tab: "security", icon: Lock },
    { id: "logging", label: "Quantum Activity Logging", tab: "security", icon: Zap },
  ];

  const filteredSettings = allSettings.filter(s => 
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "profile", label: "Identity", icon: User },
    { id: "neural", label: "Interface", icon: Monitor },
    { id: "api", label: "API Matrix", icon: Key },
    { id: "security", label: "Protocols", icon: Shield },
  ];

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            <Settings className="w-8 h-8 text-nexus-accent" />
            System Control
          </h2>
          <p className="text-nexus-text-dim mt-2">Calibrate your neural interface and global protocols.</p>
        </div>
        <button className="px-6 py-2 bg-nexus-accent text-black font-bold rounded-xl flex items-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(5,255,161,0.2)]">
          <Save className="w-4 h-4" />
          COMMIT CHANGES
        </button>
      </header>

      <div className="flex gap-8">
        {/* Navigation Rail */}
        <aside className="w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                activeTab === tab.id 
                  ? "bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20" 
                  : "text-nexus-text-dim hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id && "animate-pulse")} />
              <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <div className="glass p-8 rounded-3xl min-h-[500px]">
            {activeTab === "profile" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-nexus-accent/10 border-2 border-dashed border-nexus-accent/30 flex items-center justify-center overflow-hidden">
                      <User className="w-12 h-12 text-nexus-accent" />
                      <div className="absolute inset-0 bg-nexus-accent/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <RefreshCw className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-nexus-accent flex items-center justify-center shadow-lg">
                      <Zap className="w-4 h-4 text-black fill-black" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-mono">Neural Alias</label>
                      <input 
                        type="text" 
                        defaultValue="COMMANDER"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-lg font-bold outline-none focus:border-nexus-accent/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-mono">Encryption Email</label>
                      <input 
                        type="email" 
                        defaultValue="commander@nexus.one"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-nexus-accent/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-sm font-bold text-nexus-accent uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Identity Protocol
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-accent/20 transition-all">
                      <p className="text-[10px] text-nexus-text-dim uppercase mb-1">Rank</p>
                      <p className="text-sm font-bold text-white">System Architect / Lead</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-nexus-accent/20 transition-all">
                      <p className="text-[10px] text-nexus-text-dim uppercase mb-1">Access Level</p>
                      <p className="text-sm font-bold text-nexus-accent">ULTRA-VIOLET</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "neural" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Global Search Interface */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className={cn(
                      "w-4 h-4 transition-colors duration-300",
                      searchQuery ? "text-nexus-accent" : "text-nexus-text-dim"
                    )} />
                  </div>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="QUERY NEURAL CONFIGURATIONS..."
                    className="w-full bg-nexus-accent/5 border border-nexus-accent/20 rounded-2xl py-4 pl-12 pr-4 text-xs font-mono font-bold tracking-widest text-white outline-none focus:border-nexus-accent/50 focus:bg-nexus-accent/10 transition-all placeholder:text-nexus-text-dim/50"
                  />
                  {searchQuery && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 p-2 glass border border-nexus-accent/20 rounded-2xl z-50 max-h-64 overflow-y-auto scrollbar-none shadow-2xl"
                    >
                      {filteredSettings.length > 0 ? (
                        <div className="space-y-1">
                          {filteredSettings.map(setting => (
                            <button
                              key={setting.id}
                              onClick={() => {
                                setActiveTab(setting.tab as any);
                                setSearchQuery("");
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-nexus-accent/10 group transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-nexus-accent/20">
                                  <setting.icon className="w-4 h-4 text-nexus-accent" />
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-bold text-white uppercase tracking-wider">{setting.label}</p>
                                  <p className="text-[9px] text-nexus-text-dim uppercase font-mono">{setting.tab} matrix</p>
                                </div>
                              </div>
                              <ArrowRight className="w-3 h-3 text-nexus-text-dim group-hover:text-nexus-accent transition-all opacity-0 group-hover:opacity-100" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-mono">No matching configurations found</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-nexus-accent uppercase tracking-widest flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Interface Aesthetics
                  </h4>
                  <div className="grid grid-cols-3 gap-6">
                    {["NEON", "STEALTH", "GLASS"].map(theme => (
                      <button 
                        key={theme}
                        className={cn(
                          "p-6 rounded-2xl border transition-all text-center group",
                          theme === "NEON" 
                            ? "bg-nexus-accent/10 border-nexus-accent shadow-[0_0_15px_rgba(5,255,161,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110",
                          theme === "NEON" ? "bg-nexus-accent/20" : "bg-white/10"
                        )}>
                          <Monitor className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold tracking-widest">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Animations Level</p>
                        <p className="text-[10px] text-nexus-text-dim">Fluid micro-interactions</p>
                      </div>
                    </div>
                    <div className="flex bg-white/10 rounded-lg p-1">
                      {["LOW", "MED", "HIGH"].map(lvl => (
                        <button key={lvl} className={cn(
                          "px-3 py-1 rounded-md text-[9px] font-bold transition-all",
                          lvl === "HIGH" ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
                        )}>{lvl}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "api" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-nexus-accent uppercase tracking-widest flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Neural Key Matrix
                  </h4>
                  <button className="text-[10px] font-bold text-nexus-text-dim hover:text-white flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    SYNC ALL
                  </button>
                </div>

                {[
                  { name: "Gemini Intelligence API", icon: Cpu, value: "sk-••••••••••••••••", status: "Active" },
                  { name: "Google Social Proxy", icon: Globe, value: "gs-••••••••••••••••", status: "Active" },
                  { name: "LinkedIn OAuth Core", icon: Lock, value: "ln-••••••••••••••••", status: "Active" },
                  { name: "Twitter X Pipeline", icon: Smartphone, value: "tw-••••••••••••••••", status: "Connected" },
                ].map((key, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-nexus-accent/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-nexus-accent/5 flex items-center justify-center">
                        <key.icon className="w-5 h-5 text-nexus-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{key.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-[10px] text-nexus-text-dim bg-white/5 px-2 py-0.5 rounded font-mono">
                            {showKeys[key.name] ? "sk-3921-x992-nexus-a1" : key.value}
                          </code>
                          <button 
                            onClick={() => toggleKey(key.name)}
                            className="text-nexus-accent hover:text-white transition-colors"
                          >
                            {showKeys[key.name] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                      <span className="text-[10px] font-bold text-nexus-text-dim uppercase tracking-tighter">{key.status}</span>
                    </div>
                  </div>
                ))}

                <button className="w-full py-4 rounded-2xl border-2 border-dashed border-white/5 text-nexus-text-dim hover:text-nexus-accent hover:border-nexus-accent/30 hover:bg-nexus-accent/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connect New Service
                </button>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h4 className="text-sm font-bold text-nexus-accent uppercase tracking-widest flex items-center gap-2 text-red-400">
                  <Shield className="w-4 h-4" />
                  Security Protocols
                </h4>
                
                <div className="space-y-4">
                  {[
                    { id: "2fa", label: "Biometric Two-Factor Authentication", desc: "Require neural fingerprint for key modifications", active: true },
                    { id: "enc", label: "Zero-Knowledge Encryption", desc: "Data is encrypted before leaving the system", active: true },
                    { id: "log", label: "Quantum Activity Logging", desc: "Immutable record of all system state changes", active: false },
                  ].map((proto) => (
                    <div key={proto.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-white">{proto.label}</p>
                        <p className="text-[10px] text-nexus-text-dim">{proto.desc}</p>
                      </div>
                      <button className={cn(
                        "w-10 h-5 rounded-full relative transition-colors duration-300 px-1 flex items-center",
                        proto.active ? "bg-nexus-accent" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "w-3 h-3 rounded-full bg-white transition-transform duration-300",
                          proto.active ? "translate-x-5" : "translate-x-0"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/10">
                  <button className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Initiate Factory Wipe
                  </button>
                  <p className="text-[9px] text-nexus-text-dim text-center mt-3 uppercase tracking-tighter">Warning: This action is permanent and clears all neural configurations.</p>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
