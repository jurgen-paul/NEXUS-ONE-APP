import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign, 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Star, 
  Tag, 
  ExternalLink, 
  ArrowUpRight, 
  Layers, 
  Briefcase, 
  Code, 
  Video, 
  Sparkle, 
  Award,
  ChevronRight,
  Send,
  X,
  FileCheck
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export type MarketplaceCategory = "ALL" | "GIGS" | "SPONSORSHIPS" | "ASSETS" | "SERVICES";

export interface MarketListing {
  id: string;
  title: string;
  category: "GIGS" | "SPONSORSHIPS" | "ASSETS" | "SERVICES";
  author: string;
  authorAvatar: string;
  authorRole: string;
  budget: string;
  rawBudgetNum: number;
  deliveryTime: string;
  escrowStatus: "SECURED" | "RELEASED" | "PENDING";
  description: string;
  tags: string[];
  bidsCount: number;
  featured?: boolean;
  rating: number;
}

const INITIAL_LISTINGS: MarketListing[] = [
  {
    id: "m-list-1",
    title: "Cyberpunk 4K AR Holographic UI Pack (Unity & WebXR Ready)",
    category: "ASSETS",
    author: "Vance Visuals",
    authorAvatar: "VV",
    authorRole: "Senior 3D Artist",
    budget: "$450 / License",
    rawBudgetNum: 450,
    deliveryTime: "Instant Download",
    escrowStatus: "SECURED",
    description: "60+ procedurally animated HUD widgets, LiDAR spatial shaders, and audio-reactive cyber particles optimized for WebXR.",
    tags: ["WebXR", "3D Shaders", "AR UI", "Assets"],
    bidsCount: 42,
    featured: true,
    rating: 4.9
  },
  {
    id: "m-list-2",
    title: "Lead Video Editor for 10-Episode Showbiz & Tech Docuseries",
    category: "GIGS",
    author: "Nexus Media Labs",
    authorAvatar: "NM",
    authorRole: "Studio Director",
    budget: "$8,500 Total",
    rawBudgetNum: 8500,
    deliveryTime: "3 Weeks",
    escrowStatus: "SECURED",
    description: "Looking for an elite colorist & editor experienced in fast-paced YouTube storytelling, sound design, and kinetic typography.",
    tags: ["Premiere", "After Effects", "Showbiz", "Docuseries"],
    bidsCount: 16,
    featured: true,
    rating: 5.0
  },
  {
    id: "m-list-3",
    title: "Sponsorship: Apex CyberDrink Q3 Influencer Campaign (3 Videos)",
    category: "SPONSORSHIPS",
    author: "Apex Global Brands",
    authorAvatar: "AG",
    authorRole: "Brand Partner",
    budget: "$15,000 + RevShare",
    rawBudgetNum: 15000,
    deliveryTime: "1 Month",
    escrowStatus: "SECURED",
    description: "Exclusive sponsorship integration for tech, gaming, or lifestyle creators with 500k+ followers. Dedicated promo code + hardware kit.",
    tags: ["Brand Deal", "Gaming", "TikTok", "YouTube"],
    bidsCount: 28,
    rating: 4.8
  },
  {
    id: "m-list-4",
    title: "Full Voiceover & Spatial HRTF Audio Acting for Sci-Fi Trailer",
    category: "SERVICES",
    author: "Elena Rostova",
    authorAvatar: "ER",
    authorRole: "Voice Artist",
    budget: "$1,200",
    rawBudgetNum: 1200,
    deliveryTime: "48 Hours",
    escrowStatus: "SECURED",
    description: "Bilingual voice talent with professional Neumann U87 studio setup, delivering broadcast-ready cinematic takes with binaural stems.",
    tags: ["Voiceover", "Audio Stems", "Commercial"],
    bidsCount: 9,
    rating: 4.95
  },
  {
    id: "m-list-5",
    title: "Solidity Smart Contract for Creator Royalty Splits & Escrows",
    category: "GIGS",
    author: "Oistarian Prime",
    authorAvatar: "OP",
    authorRole: "Founder",
    budget: "$4,200",
    rawBudgetNum: 4200,
    deliveryTime: "5 Days",
    escrowStatus: "SECURED",
    description: "Need an audited multi-signature escrow contract supporting automated token disbursements upon YouTube API view milestones.",
    tags: ["Smart Contract", "Solidity", "Web3", "Escrow"],
    bidsCount: 7,
    rating: 5.0
  }
];

