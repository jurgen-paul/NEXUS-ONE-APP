import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  Share2, 
  ExternalLink, 
  Eye, 
  Clock, 
  Tag, 
  Plus, 
  Check, 
  Edit3, 
  Trash2, 
  Save, 
  Send, 
  Search, 
  Filter, 
  BookOpen, 
  Flame, 
  Globe, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  HelpCircle,
  X,
  Copy,
  FolderSync
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  authorRole: string;
  publishedAt: string;
  category: "NEURAL_TECH" | "SHOWBIZ" | "CREATOR_ECONOMY" | "WEBXR" | "DEVELOPMENT";
  readTime: string;
  views: number;
  likes: number;
  coverImage: string;
  seoScore: number; // 0 - 100
  status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  platforms: string[];
}

const INITIAL_BLOGS: BlogPostItem[] = [
  {
    id: "blog-1",
    title: "The Spatial Computing Renaissance: How 64-Beam LiDAR and WebXR Redefine Creator Showcases",
    slug: "spatial-computing-renaissance-lidar-webxr",
    excerpt: "Exploring the convergence of Web Audio HRTF acoustics, real-time Gaussian splatting, and browser-first volumetric streaming.",
    content: `# The Spatial Computing Renaissance\n\nOver the past two decades, digital storytelling was confined to 2D rectangular viewports. With the advent of multi-beam LiDAR capture rigs and WebXR 3.0 standards, creators can now project high-fidelity volumetric environments directly into users' living spaces.\n\n## 1. Zero-Latency Gaussian Splatting\n\nBy leveraging photonic edge routing, asset streaming latency has plummeted below 12 milliseconds. This allows interactive 3D virtual stages to load instantaneously across both mobile visors and desktop browsers.\n\n## 2. Spatial HRTF Acoustic Landscapes\n\nSound is no longer stereo pan; it is physically anchored in 3D coordinates, giving audiences realistic distance cues and spatial reverberation.\n\n## Conclusion\n\nThe creators who master spatial formats today will define the next century of media consumption.`,
    author: "Dr. Elara Vance",
    authorAvatar: "EV",
    authorRole: "Principal XR Architect",
    publishedAt: "2026-08-12",
    category: "WEBXR",
    readTime: "6 min read",
    views: 3420,
    likes: 840,
    coverImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
    seoScore: 96,
    status: "PUBLISHED",
    platforms: ["Nexus Portal", "Medium", "Dev.to"]
  },
  {
    id: "blog-2",
    title: "Showbiz 2026: Why Decentralized Royalty Smart Contracts Are Taking Over Hollywood",
    slug: "showbiz-decentralized-royalties-hollywood",
    excerpt: "Automated escrow disbursement protocols eliminate 90-day accounting lag for actors, visual artists, and sound designers.",
    content: `# Showbiz 2026: The Rise of Smart Contract Escrows\n\nTraditional Hollywood backend distribution has historically suffered from opaque waterfall structures and multi-month accounting cycles. Today, leading studios are migrating to automated micro-escrow smart contracts.\n\n## Instantaneous Box Office & Streaming Splits\n\nEvery time a viewer streams a title or buys an interactive theater ticket, revenue splits are settled on-chain in real time, distributing tokens directly to creators' wallets.\n\n## Verifiable Creator Identity\n\nWith cryptographic provenance, background talent and VFX studios maintain perpetual attribution and residual collection across international syndication networks.`,
    author: "Marcus Sterling",
    authorAvatar: "MS",
    authorRole: "Entertainment Counsel",
    publishedAt: "2026-08-10",
    category: "SHOWBIZ",
    readTime: "5 min read",
    views: 2890,
    likes: 610,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
    seoScore: 92,
    status: "PUBLISHED",
    platforms: ["Substack", "Nexus Portal"]
  },
  {
    id: "blog-3",
    title: "10 Proven AI Prompting Paradigms for High-Converting Cold Email & Sponsor Pitches",
    slug: "ai-prompting-paradigms-cold-email-sponsors",
    excerpt: "Mastering few-shot neural prompting and cognitive resonance formulas to secure 45%+ reply rates on enterprise collaborations.",
    content: `# 10 Proven AI Prompting Paradigms for Creator Sponsorships\n\nReaching brand managers requires concise value propositions backed by verifiable audience metrics. Here is the exact blueprint tested across 500+ successful sponsor outreach campaigns.`,
    author: "Oistarian Prime",
    authorAvatar: "OP",
    authorRole: "Studio Lead",
    publishedAt: "2026-08-08",
    category: "CREATOR_ECONOMY",
    readTime: "4 min read",
    views: 4120,
    likes: 1250,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    seoScore: 98,
    status: "PUBLISHED",
    platforms: ["Nexus Portal", "LinkedIn", "Medium"]
  },
  {
    id: "blog-4",
    title: "OpenSSF Level 3 & SLSA Security Assurance in Neural Command Systems",
    slug: "openssf-level-3-slsa-security-assurance",
    excerpt: "How cryptographic provenance, Software Bill of Materials (SBOM), and strict R8 obfuscation safeguard enterprise AI command centers.",
    content: `# OpenSSF Level 3 & SLSA Security Assurance in Neural Command Systems

In modern enterprise AI systems, cyber supply chain integrity is as crucial as neural model weights. Oistarian-NEXUS-ONE enforces automated verification pipelines meeting OpenSSF Best Practices and SLSA Level 3 compliance standards.

## 1. Automated Software Bill of Materials (SBOM)

Every build artifact generates a signed CycloneDX and SPDX SBOM tracking all transitive npm and native binaries. Any untrusted source is flagged before deployment into cloud runtimes.

## 2. Hardened ProGuard & R8 Obfuscation Rules

Reverse engineering protection is enforced at compile time. By stripping debug symbols into dedicated Google Play Console deobfuscation bundles, internal neural weight schemas and proprietary IPC bindings remain tamper-proof.

## 3. Coordinated Vulnerability Disclosure (CVD)

A transparent SLA guarantees initial triage within 24 hours, patch commits within 72 hours, and cryptographic disclosure advisories for ecosystem partners.`,
    author: "Chief Security Officer",
    authorAvatar: "CSO",
    authorRole: "AppSec Lead",
    publishedAt: "2026-08-14",
    category: "DEVELOPMENT",
    readTime: "7 min read",
    views: 1980,
    likes: 530,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    seoScore: 99,
    status: "PUBLISHED",
    platforms: ["Nexus Portal", "Dev.to"]
  },
  {
    id: "blog-5",
    title: "Autonomous Multi-Agent Swarms: The Next Frontier in Creative Studio Automation",
    slug: "autonomous-multi-agent-swarms-creative-studio",
    excerpt: "Coordinating decentralized AI agents for automated scriptwriting, 8K render pipelines, and cross-platform distribution in real time.",
    content: `# Autonomous Multi-Agent Swarms: The Next Frontier

Traditional creative workflows require constant manual handoffs between copywriters, 3D generalists, video editors, and social media managers. Autonomous agent swarms compress this cycle from 2 weeks down to 90 seconds.

## Real-Time Agent Handoff Protocols

Using event-driven neural pipelines, an initial creative prompt automatically triggers:
1. **The Ghostwriter Agent**: Generates verified long-form narrative outlines.
2. **The Visual Synthesizer**: Produces 8K concept boards with coherent lighting seeds.
3. **The Escrow Auditor**: Checks smart contract bounties and schedules automated disbursements.

## Looking Forward

The creative studio of tomorrow is not an office of manual labor; it is a conductor orchestrating swarms of specialized cognitive agents.`,
    author: "Aura Cognitive Engine",
    authorAvatar: "ACE",
    authorRole: "Autonomous Intelligence",
    publishedAt: "2026-08-14",
    category: "NEURAL_TECH",
    readTime: "5 min read",
    views: 3120,
    likes: 910,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    seoScore: 97,
    status: "PUBLISHED",
    platforms: ["Nexus Portal", "Medium", "Substack"]
  }
];

