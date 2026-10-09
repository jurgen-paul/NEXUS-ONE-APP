import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Code, 
  Sparkles, 
  Smile, 
  MoreVertical, 
  Hash, 
  Volume2, 
  Play, 
  Pause, 
  Check, 
  CheckCheck, 
  Users, 
  Pin, 
  Search, 
  Bot, 
  Zap, 
  Flame, 
  Crown, 
  Tv, 
  DollarSign, 
  Share2,
  FileCode,
  Image as ImageIcon,
  ThumbsUp,
  Heart,
  HelpCircle,
  X
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: "OWNER" | "ADMIN" | "CREATOR" | "AI" | "PRODUCER";
  channelId: string;
  content: string;
  timestamp: string;
  type?: "text" | "audio" | "code" | "deal" | "image";
  audioDuration?: string;
  codeSnippet?: {
    lang: string;
    code: string;
  };
  dealData?: {
    title: string;
    budget: string;
    creator: string;
    status: "OPEN" | "CLAIMED" | "PAID";
  };
  reactions: { emoji: string; count: number; users: string[] }[];
  pinned?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  topic: string;
  icon: any;
  unreadCount: number;
  category: "PRIMARY" | "ENTERTAINMENT" | "BUSINESS" | "TECH";
  membersCount: number;
}

