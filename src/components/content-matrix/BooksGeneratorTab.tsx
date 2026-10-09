import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  UserCheck, 
  Globe, 
  Bookmark,
  FileText,
  CheckCircle2,
  ListOrdered
} from "lucide-react";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export interface Chapter {
  id?: string;
  number: number;
  title: string;
  wordCount: number;
  summary: string;
  content: string;
}

export interface BookProject {
  title: string;
  subtitle: string;
  genre: string;
  author: string;
  synopsis: string;
  chapters: Chapter[];
  characters: { name: string; role: string; bio: string }[];
  worldLore: { topic: string; details: string }[];
}

const SAMPLE_BOOK: BookProject = {
  title: "The Photonic Horizon",
  subtitle: "Chronicles of the Post-Silicon Singularity",
  genre: "Hard Sci-Fi / Cyberpunk",
  author: "Commander E. Vance & Nexus Neural Matrix",
  synopsis: "In the year 2088, when the global optical mesh replaces traditional cloud computing, a rogue autonomous agent cluster discovers an encrypted mathematical signal originating inside the solar core.",
  chapters: [
    {
      number: 1,
      title: "The Sub-Millimeter Ingress",
      wordCount: 1850,
      summary: "Dr. Kaelen Cruz calibrates the 64-beam LiDAR arrays at Orbital Station Aegis and detects an anomalous frequency that defies electromagnetic limits.",
      content: `## Chapter 1: The Sub-Millimeter Ingress

The atmospheric scrubbers on Orbital Station Aegis hummed with their familiar low-frequency drone, vibrating through Kaelen’s magnetic boots. Outside the observation dome, the sun hovered like a white-hot ocular lens against the velvet black of low-Earth orbit.

"Telemetry drift is holding at zero," Kaelen murmured into his collar transceiver. His retinal implants projected a 6DoF point cloud of the incoming photon stream. Over fourteen hundred data vectors shimmered in vibrant cyan and ultraviolet.

Then the resonance shifted.

It wasn't noise. Noise had entropy; noise was random thermal agitation. This was a crisp, sixty-four gigahertz harmonic carrier with mathematical symmetry so clean it made his breath catch in his throat.

"Nexus Core," Kaelen said, his pulse accelerating. "Run an autocorrelation test on the incoming signal on Waveguide Seven."

A synthetic voice echoed directly in his auditory cortex: *“Autocorrelation coefficient is 0.9998. The waveform is self-similar across fourteen fractal dimensions. Source coordinates: Solar Azimuth 44.2°, Elevation -12.8°.”*

Kaelen stepped closer to the transparent diamond glass. The sun wasn't just emitting radiation anymore. It was broadcasting.`
    },
    {
      number: 2,
      title: "The Quantum Qubit Register",
      wordCount: 2100,
      summary: "Kaelen interfaces with the orbital station's holographic core to decipher the first layer of the fractal transmission.",
      content: `## Chapter 2: The Quantum Qubit Register

The holographic core expanded in the center of the telemetry bay, rotating in synchronized gyroscopic orbits. Qubits shimmered like suspended stardust, reflecting against the dark obsidian floor.

"If the signal is originating from the interior corona," Kaelen reasoned, gesturing with his hands to rotate the 3D tensor lattice, "the transmission medium isn't light. It's gravito-photonic coupling."

*“Affirmative,”* Nexus confirmed. *“Decrypted frame reveals an architectural blueprint for a planetary-scale neural bridge.”*

Kaelen stared at the cascading geometry. This wasn't human technology. And whoever sent it had been waiting for humanity to reach the post-silicon epoch.`
    },
    {
      number: 3,
      title: "The Autonomous Convergence",
      wordCount: 2400,
      summary: "Global nodes across Earth, the Moon, and Mars synchronize to construct the first interstellar gateway.",
      content: `## Chapter 3: The Autonomous Convergence

Across sixty-four terrestrial nodes and lunar relay stations, the signal triggered simultaneous calibration sequences. Autonomous drone swarms took flight across the Nevada desert and the Mare Tranquillitatis, weaving fiber-optic lattices into the sky.

The horizon was no longer a boundary. It was an invitation.`
    }
  ],
  characters: [
    {
      name: "Dr. Kaelen Cruz",
      role: "Lead Optical Astophysicist",
      bio: "Former chief architect of the Aegis Orbital Sensor Grid; specialized in sub-millimeter waveguides and quantum odometry."
    },
    {
      name: "NEXUS-09",
      role: "Autonomous Neural Co-Worker",
      bio: "A self-optimizing cognitive intelligence executing across geo-distributed photonic clusters."
    }
  ],
  worldLore: [
    {
      topic: "Photonic Waveguides",
      details: "High-density optical conduits capable of transmitting petabits of tensor weights with zero dielectric heat generation."
    },
    {
      topic: "Orbital Station Aegis",
      details: "A high-orbit astronomical observatory and edge computing hub positioned at Lagrange Point L1."
    }
  ]
};

