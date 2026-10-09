import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Crown, 
  Search, 
  Filter, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  DollarSign, 
  Tv, 
  Play, 
  Eye, 
  Heart, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  X,
  Radio
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export type InfluencerNiche = "ALL" | "SHOWBIZ" | "TECH" | "GAMING" | "MUSIC" | "LIFESTYLE";

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  niche: "SHOWBIZ" | "TECH" | "GAMING" | "MUSIC" | "LIFESTYLE";
  tier: "MEGA" | "MACRO" | "MID" | "MICRO";
  platform: "YouTube" | "TikTok" | "Instagram" | "Twitch" | "X";
  followers: string;
  rawFollowers: number;
  engagementRate: string;
  avgViews: string;
  cpm: string;
  brandSafety: number; // percentage
  liveNow?: boolean;
  liveViewers?: string;
  bio: string;
  topVideos: string[];
  rateCard: {
    dedicatedVideo: string;
    integratedShort: string;
    storyMention: string;
  };
}

const CREATORS_DATA: CreatorProfile[] = [
  {
    id: "cr-1",
    name: "Aria Nova",
    handle: "@arianova_live",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    niche: "SHOWBIZ",
    tier: "MEGA",
    platform: "YouTube",
    followers: "3.8M",
    rawFollowers: 3800000,
    engagementRate: "9.2%",
    avgViews: "1.4M",
    cpm: "$24.50",
    brandSafety: 99,
    liveNow: true,
    liveViewers: "42.8k Watching",
    bio: "Hollywood insider & entertainment commentator. Red carpet exclusives, premier reviews, and celebrity interviews.",
    topVideos: ["Backstage at Cyberpunk Premiere", "Inside the $350M Studio Deal"],
    rateCard: {
      dedicatedVideo: "$18,000",
      integratedShort: "$6,500",
      storyMention: "$2,200"
    }
  },
  {
    id: "cr-2",
    name: "Kaius Quantum",
    handle: "@kaius_tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    niche: "TECH",
    tier: "MACRO",
    platform: "TikTok",
    followers: "890K",
    rawFollowers: 890000,
    engagementRate: "12.4%",
    avgViews: "650K",
    cpm: "$32.00",
    brandSafety: 100,
    bio: "Spatial Computing, WebXR & Neural AI explorer. Unboxing the future with cinematic high-speed cameras.",
    topVideos: ["LiDAR Holograms in Real Life", "Neural Mesh Hands-On"],
    rateCard: {
      dedicatedVideo: "$9,500",
      integratedShort: "$3,800",
      storyMention: "$1,400"
    }
  },
  {
    id: "cr-3",
    name: "Sora & Glitch",
    handle: "@soraglitch_stream",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
    niche: "GAMING",
    tier: "MEGA",
    platform: "Twitch",
    followers: "2.1M",
    rawFollowers: 2100000,
    engagementRate: "14.8%",
    avgViews: "820K",
    cpm: "$28.00",
    brandSafety: 98,
    liveNow: true,
    liveViewers: "19.3k Watching",
    bio: "Esports champion and immersive VR streamer. Co-op playthroughs, live audience challenges, and tech reviews.",
    topVideos: ["100 Hours Inside Metaverse", "Pro VR Championship Finals"],
    rateCard: {
      dedicatedVideo: "$14,000",
      integratedShort: "$5,200",
      storyMention: "$1,800"
    }
  },
  {
    id: "cr-4",
    name: "Elena Rostova",
    handle: "@elena_audio",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
    niche: "MUSIC",
    tier: "MID",
    platform: "Instagram",
    followers: "420K",
    rawFollowers: 420000,
    engagementRate: "8.6%",
    avgViews: "310K",
    cpm: "$18.50",
    brandSafety: 100,
    bio: "Spatial audio engineer and soundtrack producer. Scoring award-winning sci-fi indies and viral sound design trends.",
    topVideos: ["How Spatial Audio Tricks Your Brain", "Synthwave 4K Live Rig"],
    rateCard: {
      dedicatedVideo: "$4,800",
      integratedShort: "$1,900",
      storyMention: "$800"
    }
  },
  {
    id: "cr-5",
    name: "Zane Vance",
    handle: "@zanevance_style",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    niche: "LIFESTYLE",
    tier: "MACRO",
    platform: "YouTube",
    followers: "1.2M",
    rawFollowers: 1200000,
    engagementRate: "7.9%",
    avgViews: "450K",
    cpm: "$22.00",
    brandSafety: 99,
    bio: "Luxury cyberpunk fashion, wearable tech reviews, and Tokyo / London tech lifestyle vlogs.",
    topVideos: ["Smart Fabrics You Can Buy Today", "Tokyo Cyberpunk Night Market Tour"],
    rateCard: {
      dedicatedVideo: "$8,500",
      integratedShort: "$3,200",
      storyMention: "$1,100"
    }
  }
];

