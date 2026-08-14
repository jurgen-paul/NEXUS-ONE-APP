import { useState, useEffect } from "react";
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
  Archive,
  Code,
  Eye,
  EyeOff,
  User,
  RefreshCw
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ParameterVersion {
  versionId: string;
  payload: string;
  createdAt: string;
  status: "ACTIVE" | "DEPRECATED";
}

interface CloudBlueprint {
  id: string;
  name: string;
  type: "TERRAFORM" | "GDM";
  payload: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  createdAt: string;
}

interface Parameter {
  id: string;
  projectId: string;
  location: string;
  name: string;
  currentVersion: string;
  versions: ParameterVersion[];
}

interface CloudService {
  id: string;
  name: string;
  apiName: string;
  description: string;
  status: "ENABLED" | "DISABLED" | "PENDING";
  category: "Compute" | "Database" | "Repository" | "AI" | "Management";
}

const TERRAFORM_SCRIPT = `resource "google_sql_database_instance" "instance" {
  name             = "my-mysql-instance"
  database_version = "MYSQL_8_0"
  region           = "us-central1"
  project          = "oistarian-nexus-commander"
  deletion_protection = false

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_sql_database" "database" {
  name     = "my-database"
  instance = google_sql_database_instance.instance.name
  project  = "oistarian-nexus-commander"
}

resource "google_sql_user" "users" {
  name     = "root"
  instance = google_sql_database_instance.instance.name
  project  = "oistarian-nexus-commander"
  host     = "%"
  password = "changeme123"
}`;

const INITIAL_BLUEPRINTS: CloudBlueprint[] = [
  { id: "b1", name: "MySQL Cloud SQL Instance", type: "TERRAFORM", payload: TERRAFORM_SCRIPT }
];

const INITIAL_KEYS: APIKey[] = [
  { id: "k1", name: "Gemini Pro Node", key: "AIzaSyAqM4X_pL8k", provider: "Google AI", createdAt: "2026-05-13" },
  { id: "k2", name: "Stripe Connect", key: "sk_live_51Mv9K2L", provider: "Stripe", createdAt: "2026-05-12" },
];

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

const INITIAL_SERVICES: CloudService[] = [
  { 
    id: "s1", 
    name: "App Engine Admin API", 
    apiName: "appengine.googleapis.com", 
    description: "Provides programmatic access to Google App Engine application management, deployments, scaling settings, and traffic allocation.",
    status: "ENABLED", 
    category: "Compute" 
  },
  { 
    id: "s2", 
    name: "Cloud Source Repositories API", 
    apiName: "sourcerepo.googleapis.com", 
    description: "High-performance, private hosted Git repositories on GCP. Seamlessly integrated with App Engine build pipelines.",
    status: "ENABLED", 
    category: "Repository" 
  },
  { 
    id: "s3", 
    name: "Cloud SQL Admin API", 
    apiName: "sqladmin.googleapis.com", 
    description: "Enables programmatic control, replication setups, automatic scaling, and credentials management for Google Cloud SQL databases.",
    status: "ENABLED", 
    category: "Database" 
  },
  { 
    id: "s4", 
    name: "Vertex AI API", 
    apiName: "aiplatform.googleapis.com", 
    description: "Enables programmatic access to Gemini developers' models, custom NPU agent engines, and foundation embedding models.",
    status: "ENABLED", 
    category: "AI" 
  },
  { 
    id: "s5", 
    name: "Cloud Resource Manager API", 
    apiName: "cloudresourcemanager.googleapis.com", 
    description: "Provides hierarchical access control, programmatic Google Cloud project creation, metadata, and service accounts policies.",
    status: "ENABLED", 
    category: "Management" 
  },
];

