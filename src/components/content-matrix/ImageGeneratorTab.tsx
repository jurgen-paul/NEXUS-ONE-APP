import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Download, 
  Maximize2, 
  RefreshCw, 
  Copy, 
  Check, 
  Sliders, 
  Eye, 
  Layers, 
  Ratio, 
  Sun, 
  ShieldAlert, 
  X,
  Zap,
  Tag,
  Palette
} from "lucide-react";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export interface GeneratedImage {
  id: string;
  prompt: string;
  negativePrompt?: string;
  style: string;
  aspectRatio: string;
  cfgScale: number;
  seed: number;
  url: string;
  createdAt: string;
}

const SAMPLE_GALLERY: GeneratedImage[] = [
  {
    id: "img-1",
    prompt: "Futuristic android commander overlooking a glowing neon cyberpunk Tokyo metropolis in 2088, rainy reflections, volumetric neon blue and magenta lighting, photorealistic 8K render.",
    style: "Cyberpunk Neon",
    aspectRatio: "16:9",
    cfgScale: 7.5,
    seed: 48920194,
    url: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80",
    createdAt: "2 mins ago"
  },
  {
    id: "img-2",
    prompt: "Quantum microprocessor encased in floating geometric glass prisms, emitting pulsing cyan ionization beams, ultra-high resolution macro lens, cinematic depth of field.",
    style: "Surreal 3D",
    aspectRatio: "1:1",
    cfgScale: 8.0,
    seed: 92831093,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
    createdAt: "10 mins ago"
  },
  {
    id: "img-3",
    prompt: "Architectural blueprint of an interplanetary space station habitat, clean technical vector lines, isometric elevation cutaway, dark mode blueprint.",
    style: "Architectural Blueprint",
    aspectRatio: "16:9",
    cfgScale: 6.5,
    seed: 10482910,
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    createdAt: "30 mins ago"
  },
  {
    id: "img-4",
    prompt: "Ethereal digital oil portrait of a cybernetic oracle with gold leaf accents and luminescent neural markings, chiaroscuro lighting.",
    style: "Digital Oil Painting",
    aspectRatio: "9:16",
    cfgScale: 9.0,
    seed: 73920184,
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80",
    createdAt: "1 hour ago"
  }
];

const STYLE_PRESETS = [
  "Cyberpunk Neon",
  "Photoreal 8K",
  "Digital Oil Painting",
  "Architectural Blueprint",
  "Surreal 3D",
  "Anime Masterpiece",
  "Minimalist Vector"
];

const LIGHTING_PRESETS = [
  "Volumetric Sunbeams",
  "Cyber Neon Rim Light",
  "Studio Softbox Key",
  "Golden Hour Twilight",
  "Dark Moody Chiaroscuro"
];

