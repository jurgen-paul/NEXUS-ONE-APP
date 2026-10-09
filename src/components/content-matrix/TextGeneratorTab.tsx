import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  BookOpen, 
  Share2, 
  Tag, 
  TrendingUp, 
  Eye, 
  Layers,
  Feather,
  AlignLeft,
  CheckCircle2
} from "lucide-react";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export type TextContentType = 
  | "article" 
  | "landing_copy" 
  | "social_thread" 
  | "seo_blog" 
  | "press_release" 
  | "video_script";

const PRESET_TOPICS: Record<TextContentType, { title: string; prompt: string; sampleOutput: string }> = {
  article: {
    title: "Quantum Neural Architectures in 2026",
    prompt: "Write a comprehensive deep-dive into decentralized neural networks and how sub-millimeter optical waveguides eliminate edge computing bottlenecks.",
    sampleOutput: `# The Post-Silicon Paradigm: Quantum Neural Architectures in 2026

## Executive Summary
As classical silicon lithography approaches theoretical quantum tunneling limits, next-generation decentralized infrastructure is pivoting toward hybrid photonic-neural compute topologies. This architectural evolution delivers a 100x reduction in thermal dissipation while achieving sub-millisecond photon-to-decision latency.

### Key Architectural Pillars:
1. **Sub-Millimeter Optical Waveguides**: Routing optical data packets with near-zero dielectric loss.
2. **Dynamic Tensor Sharding**: Distributing multimodal weights across 64 global edge nodes.
3. **Decentralized Cryptographic Proofs**: Guaranteeing verifiable model execution via zero-knowledge state anchors.

---

### Benchmark Comparisons:
- **Energy Efficiency**: 0.04 J / Billion Token Inferences (down 82% YoY)
- **Mean Pipeline Jitter**: ±0.012 ms across geo-distributed clusters
- **Fault Recovery Time**: Instantaneous hot-swapping under 45 μs

> *"The convergence of spatial computing, photonic routing, and autonomous agent swarms represents the single largest leap in computational throughput since the transistor."*

---
*Authored by NEXUS Neural Research Division*`
  },
  landing_copy: {
    title: "SaaS Hero & High-Converting Landing Copy",
    prompt: "Create high-converting hero headline, sub-headline, value propositions, and CTA copy for an autonomous AI command center.",
    sampleOutput: `<!-- HERO SECTION -->
# The Autonomous Operating System for Global Innovators
## Unify generative multimodal intelligence, 3D spatial optics, and autonomous workflow pipelines into a single decentralized command deck.

[ Claim Commander Token — Free Instant Access ]
*No credit card required. AES-256 encrypted.*

---

### Core Value Pillars:
- **Multi-Modal Synthesis at 120 FPS**: Generate 4K video, 8K imagery, production-grade code, and full-length books with a single prompt.
- **Sub-Millimeter 6DoF Spatial Tracking**: Real-time LiDAR point-cloud projection and holographic gyroscopic telemetry.
- **Zero-Latency Global Telemetry**: Live interactive satellite routing, weather radar, and autonomous agent orchestration.

---

### Social Proof & Accreditations:
Trusted by over 45,000+ engineers, researchers, and creators across 120+ countries.`
  },
  social_thread: {
    title: "Viral 6-Post Thread for X / LinkedIn",
    prompt: "Generate an engaging viral thread breaking down how AI agents are transforming autonomous enterprise operations.",
    sampleOutput: `🧵 1/6: The era of fragmented SaaS tools is officially over. 

We just deployed our autonomous agent matrix across 64 global nodes. Here is the exact architecture we used to achieve 10x output with zero overhead: 👇

---

🧵 2/6: The Bottleneck Was Never Compute — It Was Context.
Traditional workflows lose 60% of context switching between docs, code editors, and analytics decks. 

By unifying all modalities into a single neural synapse, decision latency drops from hours to milliseconds.

---

🧵 3/6: Multi-Modal Ingestion in Action:
- Voice HUD (Alt + V) triggers instant teleportation
- 64-Beam LiDAR feeds 3D room coordinates straight into reasoning engines
- Automated code compilers deploy verified artifacts in seconds

---

🧵 4/6: The Math Behind the Efficiency:
- 85% reduction in manual data formatting
- 99.98% quantum coherence in state synchronization
- $0 spent on redundant API middleware

---

🧵 5/6: Autonomous Co-Workers > Static Dashboards.
When your tools talk to each other natively, your focus shifts 100% to creative architecture and strategic leverage.

---

🧵 6/6: Ready to experience the new standard of spatial AI?
Explore NEXUS ONE today: nexus.one/tour 🚀`
  },
  seo_blog: {
    title: "SEO Guide: How to Scale Generative Workflows",
    prompt: "Write an SEO-optimized guide targeting high-intent keywords like 'multimodal AI workflow', 'autonomous agent cluster', and 'spatial computing command'.",
    sampleOutput: `# How to Scale Multimodal AI Workflows in 2026: A Complete Guide

**Meta Description**: Discover how modern creators and enterprise teams are leveraging autonomous agent clusters and spatial computing to scale multimodal AI workflows 10x faster.

**Target Keywords**: multimodal AI workflow, autonomous agent cluster, 3D spatial computing, neural command deck.

## Introduction
The modern digital landscape demands more than isolated text prompts. Today's high-velocity creators and technical leaders rely on integrated multimodal architectures capable of generating video, code, visual assets, and strategic copy simultaneously.

## Step 1: Centralizing Neural Context Windows
Avoid fragmented toolchains. Deploying a unified agent cluster ensures your visual models, code generators, and analytical engines share continuous vector memory.

## Step 2: Integrating Spatial Telemetry
Connecting 3D LiDAR data and visual odometry with generative reasoning unlocks true context-aware digital twins.

## Conclusion
Adopting an autonomous operating system is no longer optional for high-growth technical enterprises.`
  },
  press_release: {
    title: "Official Press Release: NEXUS ONE V4 Release",
    prompt: "Draft an official corporate press release announcing the global rollout of the NEXUS ONE multimodal suite.",
    sampleOutput: `FOR IMMEDIATE RELEASE

# NEXUS ONE Unveils Autonomous Multimodal Command Center Featuring 3D LiDAR Spatial Viewfinder and Multi-Agent Orchestration

**SAN FRANCISCO, CA — AUGUST 2026** — NEXUS ONE, a pioneer in autonomous neural computing systems, today announced the public release of its enterprise platform. 

The update introduces an industry-first integration of real-time 64-beam LiDAR point-cloud scanning, multi-aspect 8K generative media studios, and hands-free voice telemetry overlays.

"Our mission with NEXUS ONE is to collapse the friction between thought and production," said the Head of Systems Architecture. "Whether you are architecting a distributed smart contract or directing a 4K cinematic video, NEXUS delivers instantaneous leverage."

### Availability:
The NEXUS ONE suite is available immediately for all verified accountholders globally at https://nexus.one.

### Media Contact:
Press Office, press@nexus.one`
  },
  video_script: {
    title: "YouTube Video Script with Visual Cues",
    prompt: "Create a fast-paced, high-retention video script explaining the future of autonomous creative studios.",
    sampleOutput: `[VIDEO TITLE]: I Replaced 10 Apps with ONE Autonomous AI System (Here's What Happened)

[0:00 - 0:15] HOOK & FAST MONTAGE
(VISUAL: Rapid jump-cuts of holographic AR HUD, 3D LiDAR point clouds orbiting, and 4K AI video generation.)
HOST: "Most people are still juggling 15 different browser tabs just to make one piece of content. Today, we're changing that forever."

[0:15 - 0:45] THE PROBLEM: CONTEXT FRAGMENTATION
(VISUAL: Host at workstation pointing to the unified NEXUS dashboard.)
HOST: "When your image generator doesn't talk to your code editor, and your code editor doesn't know what your analytics team is doing, you waste hours. Look at what happens when we connect everything into a single neural core."

[0:45 - 1:30] LIVE DEMO: MULTI-MODAL SYNTHESIS
(VISUAL: Screen recording showing voice command 'Alt + V' activating, generating a full blog, code repo, and 4K video simultaneously.)
HOST: "In less than 10 seconds, we have a production-ready asset pipeline ready for deployment."

[1:30 - END] CALL TO ACTION
(VISUAL: Host overlay with tour launch link.)
HOST: "Hit that like button, subscribe, and take the system tour below to test it yourself."`
  }
};