export const CloudConfig = () => {
  const [parameters, setParameters] = useState<Parameter[]>(INITIAL_PARAMETERS);
  const [selectedParam, setSelectedParam] = useState<Parameter | null>(INITIAL_PARAMETERS[0]);
  const [blueprints] = useState<CloudBlueprint[]>(INITIAL_BLUEPRINTS);
  const [selectedBlueprint, setSelectedBlueprint] = useState<CloudBlueprint | null>(INITIAL_BLUEPRINTS[0]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>(INITIAL_KEYS);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(INITIAL_KEYS[0]);
  const [activeView, setActiveView] = useState<"params" | "blueprints" | "keys" | "services">("params");
  const [services, setServices] = useState<CloudService[]>(() => {
    const saved = localStorage.getItem("nexus_cloud_services");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cloud services", e);
      }
    }
    return INITIAL_SERVICES;
  });
  const [selectedServiceId, setSelectedServiceId] = useState<string>("s1");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPayload, setNewPayload] = useState("");

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleToggleService = (id: string) => {
    const serviceToToggle = services.find(s => s.id === id);
    if (!serviceToToggle) return;
    const wasEnabled = serviceToToggle.status === "ENABLED";

    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: "PENDING" as const };
      }
      return s;
    }));

    setTimeout(() => {
      setServices(prev => {
        const updated = prev.map(s => {
          if (s.id === id) {
            const nextStatus: "ENABLED" | "DISABLED" = wasEnabled ? "DISABLED" : "ENABLED";
            return { ...s, status: nextStatus };
          }
          return s;
        });
        localStorage.setItem("nexus_cloud_services", JSON.stringify(updated));
        return updated;
      });
    }, 1500);
  };

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
          <h1 className="text-4xl font-display font-extrabold tracking-tight neon-text uppercase">Cloud Architect</h1>
          <p className="text-nexus-text-dim mt-2 tracking-widest text-[10px] uppercase font-mono">
            Infrastructure & Parameters <span className="text-nexus-accent ml-2">// ORCH_CENTER_v.2.0</span>
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveView("params")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              activeView === "params" ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
            )}
          >
            Parameters
          </button>
          <button 
            onClick={() => setActiveView("blueprints")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              activeView === "blueprints" ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
            )}
          >
            Blueprints
          </button>
          <button 
            onClick={() => setActiveView("keys")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              activeView === "keys" ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
            )}
          >
            API Keys
          </button>
          <button 
            onClick={() => setActiveView("services")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              activeView === "services" ? "bg-nexus-accent text-black" : "text-nexus-text-dim hover:text-white"
            )}
          >
            Services
          </button>
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
              {activeView === "params" ? parameters.map((param) => (
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
              )) : activeView === "blueprints" ? blueprints.map((bp) => (
                <button
                  key={bp.id}
                  onClick={() => setSelectedBlueprint(bp)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    selectedBlueprint?.id === bp.id 
                      ? "bg-nexus-accent/10 border-nexus-accent/30" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Code className={cn("w-3 h-3", selectedBlueprint?.id === bp.id ? "text-nexus-accent" : "text-nexus-text-dim")} />
                    <span className="text-xs font-bold text-white uppercase">{bp.name}</span>
                  </div>
                  <p className="text-[9px] text-nexus-text-dim truncate font-mono">{bp.type}</p>
                </button>
              )) : activeView === "keys" ? apiKeys.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKey(k)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    selectedKey?.id === k.id 
                      ? "bg-nexus-accent/10 border-nexus-accent/30" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className={cn("w-3 h-3", selectedKey?.id === k.id ? "text-nexus-accent" : "text-nexus-text-dim")} />
                    <span className="text-xs font-bold text-white uppercase">{k.name}</span>
                  </div>
                  <p className="text-[9px] text-nexus-text-dim truncate font-mono">{k.provider}</p>
                </button>
              )) : services.map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    selectedServiceId === srv.id 
                      ? "bg-nexus-accent/10 border-nexus-accent/30" 
                      : "bg-white/5 border-transparent hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud className={cn("w-3.5 h-3.5", selectedServiceId === srv.id ? "text-nexus-accent font-bold" : "text-nexus-text-dim")} />
                    <span className="text-xs font-bold text-white uppercase truncate">{srv.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[9px] text-nexus-text-dim font-mono">{srv.apiName}</p>
                    <span className={cn(
                      "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase",
                      srv.status === "ENABLED" ? "bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse" : 
                      srv.status === "PENDING" ? "bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20" :
                      "bg-white/10 text-nexus-text-dim border border-white/5"
                    )}>
                      {srv.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
          {activeView === "params" && selectedParam && (
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
          )}

          {activeView === "blueprints" && selectedBlueprint && (
            <div className="p-8 space-y-8 max-w-5xl mx-auto">
              <div className="flex justify-between items-center bg-nexus-accent/5 p-8 rounded-[40px] border border-nexus-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Terminal className="w-32 h-32 text-nexus-accent" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-black text-white uppercase">{selectedBlueprint.name}</h2>
                  <p className="text-nexus-text-dim font-mono text-[10px] mt-1 uppercase tracking-widest">Type: {selectedBlueprint.type}</p>
                </div>
                <button 
                  onClick={() => handleCopy(selectedBlueprint.payload)}
                  className="px-6 py-2 bg-nexus-accent text-black font-bold rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  {copied === selectedBlueprint.payload ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy Code
                </button>
              </div>

              <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-nexus-text-dim tracking-widest">MAIN.TF</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/10" />)}
                  </div>
                </div>
                <div className="p-6 bg-black overflow-x-auto">
                  <pre className="text-nexus-accent font-mono text-[11px] leading-relaxed">
                    {selectedBlueprint.payload}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {((activeView === "params" && !selectedParam) || (activeView === "blueprints" && !selectedBlueprint) || (activeView === "keys" && !selectedKey)) && (
            <div className="h-full flex flex-col items-center justify-center text-nexus-text-dim space-y-4">
              <Settings className="w-16 h-16 opacity-10" />
              <p className="text-xs uppercase tracking-widest font-mono">Select a resource to orchestrate</p>
            </div>
          )}

          {activeView === "keys" && selectedKey && (
            <div className="p-8 space-y-8 max-w-5xl mx-auto">
              <div className="flex justify-between items-center bg-nexus-accent/5 p-8 rounded-[40px] border border-nexus-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Shield className="w-32 h-32 text-nexus-accent" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-black text-white uppercase">{selectedKey.name}</h2>
                  <p className="text-nexus-text-dim font-mono text-[10px] mt-1 uppercase tracking-widest">Provider: {selectedKey.provider}</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-2 glass border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    Rotate Key
                  </button>
                </div>
              </div>

              <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-nexus-text-dim uppercase tracking-widest mb-3">Secret API Key</label>
                  <div className="relative group">
                    <input 
                      type={showKey ? "text" : "password"}
                      value={selectedKey.key}
                      readOnly
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-24 text-sm font-mono text-nexus-accent focus:outline-none focus:border-nexus-accent/50 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="p-2 text-nexus-text-dim hover:text-white transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleCopy(selectedKey.key)}
                        className="p-2 text-nexus-text-dim hover:text-white transition-colors"
                      >
                        {copied === selectedKey.key ? <Check className="w-4 h-4 text-nexus-accent" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-[9px] text-nexus-text-dim font-mono italic">
                    Key established on {selectedKey.createdAt}. High-frequency access detected.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest mb-1">Access Level</p>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">FULL_ADMIN_WRITE</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest mb-1">Usage Quota</p>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">UNLIMITED</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === "services" && selectedService && (
            <div className="p-8 space-y-8 max-w-5xl mx-auto">
              <section className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 glass p-8 rounded-[40px] border border-nexus-accent/20 bg-nexus-accent/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Cloud className="w-32 h-32 text-nexus-accent" />
                  </div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={cn(
                      "text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase",
                      selectedService.category === "Compute" ? "bg-cyan-500/10 text-cyan-400" :
                      selectedService.category === "Database" ? "bg-amber-500/10 text-amber-400" :
                      selectedService.category === "Repository" ? "bg-purple-500/10 text-purple-400" :
                      selectedService.category === "AI" ? "bg-fuchsia-500/10 text-fuchsia-400" :
                      "bg-slate-500/10 text-slate-400"
                    )}>
                      {selectedService.category}
                    </span>
                    <span className="text-[10px] text-nexus-text-dim font-mono">// GOOGLE CLOUD SERVICE</span>
                  </div>
                  <h2 className="text-3xl font-display font-black text-white uppercase mb-2">
                    {selectedService.name}
                  </h2>
                  <p className="text-nexus-text-dim text-xs font-mono mb-4">{selectedService.apiName}</p>
                  <p className="text-sm text-nexus-text-dim leading-relaxed max-w-2xl mb-6">
                    {selectedService.description}
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleToggleService(selectedService.id)}
                      disabled={selectedService.status === "PENDING"}
                      className={cn(
                        "px-6 py-2 font-bold rounded-xl text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                        selectedService.status === "ENABLED" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                          : "bg-nexus-accent text-black hover:shadow-[0_0_20px_rgba(5,255,161,0.4)]"
                      )}
                    >
                      {selectedService.status === "PENDING" ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Provisioning...
                        </>
                      ) : selectedService.status === "ENABLED" ? (
                        <>Disable Service</>
                      ) : (
                        <>Enable Service</>
                      )}
                    </button>
                    <button className="px-6 py-2 glass border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                      <Settings className="w-4 h-4" /> API Parameters
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-4">
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest mb-1">Service Status</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedService.status === "ENABLED" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : 
                        selectedService.status === "PENDING" ? "bg-nexus-accent animate-ping" : 
                        "bg-nexus-text-dim"
                      )} />
                      <p className="text-lg font-display font-black text-white uppercase">{selectedService.status}</p>
                    </div>
                  </div>
                  <div className="glass p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-mono text-nexus-text-dim uppercase tracking-widest mb-1">Access Tier</p>
                    <p className="text-xs font-mono text-nexus-accent font-bold">PLATFORM_INTEGRATED</p>
                  </div>
                </div>
              </section>

              {/* Console Logs / Progress indicator */}
              {selectedService.status === "PENDING" && (
                <div className="glass p-6 rounded-3xl border border-nexus-accent/20 bg-nexus-accent/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-nexus-accent tracking-widest uppercase animate-pulse">Running Cloud Orchestration...</span>
                    <span className="text-[10px] font-mono text-nexus-text-dim">EST: 1.5s</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-nexus-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Live CLI Simulation */}
              <div className="glass p-6 rounded-3xl border border-white/5 bg-black/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-nexus-text-dim">
                  <Terminal className="w-4 h-4" />
                  COMMAND PREVIEW
                </div>
                <div className="p-4 rounded-xl bg-black border border-white/5 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre text-nexus-text-dim">
                  <span className="text-white">$</span> gcloud services {selectedService.status === "ENABLED" ? "disable" : "enable"} {selectedService.apiName} --project=oistarian-nexus-commander
                  {selectedService.status === "PENDING" ? (
                    <div className="mt-2 text-nexus-accent animate-pulse font-bold">
                      Connecting to Google Cloud Manager...
                      Verifying resource permissions...
                      Injecting AppEngine configuration matrices...
                    </div>
                  ) : selectedService.status === "ENABLED" ? (
                    <div className="mt-2 text-green-400 font-bold">
                      {`Operation "operations/acf.5cf7bd0d-b8d9-4820-a612-da6488d9cb91" finished successfully.`}
                      {`Service API [${selectedService.apiName}] is successfully configured on oistarian-nexus-commander.`}
                    </div>
                  ) : (
                    <div className="mt-2 text-red-400 font-bold">
                      {`Service API [${selectedService.apiName}] has been deactivated for project oistarian-nexus-commander.`}
                    </div>
                  )}
                </div>
              </div>
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