export const MarketplaceTab: React.FC = () => {
  const [listings, setListings] = useState<MarketListing[]>(INITIAL_LISTINGS);
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  
  // Create Listing Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"GIGS" | "SPONSORSHIPS" | "ASSETS" | "SERVICES">("GIGS");
  const [newBudget, setNewBudget] = useState("");
  const [newDelivery, setNewDelivery] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");

  // Bid / Proposal Modal State
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidPitch, setBidPitch] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);

  const filteredListings = listings.filter(l => {
    const matchesCat = activeCategory === "ALL" || l.category === activeCategory;
    const matchesSearch = 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateListing = () => {
    if (!newTitle.trim() || !newBudget.trim()) return;
    spatialAudio.playTargetLock();

    const created: MarketListing = {
      id: `list-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      author: "Oistarian Prime",
      authorAvatar: "OP",
      authorRole: "Owner / Producer",
      budget: newBudget.startsWith("$") ? newBudget : `$${newBudget}`,
      rawBudgetNum: parseFloat(newBudget.replace(/[^0-9.]/g, "")) || 1000,
      deliveryTime: newDelivery || "7 Days",
      escrowStatus: "SECURED",
      description: newDescription || "High-priority deliverable with guaranteed escrow backing.",
      tags: newTags ? newTags.split(",").map(t => t.trim()) : ["Collab", "Nexus"],
      bidsCount: 0,
      rating: 5.0
    };

    setListings(prev => [created, ...prev]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewBudget("");
    setNewDescription("");
    setNewTags("");
  };

  const handleApplyBid = () => {
    if (!bidPitch.trim()) return;
    spatialAudio.playTargetLock();
    setBidSuccess(true);
    setTimeout(() => {
      setBidSuccess(false);
      setShowBidModal(false);
      if (selectedListing) {
        setListings(prev => prev.map(l => l.id === selectedListing.id ? { ...l, bidsCount: l.bidsCount + 1 } : l));
      }
      setBidPitch("");
      setBidAmount("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Escrow Telemetry */}
      <div className="bg-gradient-to-r from-[#0b1224] via-[#0f172a] to-[#0b1224] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-mono bg-nexus-accent/20 border border-nexus-accent/40 text-nexus-accent rounded-full font-bold uppercase">
              Smart Escrow Protocol v3.2
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-green-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Funds Backed
            </span>
          </div>
          <h2 className="text-xl font-bold font-display uppercase tracking-tight text-white">
            Nexus Creator Marketplace & Bounties
          </h2>
          <p className="text-xs text-nexus-text-dim mt-1 max-w-xl">
            Directly bid on verified production gigs, brand sponsorships, and trade specialized WebXR & AI assets with instant multi-sig escrow settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              spatialAudio.playScanSweep();
              setShowCreateModal(true);
            }}
            className="px-4 py-2.5 bg-nexus-accent hover:bg-nexus-accent/90 text-black font-bold font-mono text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(5,255,161,0.3)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post Gig / Bounty</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Opportunities" },
            { id: "GIGS", label: "Creator Gigs" },
            { id: "SPONSORSHIPS", label: "Brand Deals" },
            { id: "ASSETS", label: "Digital Assets" },
            { id: "SERVICES", label: "Production" },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                spatialAudio.playClick();
                setActiveCategory(cat.id as any);
              }}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all whitespace-nowrap",
                activeCategory === cat.id
                  ? "bg-nexus-accent text-black shadow-[0_0_12px_rgba(5,255,161,0.25)]"
                  : "bg-white/5 text-nexus-text-dim hover:text-white border border-white/5 hover:bg-white/10"
              )}
            >
              {cat.label}
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
            placeholder="Search gigs, assets, sponsors..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-nexus-text-dim focus:outline-none focus:border-nexus-accent/40"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map(item => (
          <div
            key={item.id}
            className={cn(
              "bg-[#0b1224] border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-nexus-accent/40 hover:shadow-[0_0_20px_rgba(5,255,161,0.1)] group relative",
              item.featured ? "border-nexus-accent/30 bg-gradient-to-b from-[#0e172e] to-[#0b1224]" : "border-white/10"
            )}
          >
            {item.featured && (
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-nexus-accent text-black text-[9px] font-mono font-bold uppercase rounded-full shadow-[0_0_10px_rgba(5,255,161,0.5)] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Featured Bounty
              </div>
            )}

            <div>
              {/* Category & Escrow Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                  "px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md border",
                  item.category === "GIGS" && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                  item.category === "SPONSORSHIPS" && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                  item.category === "ASSETS" && "bg-purple-500/10 text-purple-400 border-purple-500/30",
                  item.category === "SERVICES" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                )}>
                  {item.category}
                </span>

                <span className="flex items-center gap-1 text-[10px] font-mono text-green-400">
                  <ShieldCheck className="w-3 h-3" /> Escrow Locked
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-bold text-white group-hover:text-nexus-accent transition-colors leading-snug line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-nexus-text-dim mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[9px] font-mono bg-white/5 border border-white/5 rounded text-nexus-text-dim">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Actions */}
            <div className="pt-4 mt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[9px] font-mono uppercase text-nexus-text-dim block">Payout / Price</span>
                  <span className="text-sm font-mono font-bold text-nexus-accent">{item.budget}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono uppercase text-nexus-text-dim block">Delivery / Est.</span>
                  <span className="text-xs font-mono text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> {item.deliveryTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    spatialAudio.playScanSweep();
                    setSelectedListing(item);
                    setBidAmount(item.budget);
                    setShowBidModal(true);
                  }}
                  className="flex-1 py-2 bg-white/5 hover:bg-nexus-accent hover:text-black border border-white/10 hover:border-nexus-accent text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Proposal</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1224] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-nexus-accent" />
                <h3 className="text-sm font-bold uppercase font-mono text-white">Create Marketplace Bounty / Listing</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-nexus-text-dim hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. 3D Spatial Animator for Showbiz Hologram Reveal"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  >
                    <option value="GIGS">Creator Gig</option>
                    <option value="SPONSORSHIPS">Brand Sponsorship</option>
                    <option value="ASSETS">Digital Asset</option>
                    <option value="SERVICES">Production Service</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Budget / Price ($)</label>
                  <input
                    type="text"
                    placeholder="$3,500"
                    value={newBudget}
                    onChange={e => setNewBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Estimated Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Business Days"
                    value={newDelivery}
                    onChange={e => setNewDelivery(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="VFX, WebXR, Cinema4D"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline the scope of work, technical requirements, and deliverable format..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                />
              </div>
            </div>

            <div className="p-3 bg-nexus-accent/10 border border-nexus-accent/30 rounded-xl flex items-center gap-2 text-xs font-mono text-nexus-accent">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Listing will automatically initialize a smart contract escrow upon agreement.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-nexus-text-dim font-mono text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateListing}
                className="px-4 py-2 bg-nexus-accent text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_12px_rgba(5,255,161,0.3)]"
              >
                Publish Bounty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bid / Proposal Modal */}
      {showBidModal && selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1224] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-nexus-accent uppercase font-bold">Proposal Submission</span>
                <h3 className="text-sm font-bold text-white truncate max-w-sm">{selectedListing.title}</h3>
              </div>
              <button 
                onClick={() => setShowBidModal(false)}
                className="text-nexus-text-dim hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bidSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">Proposal Dispatched to Smart Escrow!</h4>
                <p className="text-xs text-nexus-text-dim font-mono">
                  Your credentials and quote have been routed to {selectedListing.author}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Your Proposed Quote</label>
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder="e.g. $4,000"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-nexus-text-dim block mb-1">Cover Pitch & Portfolio Reel Link</label>
                  <textarea
                    rows={4}
                    value={bidPitch}
                    onChange={e => setBidPitch(e.target.value)}
                    placeholder="Detail your experience, past campaign metrics, and why you are the best fit for this deliverable..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-nexus-accent/40"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowBidModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-nexus-text-dim font-mono text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyBid}
                    className="px-4 py-2 bg-nexus-accent text-black font-bold font-mono text-xs rounded-xl shadow-[0_0_12px_rgba(5,255,161,0.3)] flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Binding Bid</span>
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