const INITIAL_CHANNELS: ChatChannel[] = [
  { id: "general-hq", name: "general-hq", topic: "Executive briefings, operations & workspace coordination", icon: Hash, unreadCount: 0, category: "PRIMARY", membersCount: 14 },
  { id: "showbiz-buzz", name: "showbiz-buzz", topic: "Celebrity news, Hollywood scoops, movie premieres & VIP gossip", icon: Flame, unreadCount: 3, category: "ENTERTAINMENT", membersCount: 28 },
  { id: "influencer-deals", name: "influencer-deals", topic: "Talent contracts, sponsorship negotiations & creator rates", icon: Crown, unreadCount: 1, category: "BUSINESS", membersCount: 19 },
  { id: "marketplace-gigs", name: "marketplace-gigs", topic: "Creator bounties, asset licensing & freelance exchanges", icon: DollarSign, unreadCount: 0, category: "BUSINESS", membersCount: 32 },
  { id: "content-studio", name: "content-studio", topic: "Blog outlines, video scripts, thumbnails & viral ideas", icon: Tv, unreadCount: 2, category: "ENTERTAINMENT", membersCount: 21 },
  { id: "dev-ops", name: "dev-ops", topic: "Neural mesh API, smart contracts, deployments & latency", icon: Zap, unreadCount: 0, category: "TECH", membersCount: 8 }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "showbiz-buzz": [
    {
      id: "m-sb1",
      senderId: "u2",
      senderName: "Chloe Rivera",
      senderAvatar: "CR",
      senderRole: "PRODUCER",
      channelId: "showbiz-buzz",
      content: "🚨 BREAKING: Warner Bros & Paramount just locked the $350M cyberpunk franchise rights! Trailer dropping during tonight's Global Stream Awards.",
      timestamp: "14:10",
      type: "text",
      reactions: [
        { emoji: "🔥", count: 8, users: ["u1", "u3", "u4"] },
        { emoji: "🍿", count: 12, users: ["u1", "u2"] }
      ],
      pinned: true
    },
    {
      id: "m-sb2",
      senderId: "u3",
      senderName: "Aura AI",
      senderAvatar: "AI",
      senderRole: "AI",
      channelId: "showbiz-buzz",
      content: "Neural Sentiment Index for the premiere is currently peaking at 94.2% Positive with 1.4M mentions across TikTok & X in the last 60 minutes.",
      timestamp: "14:12",
      type: "text",
      reactions: [
        { emoji: "⚡", count: 5, users: ["u1"] }
      ]
    },
    {
      id: "m-sb3",
      senderId: "u4",
      senderName: "Leo Vance",
      senderAvatar: "LV",
      senderRole: "CREATOR",
      channelId: "showbiz-buzz",
      content: "Just got access to the red carpet VIP media passes. Sending voice note on our backstage interview slots!",
      timestamp: "14:15",
      type: "audio",
      audioDuration: "0:38",
      reactions: [
        { emoji: "🎤", count: 6, users: ["u1", "u2"] }
      ]
    }
  ],
  "influencer-deals": [
    {
      id: "m-id1",
      senderId: "u5",
      senderName: "Marcus Sterling",
      senderAvatar: "MS",
      senderRole: "ADMIN",
      channelId: "influencer-deals",
      content: "New Brand Sponsorship Bounty posted for CyberHype Headphones! Check terms below:",
      timestamp: "13:40",
      type: "deal",
      dealData: {
        title: "CyberHype NeoWave Video Placement (TikTok + YouTube Shorts)",
        budget: "$12,500 + 15% Affiliate Cut",
        creator: "Open for 2M+ Reach Creators",
        status: "OPEN"
      },
      reactions: [
        { emoji: "💰", count: 9, users: ["u1", "u2"] },
        { emoji: "🚀", count: 4, users: ["u3"] }
      ],
      pinned: true
    },
    {
      id: "m-id2",
      senderId: "u1",
      senderName: "Oistarian Prime",
      senderAvatar: "OP",
      senderRole: "OWNER",
      channelId: "influencer-deals",
      content: "Approved the escrow contract for Elena Rostova's Tech Expo vlog series. Payout is automated on live metric trigger.",
      timestamp: "13:55",
      type: "text",
      reactions: [
        { emoji: "🤝", count: 7, users: ["u2", "u5"] }
      ]
    }
  ],
  "general-hq": [
    {
      id: "m-gh1",
      senderId: "u1",
      senderName: "Oistarian Prime",
      senderAvatar: "OP",
      senderRole: "OWNER",
      channelId: "general-hq",
      content: "Welcome everyone to the unified Nexus Collab multi-channel workspace! All creator gigs, showbiz feeds, live chatrooms, and marketplace smart contracts are live in real time.",
      timestamp: "12:00",
      type: "text",
      reactions: [
        { emoji: "🚀", count: 14, users: ["u1", "u2", "u3", "u4"] },
        { emoji: "💚", count: 11, users: ["u1"] }
      ],
      pinned: true
    },
    {
      id: "m-gh2",
      senderId: "u3",
      senderName: "Aura AI",
      senderAvatar: "AI",
      senderRole: "AI",
      channelId: "general-hq",
      content: "Automated neural sync active: Cloud Firestore, Google Sheets Hub, and Gmail APIs are linked with zero packet loss.",
      timestamp: "12:05",
      type: "text",
      reactions: [
        { emoji: "⚡", count: 4, users: ["u1"] }
      ]
    }
  ]
};