export const ImageGeneratorTab: React.FC = () => {
  const [prompt, setPrompt] = useState(
    "Futuristic android commander overlooking a glowing neon cyberpunk Tokyo metropolis in 2088, rainy reflections, volumetric neon blue and magenta lighting, photorealistic 8K render."
  );
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, oversaturated, deformed hands, watermark");
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0]);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_PRESETS[1]);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [cfgScale, setCfgScale] = useState(7.5);
  const [seed, setSeed] = useState(48920194);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [gallery, setGallery] = useState<GeneratedImage[]>(SAMPLE_GALLERY);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    spatialAudio.playScanSweep();
    setIsGenerating(true);
    setProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      if (current >= 100) {
        clearInterval(interval);
        setProgress(100);
        setIsGenerating(false);
        spatialAudio.playTargetLock();

        const randomImages = [
          "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80",
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80"
        ];

        const uniqueId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newImg: GeneratedImage = {
          id: uniqueId,
          prompt,
          negativePrompt,
          style: selectedStyle,
          aspectRatio,
          cfgScale,
          seed: Math.floor(Math.random() * 99999999),
          url: randomImages[Math.floor(Math.random() * randomImages.length)],
          createdAt: "Just now"
        };

        setGallery((prev) => [newImg, ...prev.filter((item) => item.id !== uniqueId)]);
        setSelectedImage(newImg);
      } else {
        setProgress(current);
      }
    }, 150);
  };

  const handleCopyPrompt = (p: string, id: string) => {
    navigator.clipboard.writeText(p);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt & Image Parameter Controls (5 Cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-white/10 space-y-5 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
              <Palette className="w-5 h-5" />
              <span>Multi-Aspect Image Studio</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              8K SYNTHESIS
            </span>
          </div>

          {/* Positive Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">POSITIVE PROMPT</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Detailed description of subject, lighting, framing, textures, color scheme..."
              className="w-full bg-black/70 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Negative Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-nexus-text-dim block">NEGATIVE FILTER PROMPT</label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="w-full bg-black/70 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Style Presets */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">ARTISTIC PRESET</label>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_PRESETS.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStyle(st)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all border ${
                    selectedStyle === st
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold"
                      : "bg-white/[0.02] text-nexus-text-dim border-white/5 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio & Lighting */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-nexus-text-dim block mb-1">ASPECT RATIO</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                <option value="16:9">16:9 Landscape</option>
                <option value="1:1">1:1 Square</option>
                <option value="9:16">9:16 Story/Reel</option>
                <option value="4:3">4:3 Standard</option>
                <option value="3:2">3:2 Photography</option>
                <option value="21:9">21:9 Ultra-Wide</option>
              </select>
            </div>
            <div>
              <span className="text-[10px] text-nexus-text-dim block mb-1">LIGHTING RIG</span>
              <select
                value={selectedLighting}
                onChange={(e) => setSelectedLighting(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-2 text-white text-xs focus:border-cyan-400 focus:outline-none"
              >
                {LIGHTING_PRESETS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CFG Guidance Scale Slider */}
          <div className="space-y-2 p-3 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-nexus-text-dim flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>CFG PROMPT GUIDANCE</span>
              </span>
              <span className="text-cyan-300 font-bold">{cfgScale.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={cfgScale}
              onChange={(e) => setCfgScale(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Generate Button */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-black font-bold text-xs font-mono rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 text-black animate-spin" />
                  <span>Synthesizing High-Res Pixels ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Generate 8K Masterpiece</span>
                </>
              )}
            </button>

            {isGenerating && (
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  animate={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Generated Gallery & Showcase (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Main Selected Showcase */}
          {selectedImage ? (
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black min-h-[340px] flex flex-col justify-between shadow-2xl group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${selectedImage.url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
              </div>

              {/* Top Banner */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs font-mono text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-cyan-300">{selectedImage.style}</span>
                  <span className="text-nexus-text-dim">| {selectedImage.aspectRatio}</span>
                  <span className="text-nexus-text-dim">| CFG {selectedImage.cfgScale}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPrompt(selectedImage.prompt, selectedImage.id)}
                    className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 hover:bg-white/10 text-nexus-text-dim hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
                  >
                    {copiedId === selectedImage.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">Copy Prompt</span>
                  </button>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-1.5">
                <p className="text-xs text-white leading-relaxed font-mono">
                  "{selectedImage.prompt}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-nexus-text-dim font-mono">
                  <span>SEED: #{selectedImage.seed}</span>
                  <span>RENDERED: {selectedImage.createdAt}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-[340px] rounded-3xl border border-dashed border-white/10 bg-black/40 flex flex-col items-center justify-center p-6 text-center space-y-2">
              <Palette className="w-10 h-10 text-cyan-400/40" />
              <p className="text-sm font-bold text-white">No Image Selected</p>
              <p className="text-xs text-nexus-text-dim max-w-sm">
                Click any thumbnail from the gallery below or generate a new high-resolution render.
              </p>
            </div>
          )}

          {/* Gallery Grid */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-nexus-text-dim block uppercase">
              RECENT GENERATED ARTWORKS ({gallery.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  onClick={() => {
                    spatialAudio.playHoloPinch();
                    setSelectedImage(img);
                  }}
                  className={`relative rounded-2xl overflow-hidden border cursor-pointer group transition-all h-28 ${
                    selectedImage?.id === img.id
                      ? "border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                    <p className="text-[10px] font-mono text-cyan-300 font-bold truncate">{img.style}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