export const BlogpostStudioTab: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostItem[]>(INITIAL_BLOGS);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<BlogPostItem | null>(null);
  const [readingBlog, setReadingBlog] = useState<BlogPostItem | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Editor View State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<BlogPostItem["category"]>("NEURAL_TECH");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCover, setEditCover] = useState("");
  const [editPlatforms, setEditPlatforms] = useState<string[]>(["Nexus Portal", "Medium"]);
  
  // AI Generator state
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Global listener for deep-linking into a blog post
  React.useEffect(() => {
    const handleOpenBlog = (e: any) => {
      const blogId = e.detail;
      const found = blogs.find(b => b.id === blogId || b.slug === blogId || b.title.toLowerCase().includes(String(blogId).toLowerCase()));
      if (found) {
        setReadingBlog(found);
        setIsEditing(false);
      }
    };
    window.addEventListener("nexus-open-blog", handleOpenBlog);
    return () => window.removeEventListener("nexus-open-blog", handleOpenBlog);
  }, [blogs]);

  const toggleLike = (id: string) => {
    spatialAudio.playClick();
    setLikedPosts(prev => {
      const isLiked = !!prev[id];
      const next = { ...prev, [id]: !isLiked };
      setBlogs(curr => curr.map(b => b.id === id ? { ...b, likes: b.likes + (isLiked ? -1 : 1) } : b));
      if (readingBlog && readingBlog.id === id) {
        setReadingBlog(curr => curr ? { ...curr, likes: curr.likes + (isLiked ? -1 : 1) } : null);
      }
      return next;
    });
  };

  const copyArticleLink = (blog: BlogPostItem) => {
    spatialAudio.playTargetLock();
    navigator.clipboard?.writeText?.(window.location.origin + "/#blog=" + blog.slug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesCat = activeCategory === "ALL" || b.category === activeCategory;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenEditor = (blog?: BlogPostItem) => {
    spatialAudio.playScanSweep();
    if (blog) {
      setEditTitle(blog.title);
      setEditCategory(blog.category);
      setEditExcerpt(blog.excerpt);
      setEditContent(blog.content);
      setEditCover(blog.coverImage);
      setEditPlatforms(blog.platforms);
      setSelectedBlog(blog);
    } else {
      setEditTitle("");
      setEditCategory("NEURAL_TECH");
      setEditExcerpt("");
      setEditContent("");
      setEditCover("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80");
      setEditPlatforms(["Nexus Portal", "Medium"]);
      setSelectedBlog(null);
    }
    setIsEditing(true);
  };

  const handleSavePost = () => {
    if (!editTitle.trim()) return;
    spatialAudio.playTargetLock();

    const newPost: BlogPostItem = {
      id: selectedBlog ? selectedBlog.id : `blog-${Date.now()}`,
      title: editTitle,
      slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: editExcerpt || editContent.slice(0, 120) + "...",
      content: editContent || "# Draft Post\n\nStart writing here...",
      author: "Oistarian Prime",
      authorAvatar: "OP",
      authorRole: "Studio Director",
      publishedAt: new Date().toISOString().split("T")[0],
      category: editCategory,
      readTime: `${Math.max(1, Math.ceil(editContent.split(" ").length / 200))} min read`,
      views: selectedBlog ? selectedBlog.views : 1,
      likes: selectedBlog ? selectedBlog.likes : 0,
      coverImage: editCover || "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80",
      seoScore: 94,
      status: "PUBLISHED",
      platforms: editPlatforms
    };

    setBlogs(prev => {
      const exists = prev.some(p => p.id === newPost.id);
      if (exists) {
        return prev.map(p => p.id === newPost.id ? newPost : p);
      }
      return [newPost, ...prev];
    });

    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleGenerateAiOutline = () => {
    if (!aiPromptTopic.trim()) return;
    spatialAudio.playScanSweep();
    setIsAiDrafting(true);

    setTimeout(() => {
      const generatedTitle = `Mastering ${aiPromptTopic}: Architectural Paradigms & Industry Insights`;
      const generatedExcerpt = `An exhaustive analysis of ${aiPromptTopic}, examining quantitative benchmarks, ecosystem adoption, and forward-looking strategies.`;
      const generatedContent = `# ${generatedTitle}\n\n## Executive Summary\n\nAs the industry pivots toward high-performance decentralized intelligence, understanding **${aiPromptTopic}** has transitioned from an optional advantage to a mission-critical imperative.\n\n## Key Architectural Tenets\n\n1. **Ultra-Low Latency Pipelines**: Reducing communication overhead across all touchpoints.\n2. **Verified Security & Provenance**: Leveraging immutable logs for audit compliance.\n3. **Modular Scalability**: Seamlessly orchestrating multi-agent collaboration.\n\n## Strategic Recommendations\n\n- Deploy real-time telemetry monitors across active nodes.\n- Automate rate-card reviews with AI-assisted sentiment parsing.\n\n## Conclusion\n\nOrganizations that execute on these foundations will dominate market share through 2030.`;

      setEditTitle(generatedTitle);
      setEditExcerpt(generatedExcerpt);
      setEditContent(generatedContent);
      setIsAiDrafting(false);
      setShowAiModal(false);
      setAiPromptTopic("");
      spatialAudio.playTargetLock();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1224] via-[#0f1b33] to-[#0b1224] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-full font-bold uppercase flex items-center gap-1">
              <FileText className="w-3 h-3 text-cyan-400" /> Multi-Platform Blog Studio
            </span>
            <span className="text-[11px] font-mono text-green-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI SEO Optimizer 98%
            </span>
          </div>
          <h2 className="text-xl font-bold font-display uppercase tracking-tight text-white">
            Nexus BlogPost Studio & Publishing Matrix
          </h2>
          <p className="text-xs text-nexus-text-dim mt-1 max-w-xl">
            Author deep-dive thought leadership, showbiz breakdowns, and tech tutorials with integrated AI draft ghostwriting and one-click multi-dispatch to Substack, Medium, & Dev.to.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenEditor()}
            className="px-4 py-2.5 bg-nexus-accent hover:bg-nexus-accent/90 text-black font-bold font-mono text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(5,255,161,0.3)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog Post</span>
          </button>
        </div>
      </div>

      {/* Editor Modal / View */}
      {isEditing ? (
        <div className="bg-[#0b1224] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-nexus-text-dim hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                {selectedBlog ? "Edit BlogPost" : "Create New BlogPost Studio Entry"}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiModal(true)}
                className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Draft Outline</span>
              </button>

              <button
                onClick={handleSavePost}
                className="px-4 py-1.5 bg-nexus-accent text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_15px_rgba(5,255,161,0.3)] flex items-center gap-1.5"
              >
                {publishedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Published!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Multi-Platform</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Input & Markdown Editor */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Article Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="e.g. The Future of Spatial Audio & WebXR Entertainment"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-nexus-accent/50 font-display"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  >
                    <option value="NEURAL_TECH">Neural Tech</option>
                    <option value="SHOWBIZ">Showbiz & Ent.</option>
                    <option value="CREATOR_ECONOMY">Creator Economy</option>
                    <option value="WEBXR">WebXR & 3D</option>
                    <option value="DEVELOPMENT">Development</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={editCover}
                    onChange={e => setEditCover(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Excerpt / Meta Description</label>
                <textarea
                  rows={2}
                  value={editExcerpt}
                  onChange={e => setEditExcerpt(e.target.value)}
                  placeholder="Short engaging summary for social previews and SEO tags..."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Markdown Body</label>
                <textarea
                  rows={12}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="# Enter your markdown article content here..."
                  className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-mono text-xs text-cyan-200 focus:outline-none focus:border-nexus-accent/40 leading-relaxed"
                />
              </div>
            </div>

            {/* Right: Live Preview & Platform Targets */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3">
                <span className="text-[10px] font-mono uppercase text-nexus-accent font-bold block">
                  Publishing Channels
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {["Nexus Portal", "Medium", "Substack", "Dev.to", "WordPress"].map(p => {
                    const isSelected = editPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => {
                          spatialAudio.playClick();
                          setEditPlatforms(prev => 
                            isSelected ? prev.filter(x => x !== p) : [...prev, p]
                          );
                        }}
                        className={cn(
                          "p-2 rounded-lg border text-left flex items-center justify-between transition-all",
                          isSelected ? "bg-nexus-accent/15 border-nexus-accent/40 text-nexus-accent font-bold" : "bg-white/5 border-white/10 text-nexus-text-dim"
                        )}
                      >
                        <span>{p}</span>
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                <span className="text-[10px] font-mono uppercase text-nexus-text-dim block">
                  Live Article Card Preview
                </span>
                <div className="bg-[#0e172e] rounded-xl overflow-hidden border border-white/10">
                  <img src={editCover || "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80"} alt="" className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <span className="px-2 py-0.5 text-[8px] font-mono uppercase bg-nexus-accent/20 text-nexus-accent rounded">
                      {editCategory}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-2">
                      {editTitle || "Your Article Title Will Appear Here"}
                    </h4>
                    <p className="text-[11px] text-nexus-text-dim mt-1 line-clamp-2">
                      {editExcerpt || "Article excerpt will show here in social previews..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Blog Directory Grid */
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: "ALL", label: "All Articles" },
                { id: "NEURAL_TECH", label: "Neural Tech" },
                { id: "SHOWBIZ", label: "Showbiz" },
                { id: "CREATOR_ECONOMY", label: "Creator Economy" },
                { id: "WEBXR", label: "WebXR & 3D" },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    spatialAudio.playClick();
                    setActiveCategory(cat.id);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap",
                    activeCategory === cat.id
                      ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-white/5 text-nexus-text-dim hover:text-white border border-white/5"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-nexus-text-dim" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search blogposts & guides..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-nexus-text-dim focus:outline-none focus:border-cyan-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBlogs.map(blog => (
              <div
                key={blog.id}
                onClick={() => {
                  spatialAudio.playHoloPinch();
                  setReadingBlog(blog);
                }}
                className="bg-[#0b1224] border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img src={blog.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1224] via-transparent to-black/30" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] font-mono font-bold text-cyan-300 uppercase">
                      {blog.category}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/20 border border-green-500/40 text-green-400 rounded text-[9px] font-mono font-bold">
                      SEO {blog.seoScore}%
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-nexus-text-dim mb-2">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{blog.publishedAt}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-nexus-text-dim mt-2 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap mt-3">
                      {blog.platforms.map((plat, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[8px] font-mono bg-white/5 border border-white/5 rounded text-cyan-200">
                          {plat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between text-[11px] font-mono text-nexus-text-dim">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" /> {blog.views}
                    </span>
                    <span>{blog.readTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditor(blog);
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-nexus-text-dim hover:text-white transition-all flex items-center gap-1 text-xs font-mono"
                      title="Edit Post"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <span className="text-cyan-400 text-xs font-bold hover:underline">Read →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Outline Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1224] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase font-mono text-white">AI BlogPost Ghostwriter</h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="text-nexus-text-dim hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Article Topic / Keyword Target</label>
                <input
                  type="text"
                  placeholder="e.g. Next-Gen Showbiz Hologram Streaming"
                  value={aiPromptTopic}
                  onChange={e => setAiPromptTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-nexus-text-dim font-mono text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAiOutline}
                disabled={isAiDrafting || !aiPromptTopic.trim()}
                className="px-4 py-2 bg-cyan-500 text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
              >
                <Sparkles className={cn("w-3.5 h-3.5", isAiDrafting && "animate-spin")} />
                <span>Generate Deep-Dive Post</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reader Modal */}
      <AnimatePresence>
        {readingBlog && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0b1224] border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden"
            >
              {/* Reader Header Bar */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-full font-bold">
                    {readingBlog.category}
                  </span>
                  <span className="text-xs font-mono text-nexus-text-dim flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {readingBlog.readTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(readingBlog.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all",
                      likedPosts[readingBlog.id]
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                        : "bg-white/5 border-white/10 text-nexus-text-dim hover:text-white"
                    )}
                  >
                    <Flame className={cn("w-3.5 h-3.5", likedPosts[readingBlog.id] && "text-rose-400 fill-rose-400")} />
                    <span>{readingBlog.likes}</span>
                  </button>

                  <button
                    onClick={() => copyArticleLink(readingBlog)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-nexus-text-dim hover:text-white transition-all"
                    title="Share link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedLink ? "Copied" : "Share"}</span>
                  </button>

                  <button
                    onClick={() => {
                      const postToEdit = readingBlog;
                      setReadingBlog(null);
                      handleOpenEditor(postToEdit);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-nexus-accent/15 hover:bg-nexus-accent/25 border border-nexus-accent/30 text-xs font-mono text-nexus-accent transition-all font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Post</span>
                  </button>

                  <button
                    onClick={() => setReadingBlog(null)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reader Body Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 custom-scrollbar">
                {/* Hero Banner */}
                <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 shadow-lg">
                  <img src={readingBlog.coverImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1224] via-black/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <h1 className="text-xl sm:text-3xl font-display font-bold text-white tracking-tight leading-snug">
                      {readingBlog.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-3 text-xs font-mono text-nexus-text-dim">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-[10px]">
                          {readingBlog.authorAvatar}
                        </span>
                        <span>{readingBlog.author} ({readingBlog.authorRole})</span>
                      </span>
                      <span>•</span>
                      <span>Published {readingBlog.publishedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Excerpt Lead */}
                <div className="p-4 rounded-xl bg-white/[0.03] border-l-4 border-cyan-400 text-sm text-cyan-200 font-sans leading-relaxed italic">
                  "{readingBlog.excerpt}"
                </div>

                {/* Markdown Prose */}
                <div className="prose prose-invert max-w-none text-nexus-text leading-relaxed font-sans space-y-4">
                  {readingBlog.content.split("\n\n").map((block, idx) => {
                    if (block.startsWith("# ")) {
                      return <h2 key={idx} className="text-xl sm:text-2xl font-bold font-display text-white pt-4 pb-1 border-b border-white/10">{block.replace("# ", "")}</h2>;
                    }
                    if (block.startsWith("## ")) {
                      return <h3 key={idx} className="text-lg font-bold font-display text-cyan-300 pt-3">{block.replace("## ", "")}</h3>;
                    }
                    if (block.startsWith("- ")) {
                      const items = block.split("\n").filter(Boolean);
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-1 text-nexus-text-dim text-sm pl-2">
                          {items.map((it, i) => <li key={i}>{it.replace(/^- /, "")}</li>)}
                        </ul>
                      );
                    }
                    if (/^\d+\./.test(block)) {
                      const items = block.split("\n").filter(Boolean);
                      return (
                        <ol key={idx} className="list-decimal list-inside space-y-1 text-nexus-text-dim text-sm pl-2">
                          {items.map((it, i) => <li key={i}>{it.replace(/^\d+\.\s*/, "")}</li>)}
                        </ol>
                      );
                    }
                    return <p key={idx} className="text-sm text-nexus-text-dim/90 leading-relaxed">{block}</p>;
                  })}
                </div>

                {/* Syndication & Tags */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-nexus-text-dim">Syndicated On:</span>
                    {readingBlog.platforms.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 text-[10px] font-mono bg-white/5 border border-white/10 rounded-lg text-cyan-300">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-nexus-text-dim">
                    <span>Views: {readingBlog.views}</span>
                    <span>SEO Rating: {readingBlog.seoScore}/100</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
