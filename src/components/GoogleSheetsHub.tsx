import React, { useState, useEffect } from "react";
import { 
  Table, 
  FileSpreadsheet, 
  Plus, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  Layers, 
  Database, 
  FilePlus, 
  Play, 
  Edit3, 
  Grid, 
  ShieldCheck, 
  FileCheck,
  Send,
  Sliders,
  ChevronRight,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "firebase/auth";
import { 
  initGoogleAuth, 
  signInWithGoogle, 
  logoutGoogle, 
  listUserSpreadsheets, 
  getSpreadsheetDetails, 
  getSheetValues, 
  createNewSpreadsheet, 
  appendSheetRows, 
  updateSheetRange, 
  clearSheetRange, 
  deleteSpreadsheetFile,
  SpreadsheetFile,
  SheetMetadata
} from "../lib/googleSheets";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "danger" | "primary" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const ConfirmationModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmVariant = "danger",
  onConfirm,
  onCancel,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass border border-nexus-border rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            confirmVariant === "danger" 
              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
              : "bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/30"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-nexus-text-dim leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-nexus-border">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-nexus-text-dim hover:text-white transition-colors rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-5 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${
              confirmVariant === "danger"
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-nexus-accent hover:bg-white text-black neon-glow"
            } disabled:opacity-50`}
          >
            {isProcessing && <RefreshCw className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const GoogleSheetsHub: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Spreadsheets list
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetFile[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected spreadsheet & data
  const [selectedSheetFile, setSelectedSheetFile] = useState<SpreadsheetFile | null>(null);
  const [sheetMetadata, setSheetMetadata] = useState<SheetMetadata | null>(null);
  const [activeTabName, setActiveTabName] = useState<string>("");
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // New row input state
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});
  const [isAppending, setIsAppending] = useState<boolean>(false);

  // Quick template creator state
  const [isCreatingModal, setIsCreatingModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("telemetry");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant: "danger" | "primary" | "warning";
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "Confirm",
    confirmVariant: "primary",
    action: async () => {}
  });
  const [isModalProcessing, setIsModalProcessing] = useState<boolean>(false);

  // Notification / Toast
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage((current) => current?.text === text ? null : current);
    }, 4000);
  };

  // Auth Initialization
  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        fetchSpreadsheets(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const authResult = await signInWithGoogle();
      if (authResult) {
        setUser(authResult.user);
        setAccessToken(authResult.accessToken);
        showToast(`Connected as ${authResult.user.displayName || authResult.user.email}`, "success");
        fetchSpreadsheets(authResult.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Google Authentication failed");
      showToast("Sign-in failed. Please check permissions.", "error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
    setSpreadsheets([]);
    setSelectedSheetFile(null);
    setSheetMetadata(null);
    setSheetRows([]);
    showToast("Disconnected from Google Account", "info");
  };

  // Fetch Spreadsheets list
  const fetchSpreadsheets = async (token: string) => {
    setIsLoadingList(true);
    try {
      const files = await listUserSpreadsheets(token);
      setSpreadsheets(files);
      if (files.length > 0 && !selectedSheetFile) {
        loadSpreadsheet(files[0], token);
      }
    } catch (err: any) {
      console.error("List error:", err);
      showToast(err.message || "Failed to load Google Sheets", "error");
    } finally {
      setIsLoadingList(false);
    }
  };

  // Load a specific spreadsheet
  const loadSpreadsheet = async (file: SpreadsheetFile, token?: string) => {
    const activeTok = token || accessToken;
    if (!activeTok) return;

    setSelectedSheetFile(file);
    setIsLoadingData(true);
    try {
      const meta = await getSpreadsheetDetails(activeTok, file.id);
      setSheetMetadata(meta);
      const firstTab = meta.sheets?.[0]?.properties?.title || "Sheet1";
      setActiveTabName(firstTab);
      await loadTabValues(file.id, firstTab, activeTok);
    } catch (err: any) {
      console.error("Load sheet error:", err);
      showToast(err.message || "Could not retrieve spreadsheet", "error");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load Tab Values
  const loadTabValues = async (spreadsheetId: string, tabName: string, token?: string) => {
    const activeTok = token || accessToken;
    if (!activeTok) return;

    setIsLoadingData(true);
    try {
      const values = await getSheetValues(activeTok, spreadsheetId, `${tabName}!A1:Z500`);
      setSheetRows(values);
      // Initialize newRowData object matching headers
      if (values.length > 0) {
        const headers = values[0];
        const initialForm: Record<string, string> = {};
        headers.forEach(h => { initialForm[h] = ""; });
        setNewRowData(initialForm);
      }
    } catch (err: any) {
      console.error("Load values error:", err);
      showToast(err.message || "Could not read sheet data", "error");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Switch Tab
  const handleTabChange = async (tabName: string) => {
    if (!selectedSheetFile) return;
    setActiveTabName(tabName);
    await loadTabValues(selectedSheetFile.id, tabName);
  };

  // Trigger Confirmation Modal
  const requestConfirmation = (
    title: string,
    description: string,
    confirmLabel: string,
    confirmVariant: "danger" | "primary" | "warning",
    action: () => Promise<void>
  ) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      confirmLabel,
      confirmVariant,
      action
    });
  };

  const handleModalConfirm = async () => {
    setIsModalProcessing(true);
    try {
      await confirmConfig.action();
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      console.error("Action error:", err);
      showToast(err.message || "Operation failed", "error");
    } finally {
      setIsModalProcessing(false);
    }
  };

  // 1. Append Row Action (with Confirmation)
  const handleAppendRowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedSheetFile || !activeTabName || sheetRows.length === 0) return;

    const headers = sheetRows[0];
    const newValues = headers.map(h => newRowData[h] || "");

    requestConfirmation(
      "Confirm Append Row",
      `Are you sure you want to append this new row to '${selectedSheetFile.name}' under tab '${activeTabName}'?`,
      "Append Row",
      "primary",
      async () => {
        setIsAppending(true);
        try {
          await appendSheetRows(accessToken, selectedSheetFile.id, `${activeTabName}!A1`, [newValues]);
          showToast("Row successfully added to Google Sheets", "success");
          await loadTabValues(selectedSheetFile.id, activeTabName);
          // Reset form fields
          const resetForm: Record<string, string> = {};
          headers.forEach(h => { resetForm[h] = ""; });
          setNewRowData(resetForm);
        } finally {
          setIsAppending(false);
        }
      }
    );
  };

  // 2. Clear Sheet Data (with Confirmation)
  const handleClearSheet = () => {
    if (!accessToken || !selectedSheetFile || !activeTabName) return;

    requestConfirmation(
      "Clear Sheet Data",
      `Warning: This will clear all values from range '${activeTabName}!A2:Z500' in '${selectedSheetFile.name}'. Column headers will be preserved. This cannot be undone.`,
      "Clear Data",
      "danger",
      async () => {
        await clearSheetRange(accessToken, selectedSheetFile.id, `${activeTabName}!A2:Z500`);
        showToast(`Cleared rows from ${activeTabName}`, "success");
        await loadTabValues(selectedSheetFile.id, activeTabName);
      }
    );
  };

  // 3. Delete Spreadsheet from Drive (with Confirmation)
  const handleDeleteSpreadsheet = (file: SpreadsheetFile) => {
    if (!accessToken) return;

    requestConfirmation(
      "Delete Google Sheet",
      `Are you sure you want to permanently delete '${file.name}' from your Google Drive? This operation is irreversible.`,
      "Delete Permanently",
      "danger",
      async () => {
        await deleteSpreadsheetFile(accessToken, file.id);
        showToast(`Deleted '${file.name}'`, "success");
        if (selectedSheetFile?.id === file.id) {
          setSelectedSheetFile(null);
          setSheetMetadata(null);
          setSheetRows([]);
        }
        await fetchSpreadsheets(accessToken);
      }
    );
  };

  // 4. Create New Spreadsheet with Telemetry / AI Logs / Sales Templates
  const handleCreateSpreadsheet = async () => {
    if (!accessToken) return;
    setIsCreating(true);
    try {
      let title = customTitle.trim() || "NEXUS Command Sheet";
      let tabTitle = "Overview";
      let headers: string[] = [];
      let initialRows: (string | number)[][] = [];

      if (selectedTemplate === "telemetry") {
        title = customTitle.trim() || `NEXUS-Telemetry-Log-${new Date().toISOString().slice(0, 10)}`;
        tabTitle = "Live Telemetry";
        headers = ["Timestamp", "Node ID", "CPU Load (%)", "Memory (%)", "Throughput (req/s)", "Latency (ms)", "Status"];
        initialRows = [
          [new Date().toLocaleTimeString(), "US-CENTRAL1-ALPHA", "34.2", "48.1", "1420", "12", "OPTIMAL"],
          [new Date().toLocaleTimeString(), "EU-WEST2-BETA", "42.8", "56.0", "980", "18", "OPTIMAL"],
          [new Date().toLocaleTimeString(), "AP-EAST1-GAMMA", "29.1", "38.5", "650", "34", "OPTIMAL"]
        ];
      } else if (selectedTemplate === "ai_experiments") {
        title = customTitle.trim() || `NEXUS-AI-Prompts-${new Date().toISOString().slice(0, 10)}`;
        tabTitle = "AI Benchmarks";
        headers = ["Timestamp", "Model", "Task Domain", "Prompt Snippet", "Temperature", "Latency (ms)", "Output Quality"];
        initialRows = [
          [new Date().toLocaleTimeString(), "Gemini 2.5 Pro", "Code Refactoring", "Optimize AST traversals", "0.2", "450", "Excellent"],
          [new Date().toLocaleTimeString(), "Gemini 2.5 Flash", "Micro-intent Classification", "Parse voice HUD triggers", "0.0", "110", "High Speed"],
          [new Date().toLocaleTimeString(), "Neural Agent Echo", "Document Synthesis", "Generate multi-lingual SLA contract", "0.4", "890", "Verified"]
        ];
      } else if (selectedTemplate === "sales") {
        title = customTitle.trim() || `NEXUS-Sales-Pipeline-${new Date().toISOString().slice(0, 10)}`;
        tabTitle = "Deals";
        headers = ["Deal ID", "Account Name", "Stage", "Contract Value ($)", "Win Probability (%)", "Lead Owner", "Close Date"];
        initialRows = [
          ["NX-901", "Cyberdyne Systems Corp", "Negotiation", "125000", "85", "Commander Alpha", "2026-09-30"],
          ["NX-902", "Acrostic Robotics", "Discovery", "64000", "50", "Director Beta", "2026-10-15"],
          ["NX-903", "Starlight Aerospace", "Contract Sent", "340000", "95", "Lead Gamma", "2026-08-31"]
        ];
      } else {
        headers = ["ID", "Category", "Item Name", "Value", "Notes", "Status"];
        initialRows = [
          ["1", "General", "Sample Record", "100", "Created via NEXUS", "Active"]
        ];
      }

      const created = await createNewSpreadsheet(accessToken, title, tabTitle, headers, initialRows);
      showToast(`Created spreadsheet '${title}'`, "success");
      setIsCreatingModal(false);
      setCustomTitle("");
      await fetchSpreadsheets(accessToken);
      
      const newFileObj: SpreadsheetFile = {
        id: created.spreadsheetId,
        name: created.properties.title,
        modifiedTime: new Date().toISOString(),
        webViewLink: created.spreadsheetUrl
      };
      loadSpreadsheet(newFileObj, accessToken);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to create spreadsheet", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredSpreadsheets = spreadsheets.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-nexus-accent/10 border border-nexus-accent/30 text-nexus-accent neon-glow">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                Google Sheets Integration Hub
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/30 font-mono">
                  LIVE API v4
                </span>
              </h1>
              <p className="text-sm text-nexus-text-dim">
                Real-time bidirectional synchronization with your Google Workspace spreadsheets & Drive
              </p>
            </div>
          </div>
        </div>

        {/* Auth Status / Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-nexus-border">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full rounded-full" />
                ) : (
                  (user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white truncate max-w-[150px]">{user.displayName || "Google Account"}</p>
                <p className="text-[10px] text-nexus-text-dim truncate max-w-[150px]">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                title="Disconnect Google Account"
                className="p-1.5 hover:bg-white/10 text-nexus-text-dim hover:text-red-400 rounded-lg transition-colors ml-2"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="gsi-material-button flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-medium shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <div className="gsi-material-button-icon w-5 h-5">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide">
                {isAuthenticating ? "Authenticating..." : "Sign in with Google"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium border ${
              statusMessage.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : statusMessage.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
            }`}
          >
            {statusMessage.type === "success" && <CheckCircle2 className="w-4 h-4" />}
            {statusMessage.type === "error" && <AlertTriangle className="w-4 h-4" />}
            {statusMessage.type === "info" && <ShieldCheck className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!user ? (
        /* Unauthenticated Splash Banner */
        <div className="glass rounded-2xl p-10 border border-nexus-border text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <FileSpreadsheet className="w-64 h-64 text-nexus-accent" />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-nexus-accent/10 border border-nexus-accent/30 text-nexus-accent flex items-center justify-center mx-auto neon-glow">
            <Layers className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Connect Your Google Workspace</h2>
            <p className="text-sm text-nexus-text-dim leading-relaxed">
              Review the integration card and sign in with your Google account to grant NEXUS permission to read, write, and organize Google Sheets directly within the command matrix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-4">
            <div className="p-4 rounded-xl glass border border-nexus-border/50">
              <Database className="w-5 h-5 text-nexus-accent mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Live Telemetry Sync</h4>
              <p className="text-xs text-nexus-text-dim">Stream command center metrics, CPU loads, and service states directly to spreadsheet logs.</p>
            </div>
            <div className="p-4 rounded-xl glass border border-nexus-border/50">
              <Sliders className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Interactive Cell Editor</h4>
              <p className="text-xs text-nexus-text-dim">Browse spreadsheet tabs, append records, edit ranges, and search across thousands of rows.</p>
            </div>
            <div className="p-4 rounded-xl glass border border-nexus-border/50">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Protected Mutation Rules</h4>
              <p className="text-xs text-nexus-text-dim">Explicit multi-step confirmation dialogs protect against accidental data overwrites or deletions.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="px-8 py-3.5 bg-nexus-accent hover:bg-white text-black font-bold rounded-xl transition-all shadow-xl neon-glow transform hover:scale-105 inline-flex items-center gap-3"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Connect Google Sheets API</span>
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Spreadsheets File Explorer */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass rounded-2xl border border-nexus-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-nexus-accent" />
                  Your Google Sheets
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-nexus-text-dim font-mono">
                    {spreadsheets.length}
                  </span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchSpreadsheets(accessToken!)}
                    disabled={isLoadingList}
                    title="Refresh List"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={() => setIsCreatingModal(true)}
                    className="px-3 py-1.5 bg-nexus-accent text-black font-bold text-xs rounded-lg hover:bg-white transition-all flex items-center gap-1.5 shadow-md neon-glow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Sheet</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-nexus-text-dim absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter spreadsheets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-nexus-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-nexus-text-dim focus:outline-none focus:border-nexus-accent/50"
                />
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {isLoadingList ? (
                  <div className="py-12 text-center text-nexus-text-dim space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-nexus-accent" />
                    <p className="text-xs">Querying Google Drive files...</p>
                  </div>
                ) : filteredSpreadsheets.length === 0 ? (
                  <div className="py-8 text-center text-nexus-text-dim space-y-2">
                    <FileSpreadsheet className="w-8 h-8 mx-auto text-nexus-text-dim/40" />
                    <p className="text-xs">No matching spreadsheets found</p>
                    <button
                      onClick={() => setIsCreatingModal(true)}
                      className="text-xs text-nexus-accent hover:underline"
                    >
                      + Create your first sheet
                    </button>
                  </div>
                ) : (
                  filteredSpreadsheets.map((file) => {
                    const isSelected = selectedSheetFile?.id === file.id;
                    return (
                      <div
                        key={file.id}
                        onClick={() => loadSpreadsheet(file)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between ${
                          isSelected
                            ? "bg-nexus-accent/10 border-nexus-accent/50 text-white shadow-lg"
                            : "bg-white/5 border-nexus-border hover:bg-white/10 text-nexus-text-dim hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-nexus-accent/20 text-nexus-accent" : "bg-white/5 text-nexus-text-dim"}`}>
                            <Table className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate text-white group-hover:text-nexus-accent transition-colors">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-nexus-text-dim truncate">
                              Modified {new Date(file.modifiedTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="Open in Google Sheets"
                              className="p-1 hover:bg-white/10 text-nexus-text-dim hover:text-nexus-accent rounded"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSpreadsheet(file);
                            }}
                            title="Delete Spreadsheet"
                            className="p-1 hover:bg-red-500/20 text-nexus-text-dim hover:text-red-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Export Cards */}
            <div className="glass rounded-2xl border border-nexus-border p-5 space-y-3">
              <h4 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-nexus-accent" />
                Quick Automation Exporters
              </h4>
              <p className="text-[11px] text-nexus-text-dim">
                Generate pre-formatted operational worksheets with continuous telemetry feeds:
              </p>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedTemplate("telemetry");
                    setCustomTitle(`NEXUS-Telemetry-Log-${new Date().toISOString().slice(0, 10)}`);
                    setIsCreatingModal(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-nexus-border transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-nexus-accent" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-nexus-accent transition-colors">Cluster Telemetry Matrix</p>
                      <p className="text-[10px] text-nexus-text-dim">Logs CPU, RAM, Latency, and Nodes</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-nexus-text-dim group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setSelectedTemplate("ai_experiments");
                    setCustomTitle(`NEXUS-AI-Prompts-${new Date().toISOString().slice(0, 10)}`);
                    setIsCreatingModal(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-nexus-border transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">AI Prompt & Token Log</p>
                      <p className="text-[10px] text-nexus-text-dim">Prompt scores, parameters, and timings</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-nexus-text-dim group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Spreadsheet Viewer & Editor */}
          <div className="lg:col-span-8 space-y-6">
            {selectedSheetFile ? (
              <div className="glass rounded-2xl border border-nexus-border p-6 space-y-6">
                {/* Spreadsheet Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-nexus-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {sheetMetadata?.properties?.title || selectedSheetFile.name}
                      </h2>
                      {selectedSheetFile.webViewLink && (
                        <a
                          href={selectedSheetFile.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded-md bg-nexus-accent/10 hover:bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/30 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Open in Sheets</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-nexus-text-dim">
                      Spreadsheet ID: <span className="font-mono text-nexus-accent">{selectedSheetFile.id}</span>
                    </p>
                  </div>

                  {/* Sheet Tab Switcher */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {sheetMetadata?.sheets?.map((sheet) => {
                      const tabTitle = sheet.properties.title;
                      const isActive = activeTabName === tabTitle;
                      return (
                        <button
                          key={sheet.properties.sheetId}
                          onClick={() => handleTabChange(tabTitle)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? "bg-nexus-accent text-black neon-glow"
                              : "bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white"
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>{tabTitle}</span>
                        </button>
                      );
                    })}

                    <button
                      onClick={() => loadTabValues(selectedSheetFile.id, activeTabName)}
                      disabled={isLoadingData}
                      title="Reload Table Data"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Data Grid Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4 text-nexus-accent" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Tab Data: {activeTabName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-nexus-text-dim font-mono">
                        {sheetRows.length > 0 ? `${sheetRows.length - 1} records` : "0 records"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {sheetRows.length > 1 && (
                        <button
                          onClick={handleClearSheet}
                          className="text-xs px-2.5 py-1 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear Records</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {isLoadingData ? (
                    <div className="py-20 text-center text-nexus-text-dim space-y-3">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-nexus-accent" />
                      <p className="text-xs">Fetching cell values from Google Sheets API...</p>
                    </div>
                  ) : sheetRows.length === 0 ? (
                    <div className="py-16 text-center text-nexus-text-dim space-y-2 border border-dashed border-nexus-border rounded-xl">
                      <FilePlus className="w-8 h-8 mx-auto text-nexus-text-dim/40" />
                      <p className="text-xs">This sheet tab has no data or is empty.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-nexus-border bg-black/40 max-h-[380px] overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        {/* Table Header */}
                        <thead>
                          <tr className="bg-nexus-accent/10 border-b border-nexus-border sticky top-0 backdrop-blur-md">
                            <th className="py-2.5 px-3 font-mono text-[10px] text-nexus-text-dim border-r border-nexus-border/50 w-10 text-center">
                              #
                            </th>
                            {sheetRows[0]?.map((header, colIndex) => (
                              <th
                                key={colIndex}
                                className="py-2.5 px-4 font-bold text-white tracking-wide border-r border-nexus-border/50 last:border-r-0 uppercase text-[11px]"
                              >
                                {header || `Col ${colIndex + 1}`}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-nexus-border/40">
                          {sheetRows.slice(1).map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="hover:bg-white/5 transition-colors group font-sans"
                            >
                              <td className="py-2 px-3 font-mono text-[10px] text-nexus-text-dim border-r border-nexus-border/40 text-center">
                                {rowIndex + 1}
                              </td>
                              {sheetRows[0]?.map((_, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="py-2 px-4 text-nexus-text border-r border-nexus-border/40 last:border-r-0 truncate max-w-[200px]"
                                >
                                  {row[colIndex] !== undefined && row[colIndex] !== "" ? (
                                    <span>{row[colIndex]}</span>
                                  ) : (
                                    <span className="text-nexus-text-dim/40 italic">-</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Append Row Section */}
                {sheetRows.length > 0 && (
                  <div className="glass rounded-xl border border-nexus-border p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 text-nexus-accent" />
                        Append Row to &apos;{activeTabName}&apos;
                      </h4>
                      <span className="text-[10px] text-nexus-text-dim">
                        Requires user authorization before commit
                      </span>
                    </div>

                    <form onSubmit={handleAppendRowSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {sheetRows[0]?.map((header, idx) => (
                          <div key={idx} className="space-y-1">
                            <label className="text-[10px] font-mono text-nexus-text-dim block truncate uppercase">
                              {header || `Column ${idx + 1}`}
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter ${header || 'value'}...`}
                              value={newRowData[header] || ""}
                              onChange={(e) =>
                                setNewRowData((prev) => ({ ...prev, [header]: e.target.value }))
                              }
                              className="w-full bg-white/5 border border-nexus-border rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-nexus-text-dim/50 focus:outline-none focus:border-nexus-accent"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={isAppending}
                          className="px-5 py-2 bg-nexus-accent text-black font-bold text-xs rounded-lg hover:bg-white transition-all shadow-md neon-glow flex items-center gap-2 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Append Row to Sheet</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass rounded-2xl border border-nexus-border p-12 text-center space-y-4">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-nexus-accent/40" />
                <h3 className="text-lg font-bold text-white">Select a Google Sheet to Inspect</h3>
                <p className="text-xs text-nexus-text-dim max-w-sm mx-auto">
                  Pick any spreadsheet from your Google Drive on the left or create a new automated sheet template.
                </p>
                <button
                  onClick={() => setIsCreatingModal(true)}
                  className="px-4 py-2 bg-nexus-accent text-black font-bold text-xs rounded-lg hover:bg-white transition-all inline-flex items-center gap-2 neon-glow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Spreadsheet</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Spreadsheet Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass border border-nexus-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-nexus-border">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-nexus-accent" />
                Create New Google Sheet
              </h3>
              <button
                onClick={() => setIsCreatingModal(false)}
                className="text-nexus-text-dim hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">Spreadsheet Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Growth Telemetry"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white/5 border border-nexus-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-nexus-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white block">Choose Initial Schema Template</label>
                <div className="space-y-2">
                  <label
                    onClick={() => setSelectedTemplate("telemetry")}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedTemplate === "telemetry"
                        ? "bg-nexus-accent/10 border-nexus-accent text-white"
                        : "bg-white/5 border-nexus-border text-nexus-text-dim"
                    }`}
                  >
                    <Database className="w-4 h-4 text-nexus-accent shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Cluster Telemetry Log</p>
                      <p className="text-[10px] text-nexus-text-dim">Timestamp, Node ID, CPU %, RAM %, Latency, Status</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setSelectedTemplate("ai_experiments")}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedTemplate === "ai_experiments"
                        ? "bg-nexus-accent/10 border-nexus-accent text-white"
                        : "bg-white/5 border-nexus-border text-nexus-text-dim"
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">AI Benchmarks & Token Log</p>
                      <p className="text-[10px] text-nexus-text-dim">Model, Prompt Snippet, Temp, Latency, Output Quality</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setSelectedTemplate("sales")}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedTemplate === "sales"
                        ? "bg-nexus-accent/10 border-nexus-accent text-white"
                        : "bg-white/5 border-nexus-border text-nexus-text-dim"
                    }`}
                  >
                    <Table className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Sales & Enterprise Pipeline</p>
                      <p className="text-[10px] text-nexus-text-dim">Deal ID, Account, Stage, Contract Value, Win Probability</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-nexus-border">
              <button
                onClick={() => setIsCreatingModal(false)}
                disabled={isCreating}
                className="px-4 py-2 text-xs font-medium text-nexus-text-dim hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSpreadsheet}
                disabled={isCreating}
                className="px-5 py-2.5 bg-nexus-accent text-black font-bold text-xs rounded-xl hover:bg-white transition-all flex items-center gap-2 neon-glow disabled:opacity-50"
              >
                {isCreating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Create in Google Drive</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal for Destructive / Mutating Actions */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmLabel={confirmConfig.confirmLabel}
        confirmVariant={confirmConfig.confirmVariant}
        onConfirm={handleModalConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        isProcessing={isModalProcessing}
      />
    </div>
  );
};
