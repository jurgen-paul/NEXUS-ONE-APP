import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Key, 
  Terminal, 
  Cloud, 
  Plus, 
  History, 
  Search, 
  ChevronRight, 
  Copy, 
  Check, 
  AlertTriangle,
  Database,
  Globe,
  Settings,
  Archive
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ParameterVersion {
  versionId: string;
  payload: string;
  createdAt: string;
  status: "ACTIVE" | "DEPRECATED";
}

interface Parameter {
  id: string;
  projectId: string;
  location: string;
  name: string;
  currentVersion: string;
  versions: ParameterVersion[];
}

const INITIAL_PARAMETERS: Parameter[] = [
  {
    id: "OISTARIAN",
    projectId: "oistarian-nexus-commander",
    location: "global",
    name: "OISTARIAN",
    currentVersion: "1",
    versions: [
      { versionId: "1", payload: "******ENC_A102****", createdAt: "2026-05-12 14:20:00", status: "ACTIVE" }
    ]
  }
];

export const CloudConfig = () => {
  const [parameters, setParameters] = useState<Parameter[]>(INITIAL_PARAMETERS);
  const [selectedParam, setSelectedParam] = useState<Parameter | null>(INITIAL_PARAMETERS[0]);
  const [copied, setCopied] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPayload, setNewPayload] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const createNewVersion = () => {
    if (!newPayload || !selectedParam) return;
    
    const newVersion: ParameterVersion = {
      versionId: (selectedParam.versions.length + 1).toString(),
      payload: newPayload,
      createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
      status: "ACTIVE"
    };

    const updatedParams = parameters.map(p => {
      if (p.id === selectedParam.id) {
        return {
          ...p,
          currentVersion: newVersion.versionId,
          versions: [newVersion, ...p.versions]
        };
      }
      return p;
    });

    setParameters(updatedParams);
    setSelectedParam(updatedParams.find(p => p.id === selectedParam.id) || null);
    setNewPayload("");
    setIsCreating(false);
  };

  return (
    <div className="h-full flex flex-col bg-nexus-bg">
      <header className="p-8 border-b border-white/5 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight neon-text uppercase">Parameter Manager</h1>
          <p className="text-nexus-text-dim mt-2 tracking-widest text-[10px] uppercase font-mono">
            GCP Parameter Orchestration <span className="text-nexus-accent ml-2">// INFRA_SEC_v.1.0</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono uppercase tracking-tighter">Region: Global</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Resource List */}
        <div className="w-80 border-r border-white/5 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-nexus-text-dim" />
              <input 
                type="text" 
                placeholder="Filter resources..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-[10px] font-mono text-white focus:outline-none focus:border-nexus-accent/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              {parameters.map((param) => (
                <button
                  key={param.id}
                  onClick={() => setSelectedParam(param)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    selectedParam?.id === param.id 
                      ? "bg-nexus-accent/10 border-nexus-accent/30" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Key className={cn("w-3 h-3", selectedParam?.id === param.id ? "text-nexus-accent" : "text-nexus-text-dim")} />
                    <span className="text-xs font-bold text-white uppercase">{param.name}</span>
                  </div>
                  <p className="text-[9px] text-nexus-text-dim truncate font-mono">{param.projectId}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
          {selectedParam ? (
            <div className="p-8 space-y-8 max-w-5xl mx-auto">
              <section className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 glass p-8 rounded-[40px] border border-nexus-accent/20 bg-nexus-accent/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Cloud className="w-32 h-32 text-nexus-accent" />
                  </div>
                  <h2 className="text-3xl font-display font-black text-white uppercase mb-2">
                    {selectedParam.name}
                  </h2>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-nexus-text-dim">
                    <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> {selectedParam.projectId}</span>
                    <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {selectedParam.location}</span>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <button 
                      onClick={() => setIsCreating(true)}
                      className="px-6 py-2 bg-nexus-accent text-black font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(5,255,161,0.4)] transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> New Version
                    </button>
                    <button className="px-6 py-2 glass border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Parameters Settings
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-4">
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest mb-1">Active Version</p>
                    <p className="text-2xl font-display font-black text-white">v{selectedParam.currentVersion}</p>
                  </div>
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest mb-1">Last Deployment</p>
                    <p className="text-xs font-mono text-nexus-accent">{selectedParam.versions[0].createdAt}</p>
                  </div>
                </div>
              </section>

              {/* Version History / Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-widest">
                    <History className="w-4 h-4 text-nexus-accent" />
                    Version Timeline
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedParam.versions.map((version) => (
                    <motion.div 
                      key={version.versionId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs",
                          version.versionId === selectedParam.currentVersion ? "bg-nexus-accent text-black" : "bg-white/5 text-nexus-text-dim"
                        )}>
                          {version.versionId}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold text-white font-mono">ID: {version.versionId}</span>
                            <span className={cn(
                              "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase",
                              version.status === "ACTIVE" ? "bg-nexus-accent/20 text-nexus-accent" : "bg-white/10 text-nexus-text-dim"
                            )}>{version.status}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-mono text-nexus-text-dim">
                            <span>Created: {version.createdAt}</span>
                            <span className="cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleCopy(version.payload)}>
                              {copied === version.payload ? <Check className="w-3 h-3 text-nexus-accent" /> : <Copy className="w-3 h-3" />}
                              Payload
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 glass rounded-lg hover:text-blue-400 transition-colors">
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Version CLI Simulation */}
              <div className="glass p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-nexus-text-dim">
                  <Terminal className="w-4 h-4" />
                  COMMAND PREVIEW
                </div>
                <div className="p-4 rounded-xl bg-black border border-white/5 text-[10px] font-mono text-nexus-accent overflow-x-auto whitespace-pre">
                  {`gcloud parametermanager parameters versions create projects/${selectedParam.projectId}/locations/${selectedParam.location}/parameters/${selectedParam.name} --parameter=${selectedParam.id} --location=${selectedParam.location} --payload-data="PARAMETER_PAYLOAD"`}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-nexus-text-dim space-y-4">
              <Settings className="w-16 h-16 opacity-10" />
              <p className="text-xs uppercase tracking-widest font-mono">Select a parameter to orchestrate</p>
            </div>
          )}
        </div>
      </div>

      {/* New Version Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass p-8 rounded-[40px] border border-nexus-accent/30 bg-nexus-bg shadow-[0_0_50px_rgba(5,255,161,0.1)]"
            >
              <h3 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-nexus-accent" />
                Inject New Version
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-nexus-text-dim uppercase tracking-widest mb-2">Payload Data</label>
                  <textarea 
                    value={newPayload}
                    onChange={(e) => setNewPayload(e.target.value)}
                    placeholder="Enter raw payload string..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-nexus-accent/50 min-h-[120px] transition-all"
                  />
                  <p className="mt-2 text-[9px] text-nexus-text-dim font-mono italic">
                    Note: Payload will be encrypted using Nexus Commander v2 protocols.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className="text-[10px] text-red-400 leading-relaxed font-mono">
                    CAUTION: Creating a new version increments the globally available parameter. This action remains in the immutable audit log.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={createNewVersion}
                    className="flex-1 py-3 bg-nexus-accent text-black font-bold rounded-xl text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                  >
                    Commit Version
                  </button>
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-3 glass border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