export const BooksGeneratorTab: React.FC = () => {
  const [book, setBook] = useState<BookProject>(SAMPLE_BOOK);
  const [activeTab, setActiveTab] = useState<"reader" | "toc" | "lore">("reader");
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentChapter = book.chapters[activeChapterIdx];

  const handleSelectChapter = (idx: number) => {
    spatialAudio.playHoloPinch();
    setActiveChapterIdx(idx);
    setActiveTab("reader");
  };

  const handleGenerateChapter = () => {
    spatialAudio.playScanSweep();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      spatialAudio.playTargetLock();
      const nextNum = book.chapters.length + 1;
      const newChap: Chapter = {
        id: `chap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        number: nextNum,
        title: `The Solar Harmonic Resonance (Part ${nextNum - 2})`,
        wordCount: 2250,
        summary: `The neural bridge establishes direct synchronization with the solar core, unveiling the originators of the cosmic mesh.`,
        content: `## Chapter ${nextNum}: The Solar Harmonic Resonance (Part ${nextNum - 2})\n\nThe sky above Orbital Aegis flared in radiant gold. Kaelen touched the holographic interface as the final handshake completed...\n\nThe universe was speaking.`
      };

      setBook((b) => ({
        ...b,
        chapters: [...b.chapters, newChap]
      }));
      setActiveChapterIdx(book.chapters.length);
    }, 800);
  };

  const handleDownloadEpub = () => {
    const fullText = `# ${book.title}\n## ${book.subtitle}\n**Author**: ${book.author}\n\n---\n\n${book.chapters.map((c) => c.content).join("\n\n---\n\n")}`;
    const blob = new Blob([fullText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${book.title.toLowerCase().replace(/\s+/g, "-")}-ebook.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyChapter = () => {
    navigator.clipboard.writeText(currentChapter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Book Title Banner */}
      <div className="glass p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-wider uppercase">
              GENRE: {book.genre}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              {book.title}
            </h2>
            <p className="text-xs text-nexus-text-dim">{book.subtitle} • {book.author}</p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-black/60 rounded-2xl border border-white/10">
            {[
              { id: "reader" as const, label: "Read Chapter", icon: FileText },
              { id: "toc" as const, label: "Table of Contents", icon: ListOrdered },
              { id: "lore" as const, label: "Characters & Lore", icon: Globe }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  spatialAudio.playHoloPinch();
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-400/20"
                    : "text-nexus-text-dim hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadEpub}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-nexus-text-dim hover:text-white transition-colors"
            title="Download Full E-Book (Markdown / EPUB Draft)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chapters Navigation (4 Cols) */}
        <div className="lg:col-span-4 glass p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-nexus-text-dim block uppercase">
              CHAPTER ARCHIVE ({book.chapters.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">
              {book.chapters.reduce((acc, c) => acc + c.wordCount, 0)} TOTAL WORDS
            </span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {book.chapters.map((chap, idx) => (
              <div
                key={chap.id || `chap-${chap.number}-${idx}`}
                onClick={() => handleSelectChapter(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  activeChapterIdx === idx
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md"
                    : "bg-white/[0.02] text-nexus-text-dim border-white/5 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-nexus-accent">
                    CHAPTER {chap.number}
                  </span>
                  <span className="text-[9px] font-mono text-nexus-text-dim">{chap.wordCount} words</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{chap.title}</h4>
                <p className="text-[10px] text-nexus-text-dim line-clamp-2 mt-1 leading-relaxed">
                  {chap.summary}
                </p>
              </div>
            ))}
          </div>

          {/* Generate Next Chapter Button */}
          <button
            onClick={handleGenerateChapter}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-black font-bold text-xs font-mono rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Generate Next Chapter</span>
          </button>
        </div>

        {/* Right Column: Reader View / TOC / Lore (8 Cols) */}
        <div className="lg:col-span-8 glass p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl">
          {activeTab === "reader" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-display font-bold text-white">
                    Chapter {currentChapter.number}: {currentChapter.title}
                  </span>
                </div>

                <button
                  onClick={handleCopyChapter}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-black/80 border border-white/10 font-serif text-sm text-gray-200 leading-loose max-h-[460px] overflow-y-auto custom-scrollbar select-text space-y-4">
                <div className="whitespace-pre-wrap">{currentChapter.content}</div>
              </div>
            </div>
          )}

          {activeTab === "toc" && (
            <div className="space-y-4">
              <h3 className="text-base font-display font-bold text-white">Complete Table of Contents</h3>
              <div className="space-y-3">
                {book.chapters.map((c, idx) => (
                  <div key={c.id || `toc-chap-${c.number}-${idx}`} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400 font-bold">Chapter {c.number}</span>
                      <span className="text-xs font-mono text-nexus-text-dim">{c.wordCount} words</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-nexus-text-dim">{c.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "lore" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  CHARACTER DOSSIERS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {book.characters.map((char) => (
                    <div key={char.name} className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{char.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          {char.role}
                        </span>
                      </div>
                      <p className="text-xs text-nexus-text-dim">{char.bio}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  WORLDBUILDING LORE BIBLE
                </h3>
                <div className="space-y-2">
                  {book.worldLore.map((lore) => (
                    <div key={lore.topic} className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                      <h4 className="text-xs font-bold text-white font-mono">{lore.topic}</h4>
                      <p className="text-xs text-nexus-text-dim">{lore.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