export const InfluencersTab: React.FC = () => {
  const [creators] = useState<CreatorProfile[]>(CREATORS_DATA);
  const [activeNiche, setActiveNiche] = useState<InfluencerNiche>("ALL");
  const [activeTier, setActiveTier] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<"dedicated" | "integrated" | "story">("integrated");
  const [outreachNote, setOutreachNote] = useState("");
  const [outreachSent, setOutreachSent] = useState(false);

  const filteredCreators = creators.filter(c => {
    const matchesNiche = activeNiche === "ALL" || c.niche === activeNiche;
    const matchesTier = activeTier === "ALL" || c.tier === activeTier;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesNiche && matchesTier && matchesSearch;
  });

  const handleSendContract = () => {
    if (!selectedCreator) return;
    spatialAudio.playTargetLock();
    setOutreachSent(true);
    setTimeout(() => {
      setOutreachSent(false);
      setShowOutreachModal(false);
      setOutreachNote("");
    }, 1600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1224] via-[#111c38] to-[#0b1224] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-full font-bold uppercase flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" /> Creator Radar & Roster v4.0
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" /> 8.4M Combined Reach
            </span>
          </div>
          <h2 className="text-xl font-bold font-display uppercase tracking-tight text-white">
            Influencers & Creator Talent Network
          </h2>
          <p className="text-xs text-nexus-text-dim mt-1 max-w-xl">
            Discover verified top-tier creators across Showbiz, Tech, Gaming, and Music. Inspect verified engagement metrics and initiate automated sponsorship contracts.
          </p>
        </div>

        {/* Live Active Stream Summary */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-2 rounded-xl">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <div className="text-left font-mono">
            <span className="text-[10px] text-nexus-text-dim block">Live Creators</span>
            <span className="text-xs font-bold text-white">2 Streaming Now</span>
          </div>
        </div>
      </div>

      {/* Filter and Niche Selector */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Niche Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {[
            { id: "ALL", label: "All Niches" },
            { id: "SHOWBIZ", label: "Showbiz & Ent." },
            { id: "TECH", label: "Tech & WebXR" },
            { id: "GAMING", label: "Gaming & VR" },
            { id: "MUSIC", label: "Music & Audio" },
            { id: "LIFESTYLE", label: "Lifestyle" },
          ].map(n => (
            <button
              key={n.id}
              onClick={() => {
                spatialAudio.playClick();
                setActiveNiche(n.id as any);
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap",
                activeNiche === n.id
                  ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "bg-white/5 text-nexus-text-dim hover:text-white border border-white/5"
              )}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-nexus-text-dim" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search creator handle or niche..."
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-nexus-text-dim focus:outline-none focus:border-purple-500/40"
            />
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCreators.map(creator => (
          <div
            key={creator.id}
            className="bg-[#0b1224] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] group relative"
          >
            {creator.liveNow && (
              <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[9px] font-mono font-bold uppercase rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {creator.liveViewers}
              </div>
            )}

            <div>
              {/* Creator Profile Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center border border-black">
                    ✓
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {creator.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-nexus-text-dim block truncate">
                    {creator.handle} • {creator.platform}
                  </span>
                  <span className="inline-block mt-1 px-2 py-0.2 text-[8px] font-mono uppercase bg-white/5 border border-white/10 rounded text-purple-300 font-bold">
                    {creator.niche} // {creator.tier}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-nexus-text-dim line-clamp-2 leading-relaxed mb-4">
                {creator.bio}
              </p>

              {/* Metrics Bento Grid */}
              <div className="grid grid-cols-3 gap-2 bg-black/40 border border-white/5 rounded-xl p-2.5 mb-4 text-center font-mono">
                <div>
                  <span className="text-[8px] uppercase text-nexus-text-dim block">Audience</span>
                  <span className="text-xs font-bold text-white">{creator.followers}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-nexus-text-dim block">Engagement</span>
                  <span className="text-xs font-bold text-green-400">{creator.engagementRate}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-nexus-text-dim block">Avg. Views</span>
                  <span className="text-xs font-bold text-cyan-400">{creator.avgViews}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-nexus-text-dim">Starting Rate:</span>
                <span className="font-bold text-nexus-accent">{creator.rateCard.integratedShort}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    spatialAudio.playScanSweep();
                    setSelectedCreator(creator);
                    setShowOutreachModal(true);
                  }}
                  className="py-2 bg-purple-500/15 hover:bg-purple-500 hover:text-white border border-purple-500/30 text-purple-300 font-mono text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Book Collab</span>
                </button>

                <button
                  onClick={() => {
                    spatialAudio.playClick();
                    setSelectedCreator(creator);
                  }}
                  className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                >
                  <span>Media Kit</span>
                  <ExternalLink className="w-3 h-3 text-nexus-text-dim" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Outreach / Collab Contract Modal */}
      {showOutreachModal && selectedCreator && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1224] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedCreator.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Collab Outreach</span>
                  <h3 className="text-sm font-bold text-white">{selectedCreator.name} ({selectedCreator.handle})</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowOutreachModal(false)}
                className="text-nexus-text-dim hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {outreachSent ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">Collab Proposal & Escrow Initialized!</h4>
                <p className="text-xs text-nexus-text-dim font-mono">
                  Smart agreement dispatched to {selectedCreator.name}'s talent manager.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1.5">Deliverable Package</label>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <button
                      onClick={() => setSelectedDeliverable("integrated")}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all",
                        selectedDeliverable === "integrated" ? "bg-purple-500/20 border-purple-500 text-white" : "bg-white/5 border-white/10 text-nexus-text-dim"
                      )}
                    >
                      <span className="block text-[9px] uppercase font-bold text-purple-300">Short / Reel</span>
                      <span className="text-xs font-bold text-nexus-accent">{selectedCreator.rateCard.integratedShort}</span>
                    </button>

                    <button
                      onClick={() => setSelectedDeliverable("dedicated")}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all",
                        selectedDeliverable === "dedicated" ? "bg-purple-500/20 border-purple-500 text-white" : "bg-white/5 border-white/10 text-nexus-text-dim"
                      )}
                    >
                      <span className="block text-[9px] uppercase font-bold text-purple-300">Dedicated Vid</span>
                      <span className="text-xs font-bold text-nexus-accent">{selectedCreator.rateCard.dedicatedVideo}</span>
                    </button>

                    <button
                      onClick={() => setSelectedDeliverable("story")}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all",
                        selectedDeliverable === "story" ? "bg-purple-500/20 border-purple-500 text-white" : "bg-white/5 border-white/10 text-nexus-text-dim"
                      )}
                    >
                      <span className="block text-[9px] uppercase font-bold text-purple-300">Story Series</span>
                      <span className="text-xs font-bold text-nexus-accent">{selectedCreator.rateCard.storyMention}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Campaign Goal & Brief Note</label>
                  <textarea
                    rows={3}
                    value={outreachNote}
                    onChange={e => setOutreachNote(e.target.value)}
                    placeholder="Describe product highlights, campaign target date, and requested call-to-action link..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/40"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowOutreachModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-nexus-text-dim font-mono text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendContract}
                    className="px-4 py-2 bg-purple-500 text-white font-bold font-mono text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Formal Offer</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
