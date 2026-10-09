import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  Tv, 
  Globe, 
  TrendingUp, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  Bookmark, 
  Eye, 
  Clock, 
  Search, 
  Filter, 
  Radio, 
  Film, 
  Music, 
  Award, 
  Zap, 
  Check, 
  ChevronRight, 
  X,
  MessageSquare,
  BarChart3,
  ThumbsUp
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export type NewsStreamType = "ALL" | "SHOWBIZ" | "TECH" | "STREAMING" | "TRENDS" | "MUSIC";

export interface NewsArticle {
  id: string;
  title: string;
  headline: string;
  excerpt: string;
  fullBody: string;
  source: string;
  sourceLogo?: string;
  category: "SHOWBIZ" | "TECH" | "STREAMING" | "TRENDS" | "MUSIC";
  timestamp: string;
  readTime: string;
  views: string;
  sentiment: "VIRAL_BULLISH" | "POSITIVE" | "HIGH_IMPACT" | "CONTROVERSIAL";
  image: string;
  featured?: boolean;
  aiKeyTakeaways: string[];
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

const NEWS_FEED: NewsArticle[] = [
  {
    id: "news-sb-1",
    title: "$350M Cyberpunk Movie Franchise Confirms Multi-Platform Streaming & AR Release",
    headline: "Universal & Nexus Studios Lock Historic Entertainment Deal",
    excerpt: "Director confirms native Apple Vision Pro and WebXR companion experience allowing viewers to step directly onto the neo-Tokyo sets in full holographic fidelity.",
    fullBody: `In a landmark announcement at the Tokyo International Media Summit, Nexus Studios in partnership with Universal Pictures revealed full details of 'Project Chimera'—a $350 million cinematic franchise debuting across IMAX theaters and real-time spatial computing headsets simultaneously.\n\nThe production employs ultra-high-density 64-beam LiDAR volumetric capture rigs, enabling audiences to toggle between traditional 2.39:1 anamorphic cinematography and interactive 3D virtual seat viewpoints.\n\nLeading streaming platforms have already placed record-setting pre-licensing bids, signaling the largest spatial entertainment transaction of the decade.`,
    source: "Showbiz Global Wire",
    category: "SHOWBIZ",
    timestamp: "18m ago",
    readTime: "4 min read",
    views: "148.2k",
    sentiment: "VIRAL_BULLISH",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    featured: true,
    aiKeyTakeaways: [
      "$350M budget with simultaneous theatrical and WebXR spatial release.",
      "64-beam LiDAR volumetric capture allows live perspective toggling.",
      "Record pre-licensing bids from tier-1 global streaming platforms."
    ],
    engagement: { likes: 2420, shares: 890, comments: 341 }
  },
  {
    id: "news-sb-2",
    title: "Global Music Awards: Synthwave AI-Human Duet Dominates Chart Records",
    headline: "Elena Rostova & Neural Orchestrator Win Album of the Year",
    excerpt: "The historic album merges live cello performances with real-time generative harmonic synthesis, topping Spotify Global Top 50 in 48 countries.",
    fullBody: `The 2026 Global Music Awards saw history made as Elena Rostova accepted Album of the Year for 'Echoes of the Grid'. The 12-track spatial audio masterpiece was mixed in full binaural 3D and recorded live inside a converted cathedral with 32 acoustic sensors.\n\nStreaming platforms reported over 180 million plays within the first 72 hours, proving unprecedented commercial appetite for spatial acoustic experiences.`,
    source: "Billboard Nexus",
    category: "MUSIC",
    timestamp: "1h ago",
    readTime: "3 min read",
    views: "89.5k",
    sentiment: "POSITIVE",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    featured: true,
    aiKeyTakeaways: [
      "First hybrid human-neural acoustic album to win Album of the Year.",
      "180M streams within first 72 hours of worldwide release.",
      "Produced in 32-channel binaural spatial audio."
    ],
    engagement: { likes: 1840, shares: 620, comments: 210 }
  },
  {
    id: "news-sb-3",
    title: "Inside the Celebrity Creator Gala in Beverly Hills: Top 10 Red Carpet Looks",
    headline: "Smart Fabrics & Holographic Gowns Stun Photographers",
    excerpt: "From fiber-optic LED silk to shape-shifting kinetic accessories, celebrities turned the gala into an unprecedented runway of tech-meets-couture.",
    fullBody: `Last night's Creator Gala in Beverly Hills gathered the top 500 digital creators and Hollywood icons. The defining trend was wearable computational fashion, with holographic corsets and reactive pigment silks that shift color depending on flash photography angles.\n\nAria Nova and Zane Vance took top honors for their synchronized smart-fabric ensembles designed by Tokyo atelier NeoKitsune.`,
    source: "Hollywood Radar",
    category: "SHOWBIZ",
    timestamp: "3h ago",
    readTime: "5 min read",
    views: "215.8k",
    sentiment: "VIRAL_BULLISH",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    aiKeyTakeaways: [
      "Wearable technology and shape-shifting fabrics dominated red carpet fashion.",
      "Over 500 million social impressions recorded across Instagram & TikTok.",
      "Aria Nova crowned Best Dressed for reactive fiber-optic couture."
    ],
    engagement: { likes: 3120, shares: 1450, comments: 512 }
  },
  {
    id: "news-tech-1",
    title: "Next-Gen Quantum LLM Reasoning Engine Breaks 99.4% Multi-Modal Accuracy",
    headline: "DeepMind & Nexus Research Unveil Sub-10ms Inference Architecture",
    excerpt: "New benchmarks confirm real-time reasoning across video, spatial audio, and code generation with 60% lower power consumption.",
    fullBody: `Researchers have demonstrated unprecedented efficiency gains with quantum-compressed weight matrices. The new framework allows complex multimodal agent workflows to execute on-device in under 10 milliseconds, making spatial AR interfaces feel instantaneous.`,
    source: "TechPulse Neural",
    category: "TECH",
    timestamp: "4h ago",
    readTime: "6 min read",
    views: "112.4k",
    sentiment: "HIGH_IMPACT",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    aiKeyTakeaways: [
      "99.4% multimodal reasoning accuracy across vision and code benchmarks.",
      "Sub-10ms latency enables fluid spatial AR agent interactions.",
      "60% reduction in edge memory footprint."
    ],
    engagement: { likes: 1650, shares: 430, comments: 180 }
  },
  {
    id: "news-stream-1",
    title: "Streaming Wars Q3: Interactive Sci-Fi Anime Takes #1 Globally on Netflix & Crunchyroll",
    headline: "Audience-Choice Branching Episodes Drive 85% Rewatch Rate",
    excerpt: "Viewers control battle outcomes through real-time mobile companion sync, resulting in over 40 million interactive viewer decisions on premiere night.",
    fullBody: `Interactive storytelling reached a new apex this weekend with the premiere of 'Valkyrie 2099'. By allowing viewers to dynamically vote and branch storylines via secondary screen apps, engagement metrics exceeded traditional series benchmarks by 320%.`,
    source: "Streaming Insider",
    category: "STREAMING",
    timestamp: "6h ago",
    readTime: "4 min read",
    views: "94.1k",
    sentiment: "POSITIVE",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    aiKeyTakeaways: [
      "85% rewatch rate driven by multi-branching story decisions.",
      "40M interactive decisions logged during global premiere.",
      "Sets new blueprint for companion-app streaming formats."
    ],
    engagement: { likes: 1290, shares: 510, comments: 220 }
  }
];

export const DailyNewsShowbizTab: React.FC = () => {
  const [articles] = useState<NewsArticle[]>(NEWS_FEED);
  const [activeStream, setActiveStream] = useState<NewsStreamType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredArticles = articles.filter(a => {
    const matchesStream = activeStream === "ALL" || a.category === activeStream;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStream && matchesSearch;
  });

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    spatialAudio.playClick();
    setSavedArticles(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleShare = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    spatialAudio.playTargetLock();
    setCopiedId(article.id);
    navigator.clipboard?.writeText(`${article.title} - Read on Nexus Showbiz Radar`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Breaking News Beacon Ticker */}
      <div className="bg-gradient-to-r from-red-950/40 via-[#0b1224] to-[#0b1224] border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 overflow-hidden relative shadow-lg">
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-2.5 py-1 bg-red-500 text-white font-mono text-[10px] font-bold uppercase rounded-lg flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.5)]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>BREAKING NEWS RADAR</span>
          </div>
        </div>

