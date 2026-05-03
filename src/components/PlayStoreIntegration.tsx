import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, 
  UploadCloud, 
  CheckCircle2, 
  Smartphone as Phone, 
  Settings, 
  Package, 
  ShieldCheck, 
  History,
  MoreVertical,
  ChevronRight,
  Play,
  Activity,
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AppRelease {
  version: string;
  buildNumber: number;
  status: "Review" | "Draft" | "Production" | "Beta";
  timestamp: string;
  artifacts: string[];
}

export const PlayStoreIntegration = () => {
  const [activeApp, setActiveApp] = useState("Nexus Mobile Core");
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);

  const releases: AppRelease[] = [
    { version: "2.4.0", buildNumber: 152, status: "Production", timestamp: "2 days ago", artifacts: ["nexus_v2.4_prod.aab", "mapping.txt"] },
    { version: "2.5.0-beta.1", buildNumber: 158, status: "Beta", timestamp: "5 hours ago", artifacts: ["nexus_v2.5_beta.aab"] },
    { version: "2.5.0-rc.1", buildNumber: 160, status: "Review", timestamp: "10 mins ago", artifacts: ["nexus_v2.5_rc.aab"] },
  ];

  const handleDeploy = () => {
    setIsDeploying(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDeploying(false), 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center neon-glow">
            <Smartphone className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">Google Play Distribution</h3>
            <p className="text-xs text-nexus-text-dim uppercase tracking-widest font-mono">Mobile Node Control</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {["Production", "Testing", "Internal"].map(track => (
            <button key={track} className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              track === "Production" ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
            )}>
              {track}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Release Control */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-3xl border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package className="w-32 h-32" />
            </div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-mono mb-1">Active Binary</p>
                <h4 className="text-2xl font-display font-bold text-white uppercase">{activeApp}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">v2.4.0</span>
                  <span className="text-[10px] text-nexus-text-dim uppercase font-mono">Build #152</span>
                </div>
              </div>
              <button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-6 py-3 bg-green-500 text-black font-bold rounded-2xl flex items-center gap-3 hover:bg-white transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
              >
                {isDeploying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                {isDeploying ? "SYNCHRONIZING..." : "INITIATE RELEASE"}
              </button>
            </div>

            {isDeploying && (
              <div className="space-y-3 mb-8 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-[10px] text-nexus-accent uppercase tracking-widest font-mono">Uploading .aab bundle to play console...</p>
                  <p className="text-sm font-bold font-mono">{progress}%</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "tween" }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Active Installs", value: "842K", delta: "+12.4%", icon: Phone },
                { label: "Crash-free Users", value: "99.92%", delta: "+0.02%", icon: ShieldCheck },
                { label: "Avg. Rating", value: "4.8", delta: "0.2", icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-nexus-text-dim">
                    <stat.icon className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] uppercase tracking-widest font-mono">{stat.label}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-xl font-display font-bold">{stat.value}</p>
                    <span className="text-[9px] text-green-400 font-mono">{stat.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <History className="w-4 h-4 text-green-500" />
              Release History
            </h4>
            <div className="space-y-4">
              {releases.map((release, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-green-500/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-nexus-text-dim group-hover:text-green-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-sm">Version {release.version}</p>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                        release.status === "Production" ? "bg-green-500/20 text-green-400" :
                        release.status === "Review" ? "bg-nexus-accent/20 text-nexus-accent" : "bg-white/10 text-nexus-text-dim"
                      )}>
                        {release.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-nexus-text-dim mt-1 font-mono">Build #{release.buildNumber} • {release.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim transition-colors">
                      <Activity className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-nexus-text-dim transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Console Health & Controls */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border-white/5">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4 text-green-500" />
              Distribution Matrix
            </h4>
            <div className="space-y-4">
              {[
                { label: "Auto-Update Propagation", active: true },
                { label: "Differential Sync", active: true },
                { label: "App Bundle Compression", active: false },
                { label: "Managed Google Play", active: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-nexus-text-dim font-bold uppercase">{setting.label}</span>
                  <button className={cn(
                    "w-8 h-4 rounded-full relative transition-colors duration-300 flex items-center px-0.5",
                    setting.active ? "bg-green-500" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300",
                      setting.active ? "translate-x-4" : "translate-x-0"
                    )} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
              <div className="flex items-center gap-2 mb-2 text-green-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Security Status</span>
              </div>
              <p className="text-[10px] text-nexus-text-dim leading-relaxed">
                All binaries are encrypted with AES-256 and verified through Nexus Play Integrity Protocol.
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 h-64 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)]" />
            <Globe className="w-12 h-12 text-green-500/20 mb-4 animate-spin-slow" />
            <h4 className="font-bold text-sm mb-2">Geo-Distribution Flow</h4>
            <p className="text-[10px] text-nexus-text-dim max-w-[180px]">
              Active propagation across 24 global region nodes.
            </p>
            <div className="mt-6 flex gap-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-1 h-3 rounded-full bg-green-500/30 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RefreshCw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
  </svg>
);