const TONES = ["Visionary", "Authoritative", "Persuasive", "Casual & Engaging", "Technical & Academic"];

export const TextGeneratorTab: React.FC = () => {
  const [selectedType, setSelectedType] = useState<TextContentType>("article");
  const [prompt, setPrompt] = useState(PRESET_TOPICS.article.prompt);
  const [output, setOutput] = useState(PRESET_TOPICS.article.sampleOutput);
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [targetWordCount, setTargetWordCount] = useState(600);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTypeSelect = (type: TextContentType) => {
    spatialAudio.playHoloPinch();
    setSelectedType(type);
    setPrompt(PRESET_TOPICS[type].prompt);
    setOutput(PRESET_TOPICS[type].sampleOutput);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    spatialAudio.playScanSweep();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      spatialAudio.playTargetLock();
      setOutput(PRESET_TOPICS[selectedType].sampleOutput);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-${selectedType}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Word count & Read time calculation
  const words = output.trim().split(/\s+/).length;
  const readTimeMin = Math.ceil(words / 200);

  return (
    <div className="space-y-6">
      {/* Type Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: "article" as TextContentType, label: "Long-Form Article" },
          { id: "landing_copy" as TextContentType, label: "Landing Page Copy" },
          { id: "social_thread" as TextContentType, label: "Viral Social Thread" },
          { id: "seo_blog" as TextContentType, label: "SEO Blog Post" },
          { id: "press_release" as TextContentType, label: "Press Release" },
          { id: "video_script" as TextContentType, label: "Video Script & Cues" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTypeSelect(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
              selectedType === tab.id
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20"
                : "bg-black/60 text-nexus-text-dim border-white/10 hover:border-white/25 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt & Parameters (5 Cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-white/10 space-y-5 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
              <Feather className="w-5 h-5" />
              <span>Neural Copywriting Engine</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              GPT-4 / GEMINI 3.7
            </span>
          </div>

          {/* Prompt Area */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">WRITING DIRECTIVE & KEYWORDS</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Outline the core objective, key themes, target keywords, or specific angles..."
              className="w-full bg-black/70 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">TONE OF VOICE</label>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTone(t)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all border ${
                    selectedTone === t
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                      : "bg-white/[0.02] text-nexus-text-dim border-white/5 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Target Word Count */}
          <div className="space-y-2 p-3 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-nexus-text-dim flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>TARGET WORD COUNT</span>
              </span>
              <span className="text-cyan-300 font-bold">{targetWordCount} words</span>
            </div>
            <input
              type="range"
              min="150"
              max="2500"
              step="50"
              value={targetWordCount}
              onChange={(e) => setTargetWordCount(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-black font-bold text-xs font-mono rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 text-black animate-spin" />
                  <span>Synthesizing Copy & Rhetorical Flow...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Generate Polished Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Markdown Editor & Output View (7 Cols) */}
        <div className="lg:col-span-7 glass p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60 backdrop-blur-xl flex flex-col justify-between">
          <div>
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3 font-mono text-xs text-nexus-text-dim">
                <span>Words: <strong className="text-white">{words}</strong></span>
                <span>•</span>
                <span>Est. Read: <strong className="text-cyan-300">{readTimeMin} min</strong></span>
                <span>•</span>
                <span>Tone: <strong className="text-white">{selectedTone}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white border border-white/10 transition-colors"
                  title="Download Markdown File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Output Box */}
            <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto custom-scrollbar select-text">
              {output}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-nexus-text-dim pt-2 border-t border-white/5">
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Readability Grade: 94% (High Engagement)</span>
            </span>
            <span>UTF-8 Markdown Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
