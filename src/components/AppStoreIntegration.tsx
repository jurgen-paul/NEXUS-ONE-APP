import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AppWindow, 
  UploadCloud, 
  CheckCircle2, 
  Smartphone, 
  Settings, 
  Package, 
  ShieldCheck, 
  History,
  MoreVertical,
  ChevronRight,
  Play,
  Activity,
  Zap,
  Globe,
  RefreshCw,
  Cpu,
  Layers
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface AppRelease {
  version: string;
  buildNumber: string;
  status: "Ready for Sale" | "Processing" | "Waiting for Review" | "TestFlight";
  timestamp: string;
  artifacts: string[];
}

export const AppStoreIntegration = () => {
  const [activeApp, setActiveApp] = useState("Nexus iOS Core");
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);

  const releases: AppRelease[] = [
    { version: "2.4.0", buildNumber: "24C152", status: "Ready for Sale", timestamp: "3 days ago", artifacts: ["nexus_v2.4_prod.ipa", "symbols.zip"] },
    { version: "2.5.0", buildNumber: "25A158", status: "TestFlight", timestamp: "6 hours ago", artifacts: ["nexus_v2.5_beta.ipa"] },
    { version: "2.5.0", buildNumber: "25A160", status: "Waiting for Review", timestamp: "15 mins ago", artifacts: ["nexus_v2.5_rc.ipa"] },
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
        return prev + 1.5;
      });
    }, 40);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center neon-glow-blue">
            <AppWindow className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">App Store Connect</h3>
            <p className="text-xs text-nexus-text-dim uppercase tracking-widest font-mono">iOS Node Control</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {["Production", "TestFlight", "Xcode Cloud"].map(track => (
            <button key={track} className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              track === "Production" ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "text-nexus-text-dim hover:text-white"
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
              <Cpu className="w-32 h-32" />
            </div>
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] text-nexus-text-dim uppercase tracking-widest font-mono mb-1">Live Binary</p>
                <h4 className="text-2xl font-display font-bold text-white uppercase tracking-tight">{activeApp}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">v2.4.0</span>
                  <span className="text-[10px] text-nexus-text-dim uppercase font-mono">Build 24C152</span>
                </div>
              </div>
              <button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-6 py-3 bg-white text-black font-bold rounded-2xl flex items-center gap-3 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {isDeploying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                {isDeploying ? "UPLOADING TO CONNECT..." : "AUTO-SUBMIT BUILD"}
              </button>
            </div>

            {isDeploying && (
              <div className="space-y-3 mb-8 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest font-mono">Transmitting IPA via altool...</p>
                  <p className="text-sm font-bold font-mono">{Math.floor(progress)}%</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "tween" }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Active iOS Users", value: "612K", delta: "+8.1%", icon: Smartphone },
                { label: "App Health Score", value: "98.4", delta: "+1.2", icon: ShieldCheck },
                { label: "Conversion Rate", value: "4.2%", delta: "+0.5%", icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-nexus-text-dim">
                    <stat.icon className="w-3 h-3 text-blue-400" />
                    <span className="text-[9px] uppercase tracking-widest font-mono">{stat.label}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-xl font-display font-bold">{stat.value}</p>
                    <span className="text-[9px] text-blue-400 font-mono">{stat.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              App Store Activity Log
            </h4>
            <div className="space-y-4">
              {releases.map((release, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-500/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-nexus-text-dim group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-sm">Version {release.version}</p>
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                        release.status === "Ready for Sale" ? "bg-green-500/20 text-green-400" :
                        release.status === "Processing" ? "bg-blue-500/20 text-blue-400" :
                        release.status === "Waiting for Review" ? "bg-yellow-500/20 text-yellow-400" : "bg-purple-500/20 text-purple-400"
                      )}>
                        {release.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-nexus-text-dim mt-1 font-mono">Build {release.buildNumber} • {release.timestamp}</p>
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
              <Settings className="w-4 h-4 text-blue-400" />
              Connect Protocols
            </h4>
            <div className="space-y-4">
              {[
                { label: "App Tracking Transparency", active: true },
                { label: "On-Demand Resources", active: false },
                { label: "In-App Purchase Sync", active: true },
                { label: "Push Notification Hub", active: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-nexus-text-dim font-bold uppercase">{setting.label}</span>
                  <button className={cn(
                    "w-8 h-4 rounded-full relative transition-colors duration-300 flex items-center px-0.5",
                    setting.active ? "bg-blue-500" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300",
                      setting.active ? "translate-x-4" : "translate-x-0"
                    )} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Certificate Status</span>
              </div>
              <p className="text-[10px] text-nexus-text-dim leading-relaxed font-mono">
                Provisioning Profile: ACTIVE
                Distribution Cert: EXPIRES IN 242 DAYS
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 h-64 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
            <Layers className="w-12 h-12 text-blue-400/20 mb-4 animate-pulse" />
            <h4 className="font-bold text-sm mb-2">TestFlight Feedback Flow</h4>
            <p className="text-[10px] text-nexus-text-dim max-w-[180px]">
              Active beta testers provided 42 bug reports in the last 24h.
            </p>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
