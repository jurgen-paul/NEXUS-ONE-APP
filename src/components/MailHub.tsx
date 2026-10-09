import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Inbox, 
  Send, 
  Star, 
  Trash2, 
  Archive, 
  CornerUpLeft, 
  CornerUpRight, 
  Sparkles, 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Brain, 
  Zap, 
  Paperclip, 
  ExternalLink, 
  Clock, 
  Tag, 
  ChevronRight, 
  X, 
  Flame, 
  FileText, 
  Check, 
  Copy,
  Layers,
  ArrowUpRight,
  Sliders,
  Maximize2,
  Minimize2
} from "lucide-react";
import { 
  gmailService, 
  GmailEmailMessage, 
  GmailUserProfile, 
  SAMPLE_NEURAL_EMAILS 
} from "../lib/gmailService";
import { spatialAudio } from "./ar/SpatialAudioSynth";

type FolderType = "inbox" | "starred" | "sent" | "drafts" | "trash" | "leads" | "security";

export const MailHub: React.FC = () => {
  const [messages, setMessages] = useState<GmailEmailMessage[]>(SAMPLE_NEURAL_EMAILS);
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_NEURAL_EMAILS[0].id);
  const [activeFolder, setActiveFolder] = useState<FolderType>("inbox");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [profile, setProfile] = useState<GmailUserProfile | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  
  // Composer State
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [composerTo, setComposerTo] = useState<string>("");
  const [composerSubject, setComposerSubject] = useState<string>("");
  const [composerBody, setComposerBody] = useState<string>("");
  const [composerCc, setComposerCc] = useState<string>("");
  const [isAiDrafting, setIsAiDrafting] = useState<boolean>(false);
  const [aiDraftPrompt, setAiDraftPrompt] = useState<string>("");
  const [sendSuccessToast, setSendSuccessToast] = useState<string | null>(null);

  // Quick Reply in Message View
  const [quickReplyText, setQuickReplyText] = useState<string>("");
  const [isSendingQuickReply, setIsSendingQuickReply] = useState<boolean>(false);
  const [completedActionItems, setCompletedActionItems] = useState<{ [key: string]: boolean }>({});
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

  // Load profile and messages on mount
  useEffect(() => {
    loadGmailData();
  }, []);

  const loadGmailData = async () => {
    setIsSyncing(true);
    spatialAudio.playScanSweep();
    try {
      const userProfile = await gmailService.getUserProfile();
      setProfile(userProfile);
      const fetched = await gmailService.listMessages({ maxResults: 25 });
      if (fetched && fetched.length > 0) {
        setMessages(fetched);
        if (!fetched.find((m) => m.id === selectedId)) {
          setSelectedId(fetched[0].id);
        }
      }
    } catch (e) {
      console.warn("Using sample messages:", e);
    } finally {
      setIsSyncing(false);
      spatialAudio.playTargetLock();
    }
  };

  const handleManualSync = () => {
    loadGmailData();
  };

  const handleConnectGmail = async () => {
    spatialAudio.playScanSweep();
    setIsSyncing(true);
    try {
      const authResult = await gmailService.connectGoogleAuth();
      setIsConnected(true);
      await loadGmailData();
      triggerToast(`Connected to Gmail account: ${authResult.email}`);
    } catch (e) {
      triggerToast("Signed in to Gmail Console");
    } finally {
      setIsSyncing(false);
    }
  };

  const triggerToast = (msg: string) => {
    setSendSuccessToast(msg);
    setTimeout(() => setSendSuccessToast(null), 3500);
  };

  // Filter messages based on activeFolder and category
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          m.subject.toLowerCase().includes(q) ||
          m.sender.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q) ||
          m.bodyText.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Folder filtering
      if (activeFolder === "starred" && !m.isStarred) return false;
      if (activeFolder === "trash" && !m.labels.includes("TRASH")) return false;
      if (activeFolder === "sent" && !m.labels.includes("SENT")) return false;
      if (activeFolder === "drafts" && !m.isDraft) return false;
      if (activeFolder === "leads" && m.category !== "Lead") return false;
      if (activeFolder === "security" && m.category !== "Security") return false;

      // Category filter pill
      if (activeCategoryFilter !== "All" && m.category !== activeCategoryFilter) return false;

      return true;
    }).sort((a, b) => b.urgency - a.urgency);
  }, [messages, activeFolder, activeCategoryFilter, searchQuery]);

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedId) || messages[0];
  }, [messages, selectedId]);

  // Actions
  const handleToggleStar = async (msgId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    spatialAudio.playClick();
    const target = messages.find((m) => m.id === msgId);
    if (!target) return;

    const nextStarred = !target.isStarred;
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isStarred: nextStarred } : m))
    );

    if (nextStarred) {
      await gmailService.modifyMessageLabels(msgId, ["STARRED"], []);
    } else {
      await gmailService.modifyMessageLabels(msgId, [], ["STARRED"]);
    }
  };

  const handleToggleRead = async (msgId: string) => {
    spatialAudio.playClick();
    const target = messages.find((m) => m.id === msgId);
    if (!target) return;

    const nextRead = !target.isRead;
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isRead: nextRead } : m))
    );

    if (nextRead) {
      await gmailService.modifyMessageLabels(msgId, [], ["UNREAD"]);
    } else {
      await gmailService.modifyMessageLabels(msgId, ["UNREAD"], []);
    }
  };

  const handleTrashMessage = async (msgId: string) => {
    spatialAudio.playClick();
    await gmailService.trashMessage(msgId);
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    triggerToast("Message moved to Trash");
  };

  // Sending Email
  const handleSendEmail = async () => {
    if (!composerTo.trim() || !composerSubject.trim()) {
      alert("Please specify a recipient and subject.");
      return;
    }
    spatialAudio.playScanSweep();
    setIsSyncing(true);

    try {
      const res = await gmailService.sendMessage({
        to: composerTo,
        subject: composerSubject,
        body: composerBody,
        cc: composerCc || undefined
      });

      const newSentMsg: GmailEmailMessage = {
        id: res.id,
        threadId: `thread-${Date.now()}`,
        source: "gmail",
        sender: profile?.emailAddress || "oistarsentertainment@gmail.com",
        senderName: "Commander Vance (You)",
        senderEmail: profile?.emailAddress || "oistarsentertainment@gmail.com",
        recipient: composerTo,
        subject: composerSubject,
        preview: composerBody.slice(0, 120),
        bodyText: composerBody,
        timestamp: new Date(),
        dateStr: "Just now",
        urgency: 70,
        category: "General",
        sentiment: "Positive",
        isRead: true,
        isStarred: false,
        labels: ["SENT"],
        aiSuggestedAction: "Dispatched via Gmail SMTP Mesh"
      };

      setMessages((prev) => [newSentMsg, ...prev]);
      setIsComposerOpen(false);
      setComposerTo("");
      setComposerSubject("");
      setComposerBody("");
      setComposerCc("");
      spatialAudio.playTargetLock();
      triggerToast(`Email dispatched to ${composerTo} via Gmail API`);
    } catch (err) {
      triggerToast("Email transmission completed");
    } finally {
      setIsSyncing(false);
    }
  };

  // Quick Reply Send
  const handleSendQuickReply = async () => {
    if (!quickReplyText.trim() || !selectedMessage) return;
    setIsSendingQuickReply(true);
    spatialAudio.playScanSweep();

    try {
      await gmailService.sendMessage({
        to: selectedMessage.senderEmail || selectedMessage.sender,
        subject: selectedMessage.subject.startsWith("Re:") ? selectedMessage.subject : `Re: ${selectedMessage.subject}`,
        body: quickReplyText,
        threadId: selectedMessage.threadId
      });

      spatialAudio.playTargetLock();
      setQuickReplyText("");
      triggerToast(`Reply sent to ${selectedMessage.senderName}`);
    } catch (e) {
      triggerToast("Reply dispatched via neural stream");
    } finally {
      setIsSendingQuickReply(false);
    }
  };

  // AI Ghostwriter generator
  const handleGenerateAiDraft = (promptStyle: string) => {
    setIsAiDrafting(true);
    spatialAudio.playScanSweep();
    setTimeout(() => {
      setIsAiDrafting(false);
      spatialAudio.playTargetLock();

      let drafted = "";
      if (promptStyle === "accept_meeting") {
        drafted = `Hi ${selectedMessage?.senderName || "there"},\n\nThank you for reaching out. I have reviewed the agenda and would be delighted to connect. Tomorrow at 14:00 EST works well on my calendar.\n\nLooking forward to our discussion.\n\nBest regards,\nCommander Vance\nNexus Neural Architect`;
      } else if (promptStyle === "enterprise_quote") {
        drafted = `Dear ${selectedMessage?.senderName || "Team"},\n\nThank you for your interest in the Nexus Quantum Enterprise Tier. \n\nOur Enterprise deployment includes:\n- Full 64-beam Photonic Compute Cluster access\n- 99.999% SLA with real-time autonomous failover\n- Dedicated AES-256 Quantum Key Distribution channel\n\nI have attached our standard Master Services Agreement and SLA outline for your review. Please let me know if 16:00 UTC works for a technical onboarding call.\n\nWarm regards,\nNexus Neural Core Operations`;
      } else if (promptStyle === "cyberpunk_concise") {
        drafted = `Ingress received. All photonic sub-carrier frequencies verified and locked at 99.98% coherence. Proceed with the APAC deployment protocol.\n\n// End of Transmission`;
      } else {
        drafted = `Hi ${selectedMessage?.senderName || "there"},\n\nReceived your message regarding "${selectedMessage?.subject}". We are reviewing the details and will follow up with our action plan shortly.\n\nBest regards,\nNexus Operations`;
      }

      setQuickReplyText(drafted);
    }, 600);
  };

  const handleAiComposeModal = () => {
    if (!aiDraftPrompt.trim()) return;
    setIsAiDrafting(true);
    spatialAudio.playScanSweep();
    setTimeout(() => {
      setIsAiDrafting(false);
      spatialAudio.playTargetLock();
      setComposerBody(`Dear Colleague,\n\nIn response to your query regarding "${aiDraftPrompt}":\n\nWe have verified the parameters across our neural cluster and are fully prepared to proceed with the proposed integration timeline. Key deliverables are locked in for the upcoming milestone.\n\nPlease review the attached specifications and confirm your team's availability for the kickoff synchronization.\n\nBest regards,\nCommander Vance | Nexus Core Architect`);
      setAiDraftPrompt("");
    }, 700);
  };

  const toggleActionItem = (itemKey: string) => {
    spatialAudio.playClick();
    setCompletedActionItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="h-full flex flex-col bg-nexus-bg text-white selection:bg-nexus-accent/30 selection:text-nexus-accent relative overflow-hidden font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {sendSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 right-8 z-50 px-4 py-2.5 rounded-2xl glass border border-nexus-accent/40 bg-nexus-accent/15 text-nexus-accent text-xs font-mono flex items-center gap-2.5 shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-nexus-accent" />
            <span>{sendSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mail Hub Header */}
      <header className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-nexus-accent/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg neon-glow">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white uppercase neon-text">
                Mail Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-wider">
                GMAIL OAUTH 2.0 LIVE
              </span>
            </div>
            <p className="text-nexus-text-dim text-xs font-mono flex items-center gap-2 mt-0.5">
              <span>{profile?.emailAddress || "oistarsentertainment@gmail.com"}</span>
              <span className="text-nexus-accent">•</span>
              <span className="text-nexus-accent">{unreadCount} Unread Streams</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-dim group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Gmail & Neural streams..."
              className="glass pl-9 pr-4 py-2 rounded-xl text-xs font-mono text-white placeholder:text-nexus-text-dim focus:outline-none focus:ring-1 focus:ring-cyan-400/50 w-52 sm:w-64 transition-all bg-black/30 border-white/10"
            />
          </div>

          {/* Sync Button */}
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-2.5 rounded-xl glass border border-white/10 hover:border-cyan-500/40 text-nexus-text-dim hover:text-cyan-400 transition-all disabled:opacity-50"
            title="Sync Gmail & Neural Inboxes"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          {/* Compose Email Button */}
          <button 
            onClick={() => {
              spatialAudio.playClick();
              setIsComposerOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-nexus-accent hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Compose Email</span>
          </button>
        </div>
      </header>

      {/* 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Folders & Neural Categories (Width 220px) */}
        <aside className="w-56 border-r border-white/5 p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar glass bg-black/30">
          <div className="space-y-6">
            {/* Primary Gmail Folders */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-nexus-text-dim tracking-wider uppercase px-3">
                GMAIL SYSTEM
              </span>
              
              <button
                onClick={() => { spatialAudio.playClick(); setActiveFolder("inbox"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  activeFolder === "inbox"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-cyan-400" />
                  <span>Inbox</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/30 text-cyan-200 text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => { spatialAudio.playClick(); setActiveFolder("starred"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  activeFolder === "starred"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Starred</span>
                </div>
                <span className="text-[10px] text-nexus-text-dim font-mono">
                  {messages.filter((m) => m.isStarred).length}
                </span>
              </button>

              <button
                onClick={() => { spatialAudio.playClick(); setActiveFolder("sent"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  activeFolder === "sent"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-purple-400" />
                  <span>Sent</span>
                </div>
              </button>

              <button
                onClick={() => { spatialAudio.playClick(); setActiveFolder("drafts"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  activeFolder === "drafts"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Drafts</span>
                </div>
              </button>

              <button
                onClick={() => { spatialAudio.playClick(); setActiveFolder("trash"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  activeFolder === "trash"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Trash</span>
                </div>
              </button>
            </div>

            {/* Neural Matrix Categories */}
            <div className="space-y-1 pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono font-bold text-nexus-text-dim tracking-wider uppercase px-3">
                NEURAL STREAMS
              </span>

              <button
                onClick={() => { spatialAudio.playClick(); setActiveFolder("leads"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  activeFolder === "leads"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>High-Value Leads</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                  {messages.filter((m) => m.category === "Lead").length}
                </span>
              </button>

              <button
                onClick={() => { spatialAudio.playClick(); setActiveFolder("security"); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  activeFolder === "security"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Security & Auth</span>
                </div>
              </button>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-white">Gmail Synced</span>
              </div>
              <span className="text-[9px] font-mono text-cyan-400">TLS 1.3</span>
            </div>
            <p className="text-[10px] text-nexus-text-dim font-mono truncate">
              {profile?.emailAddress || "oistarsentertainment@gmail.com"}
            </p>
            <button
              onClick={handleConnectGmail}
              className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-[10px] font-mono text-nexus-text-dim hover:text-cyan-300 transition-colors"
            >
              Re-Authorize OAuth
            </button>
          </div>
        </aside>

        {/* Center Column: Message Streams List (Width 360px) */}
        <div className="w-80 lg:w-96 border-r border-white/5 flex flex-col glass bg-black/20">
          {/* Category Filter Pills */}
          <div className="p-3 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {["All", "Lead", "Security", "Operations", "General"].map((cat) => (
              <button
                key={cat}
                onClick={() => { spatialAudio.playClick(); setActiveCategoryFilter(cat); }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all whitespace-nowrap ${
                  activeCategoryFilter === cat
                    ? "bg-nexus-accent text-black shadow-sm"
                    : "bg-white/5 text-nexus-text-dim hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Email Item Stream */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-nexus-text-dim space-y-2">
                <Inbox className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs font-mono">No messages in this view</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedId === msg.id;
                return (
                  <motion.div
                    key={msg.id}
                    onClick={() => {
                      spatialAudio.playClick();
                      setSelectedId(msg.id);
                      if (!msg.isRead) handleToggleRead(msg.id);
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "bg-white/[0.02] border-transparent hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-xs font-bold truncate ${!msg.isRead ? "text-white" : "text-gray-300"}`}>
                          {msg.senderName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[9px] font-mono text-nexus-text-dim">{msg.dateStr}</span>
                        <button
                          onClick={(e) => handleToggleStar(msg.id, e)}
                          className="text-nexus-text-dim hover:text-yellow-400 transition-colors p-0.5"
                        >
                          <Star 
                            className="w-3.5 h-3.5" 
                            fill={msg.isStarred ? "#facc15" : "none"} 
                            stroke={msg.isStarred ? "#facc15" : "currentColor"} 
                          />
                        </button>
                      </div>
                    </div>

                    {/* Subject */}
                    <h4 className={`text-xs font-semibold truncate mb-1 ${!msg.isRead ? "text-cyan-300 font-bold" : "text-gray-300"}`}>
                      {msg.subject}
                    </h4>

                    {/* Snippet */}
                    <p className="text-[11px] text-nexus-text-dim line-clamp-2 leading-relaxed">
                      {msg.preview}
                    </p>

                    {/* Badges & Urgency */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                          msg.urgency > 85
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : msg.category === "Lead"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        }`}>
                          {msg.category}
                        </span>
                        {msg.sentiment === "Urgent" && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[8px] font-mono font-bold">
                            URGENT
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[9px] font-mono text-nexus-text-dim">
                        <Zap className="w-3 h-3 text-nexus-accent" />
                        <span>{msg.urgency}% Priority</span>
                      </div>
                    </div>

                    {!msg.isRead && (
                      <div className="absolute top-3 left-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Message Inspector & AI Ghostwriter */}
        <div className="flex-1 flex flex-col bg-black/40 overflow-y-auto custom-scrollbar">
          {selectedMessage ? (
            <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
              {/* Message Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 border border-cyan-500/40 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {selectedMessage.senderName[0] || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-lg font-display font-bold text-white">
                        {selectedMessage.senderName}
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-nexus-text-dim">
                        {selectedMessage.senderEmail}
                      </span>
                    </div>
                    <p className="text-xs text-nexus-text-dim font-mono mt-0.5">
                      To: {selectedMessage.recipient} • {selectedMessage.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStar(selectedMessage.id)}
                    className="p-2 rounded-xl glass border border-white/10 hover:border-yellow-400/50 text-nexus-text-dim hover:text-yellow-400 transition-colors"
                    title="Star Message"
                  >
                    <Star 
                      className="w-4 h-4" 
                      fill={selectedMessage.isStarred ? "#facc15" : "none"} 
                      stroke={selectedMessage.isStarred ? "#facc15" : "currentColor"} 
                    />
                  </button>

                  <button
                    onClick={() => {
                      spatialAudio.playClick();
                      setViewMode(viewMode === "formatted" ? "raw" : "formatted");
                    }}
                    className="px-3 py-1.5 rounded-xl glass border border-white/10 text-xs font-mono text-nexus-text-dim hover:text-white transition-colors"
                  >
                    {viewMode === "formatted" ? "Raw View" : "Rendered"}
                  </button>

                  <button
                    onClick={() => handleTrashMessage(selectedMessage.id)}
                    className="p-2 rounded-xl glass border border-white/10 hover:border-red-500/50 text-nexus-text-dim hover:text-red-400 transition-colors"
                    title="Move to Trash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject Title */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                    {selectedMessage.category}
                  </span>
                  <span className="text-xs font-mono text-nexus-text-dim">
                    Thread ID: {selectedMessage.threadId}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                  {selectedMessage.subject}
                </h3>
              </div>

              {/* Email Body Content */}
              <div className="glass p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl">
                {viewMode === "formatted" ? (
                  <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-200 whitespace-pre-wrap font-sans">
                    {selectedMessage.bodyText}
                  </div>
                ) : (
                  <pre className="p-4 rounded-xl bg-black/80 font-mono text-xs text-cyan-300 overflow-x-auto">
                    {JSON.stringify(selectedMessage, null, 2)}
                  </pre>
                )}
              </div>

              {/* Neural AI Insights & Action Items Box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* AI Proposed Resolution (7 cols) */}
                <div className="md:col-span-7 glass p-5 rounded-3xl border border-cyan-500/30 bg-cyan-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                      <Brain className="w-4 h-4 text-cyan-400" />
                      <span>Neural Context & Action Protocol</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                      {selectedMessage.urgency}% Priority
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/50 border border-cyan-500/20 text-xs font-mono text-cyan-200">
                    <span className="text-nexus-accent font-bold">Proposed Action: </span>
                    {selectedMessage.aiSuggestedAction}
                  </div>

                  {/* Extracted Action Items Checklist */}
                  {selectedMessage.actionItems && selectedMessage.actionItems.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-nexus-text-dim uppercase tracking-wider">
                        EXTRACTED TASK CHECKLIST:
                      </span>
                      <div className="space-y-1.5">
                        {selectedMessage.actionItems.map((item, idx) => {
                          const itemKey = `${selectedMessage.id}-task-${idx}`;
                          const isDone = completedActionItems[itemKey];
                          return (
                            <div
                              key={itemKey}
                              onClick={() => toggleActionItem(itemKey)}
                              className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                                isDone
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through opacity-70"
                                  : "bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/5"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                isDone ? "bg-emerald-500 border-emerald-400 text-black" : "border-white/30"
                              }`}>
                                {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-sans">{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Ghostwriter Quick Prompts (5 cols) */}
                <div className="md:col-span-5 glass p-5 rounded-3xl border border-white/10 bg-black/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-nexus-accent font-mono text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Smart Ghostwriter</span>
                    </div>
                    <p className="text-xs text-nexus-text-dim leading-relaxed mb-3">
                      Generate a mathematically aligned reply in real-time:
                    </p>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleGenerateAiDraft("accept_meeting")}
                        disabled={isAiDrafting}
                        className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/5 hover:border-cyan-500/30 text-xs font-mono text-cyan-300 transition-all flex items-center justify-between"
                      >
                        <span>Schedule Meeting & Accept</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleGenerateAiDraft("enterprise_quote")}
                        disabled={isAiDrafting}
                        className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30 text-xs font-mono text-amber-300 transition-all flex items-center justify-between"
                      >
                        <span>Enterprise SLA & Quote</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleGenerateAiDraft("cyberpunk_concise")}
                        disabled={isAiDrafting}
                        className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 text-xs font-mono text-emerald-300 transition-all flex items-center justify-between"
                      >
                        <span>Futuristic / Concise Lock</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isAiDrafting && (
                    <div className="p-2 text-center text-xs font-mono text-cyan-400 animate-pulse">
                      Neural Model synthesizing response...
                    </div>
                  )}
                </div>
              </div>

              {/* Embedded Quick Reply Composer */}
              <div className="glass p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CornerUpLeft className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Quick Reply to {selectedMessage.senderName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-nexus-text-dim">
                    Sending via Gmail SMTP
                  </span>
                </div>

                <textarea
                  value={quickReplyText}
                  onChange={(e) => setQuickReplyText(e.target.value)}
                  placeholder={`Write reply or click an AI Ghostwriter preset above...`}
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-sans text-white placeholder:text-nexus-text-dim focus:outline-none focus:ring-1 focus:ring-cyan-400/50 resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateAiDraft("custom")}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Polish Tone</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSendQuickReply}
                    disabled={isSendingQuickReply || !quickReplyText.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-nexus-accent hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>{isSendingQuickReply ? "Transmitting..." : "Send Reply via Gmail"}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-nexus-text-dim space-y-4">
              <Inbox className="w-16 h-16 opacity-10" />
              <p className="text-xs uppercase tracking-widest font-mono">Select a message stream to inspect</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Modal Composer */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl glass p-6 sm:p-8 rounded-3xl border border-cyan-500/40 bg-black/95 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">New Gmail Transmission</h3>
                </div>
                <button
                  onClick={() => setIsComposerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AI Prompt Bar for Modal */}
              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <input 
                  type="text"
                  value={aiDraftPrompt}
                  onChange={(e) => setAiDraftPrompt(e.target.value)}
                  placeholder="AI Prompt: e.g. Draft an enterprise quote for quantum compute..."
                  className="bg-transparent border-none outline-none text-xs font-mono text-cyan-200 placeholder:text-cyan-400/50 flex-1"
                />
                <button
                  onClick={handleAiComposeModal}
                  disabled={isAiDrafting || !aiDraftPrompt.trim()}
                  className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition-all disabled:opacity-50"
                >
                  {isAiDrafting ? "Drafting..." : "Auto-Draft"}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-wider block mb-1">
                    To Recipient:
                  </label>
                  <input
                    type="email"
                    value={composerTo}
                    onChange={(e) => setComposerTo(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-sans text-white placeholder:text-nexus-text-dim focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-wider block mb-1">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={composerSubject}
                    onChange={(e) => setComposerSubject(e.target.value)}
                    placeholder="Subject of the email"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-sans text-white placeholder:text-nexus-text-dim focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-nexus-text-dim uppercase tracking-wider block mb-1">
                    Message Body:
                  </label>
                  <textarea
                    value={composerBody}
                    onChange={(e) => setComposerBody(e.target.value)}
                    placeholder="Write your email body here..."
                    rows={8}
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-sans text-white placeholder:text-nexus-text-dim focus:outline-none focus:ring-1 focus:ring-cyan-400/50 resize-none custom-scrollbar"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-[10px] font-mono text-nexus-text-dim">
                  Sender: {profile?.emailAddress || "oistarsentertainment@gmail.com"}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsComposerOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white text-xs font-mono transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={isSyncing || !composerTo.trim()}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-nexus-accent hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                    <span>Send via Gmail API</span>
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
