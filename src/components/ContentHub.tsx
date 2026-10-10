import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Newspaper, 
  Search, 
  Plus, 
  MessageSquare, 
  Share2, 
  Eye, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
  Film,
  Palette,
  Feather,
  Code2,
  BookOpen,
  Mail,
  Compass,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { spatialAudio } from "./ar/SpatialAudioSynth";

// Sub-generator tabs
import { VideoGeneratorTab } from "./content-matrix/VideoGeneratorTab";
import { ImageGeneratorTab } from "./content-matrix/ImageGeneratorTab";
import { TextGeneratorTab } from "./content-matrix/TextGeneratorTab";
import { CodeGeneratorTab } from "./content-matrix/CodeGeneratorTab";
import { BooksGeneratorTab } from "./content-matrix/BooksGeneratorTab";
import { EmailsGeneratorTab } from "./content-matrix/EmailsGeneratorTab";
import { BlogpostStudioTab } from "./collab/BlogpostStudioTab";
import { DailyNewsShowbizTab } from "./collab/DailyNewsShowbizTab";

export type ContentHubTab = "video" | "image" | "text" | "code" | "books" | "emails" | "blog" | "news";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  views: number;
  comments: number;
  image: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  url: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Neural Interface Design",
    excerpt: "Exploring how quantum-level haptics and 64-beam LiDAR will reshape our daily interaction with spatial computing environments.",
    author: "Dr. Elara Vance",
    date: "2026-08-12",
    category: "Neural Tech",
    readTime: "8 min read",
    views: 1240,
    comments: 42,
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80"
  },
  {
    id: "2",
    title: "Optimizing Serverless Edge Clusters with Photonic Routing",
    excerpt: "New benchmarks show 45% latency reduction using Nexus Edge-04 routing protocols and sub-millimeter waveguides.",
    author: "Marco Rossi",
    date: "2026-08-10",
    category: "Infrastructure",
    readTime: "12 min read",
    views: 890,
    comments: 15,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
  }
];

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "n1",
    title: "Global Neural Mesh Upgrade Scheduled for Cycle 42",
    source: "Nexus Core",
    time: "2 hours ago",
    category: "System",
    priority: "HIGH",
    url: "#"
  },
  {
    id: "n2",
    title: "Mars Colony Alpha Reports Successful Data Link Reconstruction",
    source: "Interplanetary Net",
    time: "5 hours ago",
    category: "Space",
    priority: "MEDIUM",
    url: "#"
  },
  {
    id: "n3",
    title: "New AI Ethics Accord Signed by Major Systems Hubs",
    source: "Tech Review",
    time: "Yesterday",
    category: "Policy",
    priority: "LOW",
    url: "#"
  }
];

export const ContentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentHubTab>("video");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab: ContentHubTab) => {
    spatialAudio.playHoloPinch();
    setActiveTab(tab);
  };

  const filteredBlog = BLOG_POSTS.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = NEWS_ITEMS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.time.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TABS_CONFIG: { id: ContentHubTab; label: string; icon: any; badge?: string }[] = [
    { id: "video", label: "Video Studio", icon: Film, badge: "4K" },
    { id: "image", label: "Image Studio", icon: Palette, badge: "8K" },
    { id: "text", label: "Copy & Articles", icon: Feather },
    { id: "code", label: "Code Architect", icon: Code2, badge: "NEW" },
    { id: "books", label: "Books & E-Books", icon: BookOpen },
    { id: "emails", label: "Email Sequences", icon: Mail },
    { id: "blog", label: "BlogPost Studio", icon: FileText, badge: "AI" },
    { id: "news", label: "Neural Feed", icon: Newspaper }
  ];

  return (
    <div className="h-full flex flex-col bg-nexus-bg/50 overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="px-6 py-5 sm:px-8 sm:py-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-nexus-bg/90 backdrop-blur-xl sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-cyan-400 via-nexus-accent to-purple-400 bg-clip-text text-transparent">
              Nexus Content Matrix
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              MULTIMODAL SUITE
            </span>
          </div>
          <p className="text-nexus-text-dim mt-1 text-xs sm:text-sm">
            Autonomous multi-modal studio: Generate 4K video, 8K imagery, verified code, full books, and drip campaigns.
          </p>
        </div>

        {/* Global Hub Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-dim" />
            <input 
              type="text" 
              placeholder="Search content or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-400/60 transition-all font-mono text-white placeholder:text-gray-500"
            />
          </div>
        </div>
      </header>

      {/* Main Studio Navigation Tabs */}
      <div className="px-6 sm:px-8 pt-4 pb-2 border-b border-white/10 bg-black/40 backdrop-blur-md overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2 min-w-max pb-1">
          {TABS_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 border",
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_25px_rgba(0,242,255,0.25)]"
                    : "bg-white/[0.02] text-nexus-text-dim border-white/5 hover:border-white/20 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-cyan-300" : "text-nexus-text-dim")} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded font-mono font-bold",
                    isActive ? "bg-cyan-400 text-black" : "bg-white/10 text-nexus-text-dim"
                  )}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Dynamic Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "video" && (
              <motion.div
                key="tab-video"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <VideoGeneratorTab />
              </motion.div>
            )}

            {activeTab === "image" && (
              <motion.div
                key="tab-image"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <ImageGeneratorTab />
              </motion.div>
            )}

            {activeTab === "text" && (
              <motion.div
                key="tab-text"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <TextGeneratorTab />
              </motion.div>
            )}

            {activeTab === "code" && (
              <motion.div
                key="tab-code"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CodeGeneratorTab />
              </motion.div>
            )}

            {activeTab === "books" && (
              <motion.div
                key="tab-books"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <BooksGeneratorTab />
              </motion.div>
            )}

            {activeTab === "emails" && (
              <motion.div
                key="tab-emails"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <EmailsGeneratorTab />
              </motion.div>
            )}

            {/* Original Journal Logs View */}
            {activeTab === "blog" && (
              <motion.div 
                key="tab-blog"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <BlogpostStudioTab />
              </motion.div>
            )}

            {/* Original Neural Feed View */}
            {activeTab === "news" && (
              <motion.div 
                key="tab-news"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <DailyNewsShowbizTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