        <div className="overflow-hidden whitespace-nowrap text-xs font-mono text-nexus-text">
          <span className="inline-block animate-marquee text-amber-300">
            🔥 $350M Cyberpunk Movie franchise greenlit for dual WebXR theatrical release • Universal & Nexus confirm 64-beam LiDAR stage production • Elena Rostova wins Album of the Year with 180M spatial audio streams • Beverly Hills Creator Gala sets 500M social impression record
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0 font-mono text-[11px] text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span>LIVE 24/7 SATELLITE FEED</span>
        </div>
      </div>

      {/* 2. Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Stream Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Intelligence" },
            { id: "SHOWBIZ", label: "Showbiz & VIP" },
            { id: "TECH", label: "Tech & AI" },
            { id: "STREAMING", label: "Streaming Top 10" },
            { id: "MUSIC", label: "Music & Audio" },
          ].map(str => (
            <button
              key={str.id}
              onClick={() => {
                spatialAudio.playClick();
                setActiveStream(str.id as any);
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap",
                activeStream === str.id
                  ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  : "bg-white/5 text-nexus-text-dim hover:text-white border border-white/5"
              )}
            >
              {str.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-nexus-text-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search showbiz, deals, reviews..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-nexus-text-dim focus:outline-none focus:border-amber-400/40"
          />
        </div>
      </div>

      {/* 3. Featured Hero Story (if present in filtered list) */}
      {filteredArticles.length > 0 && filteredArticles[0].featured && (
        <div 
          onClick={() => {
            spatialAudio.playScanSweep();
            setSelectedArticle(filteredArticles[0]);
          }}
          className="relative bg-[#0b1224] border border-amber-500/30 rounded-3xl overflow-hidden cursor-pointer group hover:border-amber-400 transition-all shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px]">
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10 bg-gradient-to-r from-[#0b1224] via-[#0b1224]/90 to-transparent">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 bg-amber-400 text-black text-[9px] font-mono font-bold uppercase rounded-md shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                    FEATURED EXCLUSIVE
                  </span>
                  <span className="text-[11px] font-mono text-nexus-text-dim">
                    {filteredArticles[0].source} • {filteredArticles[0].timestamp}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-amber-300 transition-colors leading-tight">
                  {filteredArticles[0].title}
                </h2>
                <p className="text-xs sm:text-sm text-nexus-text mt-3 leading-relaxed line-clamp-3">
                  {filteredArticles[0].excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-nexus-text-dim">
                  <span className="flex items-center gap-1 text-white">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> {filteredArticles[0].views} Views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> {filteredArticles[0].readTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                    Read Story <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-48 lg:h-auto overflow-hidden">
              <img
                src={filteredArticles[0].image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0b1224] to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* 4. Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.slice(filteredArticles[0]?.featured ? 1 : 0).map(article => (
          <div
            key={article.id}
            onClick={() => {
              spatialAudio.playScanSweep();
              setSelectedArticle(article);
            }}
            className="bg-[#0b1224] border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.1)] group flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1224] via-transparent to-black/30" />
                
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] font-mono font-bold text-amber-300 uppercase">
                  {article.category}
                </div>

                <button
                  onClick={(e) => toggleSave(article.id, e)}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-all"
                >
                  <Bookmark className={cn("w-3.5 h-3.5", savedArticles.includes(article.id) && "fill-amber-400 text-amber-400")} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-[10px] font-mono text-nexus-text-dim mb-2">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span>{article.timestamp}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-nexus-text-dim mt-2 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="p-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between text-[11px] font-mono text-nexus-text-dim">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-cyan-400" /> {article.views}
                </span>
                <span>{article.readTime}</span>
              </div>

              <button
                onClick={(e) => handleShare(article, e)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-nexus-text-dim hover:text-white transition-all flex items-center gap-1"
              >
                {copiedId === article.id ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Article Detail & AI Key Takeaways Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1224] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
            {/* Modal Header Cover */}
            <div className="relative h-60 overflow-hidden">
              <img src={selectedArticle.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1224] via-[#0b1224]/50 to-transparent" />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-0.5 bg-amber-400 text-black text-[9px] font-mono font-bold uppercase rounded">
                  {selectedArticle.category} // {selectedArticle.source}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-2 leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* AI Key Takeaways Card */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase">
                  <Sparkles className="w-4 h-4" /> Aura AI 30-Second Briefing
                </div>
                <ul className="space-y-1.5 text-xs text-nexus-text">
                  {selectedArticle.aiKeyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Article Content */}
              <div className="text-xs sm:text-sm text-nexus-text leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {selectedArticle.fullBody}
              </div>

              {/* Engagement and Share Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs font-mono text-nexus-text-dim">
                  <span className="flex items-center gap-1.5 text-white">
                    <ThumbsUp className="w-4 h-4 text-amber-400" /> {selectedArticle.engagement.likes} Reactions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" /> {selectedArticle.engagement.comments} Comments
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      spatialAudio.playTargetLock();
                      navigator.clipboard?.writeText(selectedArticle.title);
                      setSelectedArticle(null);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-nexus-accent text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_12px_rgba(5,255,161,0.3)] flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy to Social Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