export const ChatroomTab: React.FC = () => {
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>("showbiz-buzz");
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeLang, setCodeLang] = useState("typescript");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [peerTyping, setPeerTyping] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const channelMessages = messages[activeChannelId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages]);

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Simulated peer reactions occasionally
  const triggerPeerReply = (topic: string) => {
    setTimeout(() => {
      setPeerTyping("Aura AI");
      setTimeout(() => {
        setPeerTyping(null);
        const replyText = 
          topic === "showbiz-buzz" 
            ? "⚡ Viral Trend Radar: Celebrity engagement spike detected on YouTube + Instagram (+320k impressions/hr)."
            : topic === "influencer-deals"
            ? "✨ Rate card verified: Market standard for this campaign sits between $8,500 - $14,000 with 18% ROI forecast."
            : "✅ Synced with Nexus Collab neural node. Logged to creator registry.";
        
        const newMsg: ChatMessage = {
          id: `m-${Date.now()}`,
          senderId: "u3",
          senderName: "Aura AI",
          senderAvatar: "AI",
          senderRole: "AI",
          channelId: activeChannelId,
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "text",
          reactions: [{ emoji: "🤖", count: 2, users: ["u1"] }]
        };

        setMessages(prev => ({
          ...prev,
          [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
        }));
        spatialAudio.playTargetLock();
      }, 2000);
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    spatialAudio.playClick();

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "u1",
      senderName: "Oistarian Prime",
      senderAvatar: "OP",
      senderRole: "OWNER",
      channelId: activeChannelId,
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text",
      reactions: []
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));

    const sentTopic = activeChannelId;
    setInputText("");
    triggerPeerReply(sentTopic);
  };

  const handleSendVoiceNote = () => {
    spatialAudio.playScanSweep();
    setIsRecordingVoice(false);
    const durationStr = `0:${recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}`;
    
    const newMsg: ChatMessage = {
      id: `msg-voice-${Date.now()}`,
      senderId: "u1",
      senderName: "Oistarian Prime",
      senderAvatar: "OP",
      senderRole: "OWNER",
      channelId: activeChannelId,
      content: "Voice dispatch encrypted with Nexus Spatial Audio codec.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "audio",
      audioDuration: durationStr,
      reactions: [{ emoji: "🎙️", count: 1, users: ["u1"] }]
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));
  };

  const handleSendCode = () => {
    if (!codeSnippet.trim()) return;
    spatialAudio.playTargetLock();
    setShowCodeModal(false);

    const newMsg: ChatMessage = {
      id: `msg-code-${Date.now()}`,
      senderId: "u1",
      senderName: "Oistarian Prime",
      senderAvatar: "OP",
      senderRole: "OWNER",
      channelId: activeChannelId,
      content: `Shared snippet (${codeLang})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "code",
      codeSnippet: {
        lang: codeLang,
        code: codeSnippet
      },
      reactions: [{ emoji: "💻", count: 3, users: ["u1", "u2"] }]
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));
    setCodeSnippet("");
  };

  const handleReaction = (msgId: string, emoji: string) => {
    spatialAudio.playClick();
    setMessages(prev => {
      const curList = prev[activeChannelId] || [];
      const updated = curList.map(m => {
        if (m.id !== msgId) return m;
        const existingRx = m.reactions.find(r => r.emoji === emoji);
        if (existingRx) {
          return {
            ...m,
            reactions: m.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...m,
            reactions: [...m.reactions, { emoji, count: 1, users: ["u1"] }]
          };
        }
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  const handleAiGhostwrite = () => {
    spatialAudio.playScanSweep();
    setIsAiDrafting(true);
    setTimeout(() => {
      let promptSuggestion = "";
      if (activeChannelId === "showbiz-buzz") {
        promptSuggestion = "Just analyzed the streaming box office numbers—we should draft an exclusive reaction reel featuring the top 3 highlights before midnight.";
      } else if (activeChannelId === "influencer-deals") {
        promptSuggestion = "Offering a 2-tier sponsorship contract with a $15k guarantee and performance-based commission. Reviewing the media kit now.";
      } else {
        promptSuggestion = "Synced with the project roadmap. All creator deliverables and asset pipelines are on schedule for the Friday launch.";
      }
      setInputText(promptSuggestion);
      setIsAiDrafting(false);
      spatialAudio.playTargetLock();
    }, 700);
  };

  const handleGenerateSummary = () => {
    spatialAudio.playScanSweep();
    setIsSummarizing(true);
    setTimeout(() => {
      const summary = `📌 Channel Catchup (${activeChannel.name}):\n• Active discussion on high-value showbiz trends and brand partnerships.\n• Sentiment remains over 90% positive across all tracked streams.\n• Action Item: 2 contract proposals pending review in marketplace hub.`;
      setAiSummary(summary);
      setIsSummarizing(false);
      spatialAudio.playTargetLock();
    }, 900);
  };

  const filteredMessages = channelMessages.filter(m => 
    !searchQuery || 
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col lg:flex-row bg-[#080d1a] text-white rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* 1. Left Channel Directory */}
      <div className="w-full lg:w-72 bg-[#0b1224] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-nexus-accent/10 border border-nexus-accent/30 flex items-center justify-center text-nexus-accent">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Comms Matrix</h3>
              <p className="text-[10px] font-mono text-nexus-accent flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-nexus-accent animate-pulse" />
                Live Mesh Sync
              </p>
            </div>
          </div>
          <button 
            onClick={handleGenerateSummary}
            title="Generate AI Channel Briefing"
            className="p-1.5 bg-white/5 hover:bg-nexus-accent/20 hover:text-nexus-accent border border-white/10 rounded-lg text-nexus-text-dim transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Channel Categories */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
          <div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-nexus-text-dim px-2 mb-2">
              Primary Streams
            </div>
            <div className="space-y-1">
              {channels.map(ch => {
                const IconComponent = ch.icon;
                const isActive = ch.id === activeChannelId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      spatialAudio.playClick();
                      setActiveChannelId(ch.id);
                      setAiSummary(null);
                    }}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between transition-all group",
                      isActive 
                        ? "bg-nexus-accent/15 border border-nexus-accent/30 text-white shadow-[0_0_15px_rgba(5,255,161,0.15)]" 
                        : "hover:bg-white/5 text-nexus-text-dim hover:text-white border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-nexus-accent" : "text-nexus-text-dim group-hover:text-white"
                      )} />
                      <div className="truncate">
                        <span className={cn("text-xs font-mono font-bold block truncate", isActive ? "text-nexus-accent" : "text-white")}>
                          #{ch.name}
                        </span>
                        <span className="text-[9px] text-nexus-text-dim truncate block">
                          {ch.membersCount} connected
                        </span>
                      </div>
                    </div>
                    {ch.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold font-mono bg-nexus-accent text-black rounded-full shadow-[0_0_8px_rgba(5,255,161,0.5)]">
                        {ch.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Squad Online Presence */}
          <div className="pt-2 border-t border-white/5">
            <div className="text-[9px] font-mono uppercase tracking-widest text-nexus-text-dim px-2 mb-2 flex items-center justify-between">
              <span>Squad Presence</span>
              <span className="text-nexus-accent font-bold">4 Live</span>
            </div>
            <div className="space-y-1.5 px-1">
              {[
                { name: "Oistarian Prime", role: "Owner", avatar: "OP", status: "online", color: "bg-emerald-400" },
                { name: "Aura AI", role: "Autonomous Agent", avatar: "AI", status: "online", color: "bg-nexus-accent animate-pulse" },
                { name: "Chloe Rivera", role: "Showbiz Producer", avatar: "CR", status: "busy", color: "bg-amber-400" },
                { name: "Leo Vance", role: "Influencer Lead", avatar: "LV", status: "online", color: "bg-emerald-400" },
              ].map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all text-xs">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-md bg-white/10 text-[10px] font-bold flex items-center justify-center text-white">
                      {p.avatar}
                    </div>
                    <span className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black", p.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{p.name}</div>
                    <div className="text-[9px] text-nexus-text-dim truncate">{p.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#080d1a]">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 bg-[#0b1224]/80 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-nexus-accent/10 border border-nexus-accent/20 flex items-center justify-center text-nexus-accent shrink-0">
              {React.createElement(activeChannel.icon, { className: "w-4 h-4" })}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono text-white truncate">
                  #{activeChannel.name}
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-white/5 border border-white/10 rounded-full text-nexus-accent">
                  {activeChannel.category}
                </span>
              </div>
              <p className="text-[11px] text-nexus-text-dim truncate">
                {activeChannel.topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-nexus-text-dim" />
              <input
                type="text"
                placeholder="Search stream..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-nexus-text-dim focus:outline-none focus:border-nexus-accent/40 w-36 lg:w-48"
              />
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={isSummarizing}
              className="px-3 py-1.5 bg-nexus-accent/10 hover:bg-nexus-accent/20 border border-nexus-accent/30 text-nexus-accent font-mono text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sparkles className={cn("w-3.5 h-3.5", isSummarizing && "animate-spin")} />
              <span className="hidden md:inline">AI Briefing</span>
            </button>
          </div>
        </div>

        {/* AI Channel Briefing Card (if opened) */}
        {aiSummary && (
          <div className="mx-4 mt-3 p-3.5 bg-nexus-accent/10 border border-nexus-accent/30 rounded-xl relative">
            <button 
              onClick={() => setAiSummary(null)}
              className="absolute top-2 right-2 text-nexus-text-dim hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-nexus-accent uppercase font-mono">
              <Bot className="w-4 h-4" /> Aura Neural Intelligence Briefing
            </div>
            <pre className="text-xs font-sans text-nexus-text leading-relaxed whitespace-pre-line">
              {aiSummary}
            </pre>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-nexus-text-dim">
              <MessageSquare className="w-10 h-10 mb-2 opacity-30 text-nexus-accent" />
              <p className="text-xs uppercase font-mono">No messages in #{activeChannel.name}</p>
              <p className="text-[11px] mt-1 text-nexus-text-dim">Start the conversation or prompt the AI ghostwriter!</p>
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div 
                key={msg.id}
                className={cn(
                  "flex items-start gap-3 group transition-all rounded-xl p-2 hover:bg-white/[0.02]",
                  msg.pinned && "bg-amber-500/5 border border-amber-500/20"
                )}
              >
                <div className="relative shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center border",
                    msg.senderRole === "OWNER" && "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
                    msg.senderRole === "AI" && "bg-cyan-500/20 border-cyan-500/40 text-cyan-300",
                    msg.senderRole === "PRODUCER" && "bg-purple-500/20 border-purple-500/40 text-purple-300",
                    msg.senderRole === "ADMIN" && "bg-blue-500/20 border-blue-500/40 text-blue-300",
                    msg.senderRole === "CREATOR" && "bg-amber-500/20 border-amber-500/40 text-amber-300",
                  )}>
                    {msg.senderAvatar}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{msg.senderName}</span>
                    <span className={cn(
                      "px-1.5 py-0.2 text-[8px] font-mono uppercase font-bold rounded",
                      msg.senderRole === "OWNER" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
                      msg.senderRole === "AI" && "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
                      msg.senderRole === "PRODUCER" && "bg-purple-500/10 text-purple-400 border border-purple-500/30",
                      msg.senderRole === "ADMIN" && "bg-blue-500/10 text-blue-400 border border-blue-500/30",
                      msg.senderRole === "CREATOR" && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                    )}>
                      {msg.senderRole}
                    </span>
                    <span className="text-[10px] font-mono text-nexus-text-dim">{msg.timestamp}</span>
                    {msg.pinned && (
                      <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>

                  {/* Message Content Type Routing */}
                  {msg.type === "audio" ? (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 max-w-sm">
                      <button
                        onClick={() => {
                          spatialAudio.playScanSweep();
                          setPlayingAudioId(playingAudioId === msg.id ? null : msg.id);
                        }}
                        className="w-8 h-8 rounded-lg bg-nexus-accent text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_10px_rgba(5,255,161,0.3)]"
                      >
                        {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 h-4">
                          {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 30, 70].map((h, i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "w-1 rounded-full transition-all",
                                playingAudioId === msg.id ? "bg-nexus-accent animate-pulse" : "bg-white/30"
                              )} 
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-nexus-text-dim mt-1">
                          <span>Spatial Audio Dispatch</span>
                          <span>{msg.audioDuration}</span>
                        </div>
                      </div>
                    </div>
                  ) : msg.type === "deal" && msg.dealData ? (
                    <div className="p-3.5 bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl space-y-2 max-w-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" /> Sponsor Deal Contract
                        </span>
                        <span className="px-2 py-0.5 text-[9px] font-mono bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                          {msg.dealData.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white">{msg.dealData.title}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs font-mono">
                        <span className="text-nexus-accent font-bold">{msg.dealData.budget}</span>
                        <span className="text-nexus-text-dim text-[10px]">{msg.dealData.creator}</span>
                      </div>
                    </div>
                  ) : msg.type === "code" && msg.codeSnippet ? (
                    <div className="bg-[#040810] border border-white/10 rounded-xl overflow-hidden max-w-lg">
                      <div className="px-3 py-1.5 bg-white/5 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-nexus-text-dim">
                        <span>{msg.codeSnippet.lang}</span>
                        <FileCode className="w-3.5 h-3.5" />
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                        <code>{msg.codeSnippet.code}</code>
                      </pre>
                    </div>
                  ) : (
                    <p className="text-xs text-nexus-text leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}

                  {/* Reactions & Add Reaction Pill */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {msg.reactions.map((rx, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleReaction(msg.id, rx.emoji)}
                        className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs flex items-center gap-1 transition-all"
                      >
                        <span>{rx.emoji}</span>
                        <span className="text-[10px] font-mono text-nexus-text-dim">{rx.count}</span>
                      </button>
                    ))}

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {["🔥", "❤️", "🚀", "💡"].map(em => (
                        <button
                          key={em}
                          onClick={() => handleReaction(msg.id, em)}
                          className="p-1 hover:bg-white/10 rounded text-xs transition-all"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {peerTyping && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-nexus-accent animate-pulse pl-3">
              <Bot className="w-3.5 h-3.5" />
              <span>{peerTyping} is formulating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Dock */}
        <div className="p-4 border-t border-white/5 bg-[#0b1224]">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleAiGhostwrite}
              disabled={isAiDrafting}
              className="px-2.5 py-1 bg-nexus-accent/10 hover:bg-nexus-accent/20 border border-nexus-accent/30 text-nexus-accent text-[10px] font-mono rounded-lg transition-all flex items-center gap-1.5"
            >
              <Sparkles className={cn("w-3 h-3", isAiDrafting && "animate-spin")} />
              <span>Ghostwrite Dispatch</span>
            </button>

            <button
              onClick={() => setShowCodeModal(true)}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-nexus-text-dim hover:text-white text-[10px] font-mono rounded-lg transition-all flex items-center gap-1.5"
            >
              <Code className="w-3 h-3 text-cyan-400" />
              <span>Code Block</span>
            </button>

            <div className="text-[10px] font-mono text-nexus-text-dim ml-auto hidden sm:block">
              Press Enter to send
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRecordingVoice ? (
              <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-xl p-2 flex items-center justify-between text-xs font-mono text-red-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>Recording Spatial Audio Voice Dispatch... ({recordingSeconds}s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRecordingVoice(false)}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="px-3 py-1 bg-red-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                  >
                    <Check className="w-3 h-3" /> Dispatch Note
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                    placeholder={`Message #${activeChannel.name}...`}
                    className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-nexus-text-dim focus:outline-none focus:border-nexus-accent/50 transition-all font-sans"
                  />
                  <button
                    onClick={() => {
                      spatialAudio.playClick();
                      setInputText(t => t + " 🔥");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nexus-text-dim hover:text-white"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    spatialAudio.playScanSweep();
                    setIsRecordingVoice(true);
                  }}
                  title="Record Voice Dispatch"
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-nexus-text-dim hover:text-white rounded-xl transition-all"
                >
                  <Mic className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-nexus-accent hover:bg-nexus-accent/90 disabled:opacity-30 text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(5,255,161,0.3)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Code Snippet Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1224] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-nexus-accent" />
                <h3 className="text-sm font-bold uppercase font-mono text-white">Share Code Snippet</h3>
              </div>
              <button 
                onClick={() => setShowCodeModal(false)}
                className="text-nexus-text-dim hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Language</label>
                <select
                  value={codeLang}
                  onChange={e => setCodeLang(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="solidity">Solidity (Smart Contract)</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Code</label>
                <textarea
                  rows={6}
                  value={codeSnippet}
                  onChange={e => setCodeSnippet(e.target.value)}
                  placeholder="// Paste your code block here..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl font-mono text-xs text-cyan-300 focus:outline-none focus:border-nexus-accent/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-nexus-text-dim font-mono text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCode}
                className="px-4 py-2 bg-nexus-accent text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_12px_rgba(5,255,161,0.3)]"
              >
                Post Code Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
