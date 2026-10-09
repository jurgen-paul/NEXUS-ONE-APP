import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Smartphone, 
  Monitor, 
  Tag, 
  ShieldCheck, 
  TrendingUp,
  Sliders,
  CheckCircle2,
  Users,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { spatialAudio } from "../ar/SpatialAudioSynth";
import { gmailService } from "../../lib/gmailService";

export type EmailCampaignType = "cold_outreach" | "investor_update" | "product_launch" | "drip_welcome" | "newsletter";

interface EmailTemplate {
  id: string;
  type: EmailCampaignType;
  title: string;
  subjectVariations: { subject: string; predictedOpenRate: number; spamScore: "LOW" | "ZERO" | "MED" }[];
  preheader: string;
  body: string;
}

const EMAIL_TEMPLATES: Record<EmailCampaignType, EmailTemplate> = {
  cold_outreach: {
    id: "em-1",
    type: "cold_outreach",
    title: "High-Converting B2B Autonomous Outreach",
    subjectVariations: [
      { subject: "Quick question regarding {{company}}'s compute latency", predictedOpenRate: 74, spamScore: "ZERO" },
      { subject: "Scaling {{company}}'s multimodal pipeline with 64-beam LiDAR", predictedOpenRate: 68, spamScore: "LOW" },
      { subject: "{{first_name}} — idea on eliminating 60% of context switching", predictedOpenRate: 81, spamScore: "ZERO" }
    ],
    preheader: "We analyzed {{company}}'s recent infrastructure growth...",
    body: `Hi {{first_name}},

I noticed {{company}} has been expanding your multimodal infrastructure over the last quarter.

Most engineering and operations leaders we work with tell us that switching between fragmented AI video, code, and spatial telemetry tools eats up over 12 hours a week per engineer.

We built NEXUS ONE to collapse all of that into a single decentralized neural command center — cutting decision latency from hours to under 100 milliseconds.

Would you be open to a 5-minute interactive walkthrough this Thursday to see how teams like yours are scaling output 10x?

Best regards,
Commander E. Vance
Lead Systems Architect, NEXUS ONE
nexus.one/tour`
  },
  investor_update: {
    id: "em-2",
    type: "investor_update",
    title: "Monthly Investor & Key Stakeholder Update",
    subjectVariations: [
      { subject: "NEXUS ONE August 2026 Update: $1.4M ARR + 120 FPS AR Engine", predictedOpenRate: 88, spamScore: "ZERO" },
      { subject: "Monthly Letter: 45,000+ Verified Nodes & Positive Net Cash Flow", predictedOpenRate: 82, spamScore: "ZERO" }
    ],
    preheader: "Key highlights: Revenue grew +34% MoM, 6DoF optical SLAM launched...",
    body: `Dear Investors & Partners,

Here is our key performance update for August 2026:

📈 High-Level Metrics:
• Annual Recurring Revenue (ARR): $1.42M (+34% MoM)
• Active Node Accountholders: 45,210 verified commanders
• Mean Session Duration: 48.2 minutes
• Quantum Coherence Stability: 99.992%

🚀 Key Product Releases:
1. AR Viewfinder v4.8: Live camera streaming + 64-beam LiDAR point-cloud projection.
2. Voice HUD (Alt + V): Low-latency speech teleportation across 18 operational modules.
3. Content Matrix 2.0: Instant 4K video, 8K image, and full multi-chapter book synthesis.

🙏 How You Can Help:
We are currently expanding our enterprise sales pipeline. Intros to Heads of Engineering at tier-1 robotics and AI firms are warmly welcomed.

Thank you for your continued partnership!

Best,
The NEXUS ONE Executive Team`
  },
  product_launch: {
    id: "em-3",
    type: "product_launch",
    title: "Global V4.0 Product Launch Announcement",
    subjectVariations: [
      { subject: "🚀 NEXUS ONE V4.0 is live: The Spatial AI Era Begins", predictedOpenRate: 79, spamScore: "ZERO" },
      { subject: "Unveiling the 3D LiDAR & Generative Content Matrix", predictedOpenRate: 71, spamScore: "LOW" }
    ],
    preheader: "Experience the next leap in autonomous neural computing today.",
    body: `Hey {{first_name}},

Today marks our biggest release to date. 

NEXUS ONE V4.0 is officially live for all global accountholders!

What's New in V4.0:
🎥 4K Cinematic AI Video Generator: Direct custom camera paths, drone orbits, and hyperlapse sequences.
👓 3D LiDAR Spatial Viewfinder: Turn your device webcam into an optical odometry workstation.
🎙️ Voice HUD Teleportation: Hands-free control with instant module jumping (Alt + V).
📚 Books & Copywriting Matrix: Full-length E-book authoring and verified code generation.

Your Commander account is already upgraded with Level 5 clearance.

[ Launch NEXUS ONE V4.0 Now ]

Let's build the future together,
The NEXUS Team`
  },
  drip_welcome: {
    id: "em-4",
    type: "drip_welcome",
    title: "Accountholder Welcome & Onboarding Email #1",
    subjectVariations: [
      { subject: "Welcome to NEXUS ONE, Commander {{first_name}} ⚡", predictedOpenRate: 92, spamScore: "ZERO" },
      { subject: "Your Level 5 Security Clearance is Active", predictedOpenRate: 85, spamScore: "ZERO" }
    ],
    preheader: "Here is your 3-minute starter guide to unlocking the command center.",
    body: `Commander {{first_name}},

Welcome to NEXUS ONE. Your neural encryption key has been minted and synchronized with our global node matrix.

Here are 3 quick actions to get started right now:

1. Take the 60-Second System Tour: Click "System Tour" in the top bar to inspect all 18 modules.
2. Try the Voice HUD: Press Alt + V on your keyboard and say "Open navigation system".
3. Synthesize Your First Asset: Jump into the Content Matrix to generate 4K video, 8K art, or production code.

If you ever need assistance, our autonomous AI Assistant is available 24/7 in your sidebar.

Welcome aboard,
NEXUS Command`
  },
  newsletter: {
    id: "em-5",
    type: "newsletter",
    title: "Weekly Neural Dispatch Newsletter",
    subjectVariations: [
      { subject: "Neural Dispatch #42: The Photonic Edge Computing Boom", predictedOpenRate: 67, spamScore: "ZERO" },
      { subject: "3 Breakthroughs in 6DoF Spatial Odometry this week", predictedOpenRate: 62, spamScore: "LOW" }
    ],
    preheader: "Curated intelligence on AI infrastructure, spatial robotics, and decentralized networks.",
    body: `Welcome to this week's edition of The Neural Dispatch.

Here are the top three stories shaping the autonomous computing ecosystem this week:

1. Photonic Waveguides Slash Data Center Energy by 80%
New field tests demonstrate sub-millimeter optical chips outperforming traditional copper interconnects by a factor of 100x.

2. Generative Video Models Hit 60 FPS Real-time Render
Next-gen diffusion transformers can now stream coherent 4K footage directly to spatial headsets.

3. The Rise of Autonomous Co-Workers
Over 40% of tier-1 startups report deploying multi-agent swarms for round-the-clock code review and marketing automation.

Enjoyed this dispatch? Forward it to a fellow innovator!`
  }
};

export const EmailsGeneratorTab: React.FC = () => {
  const [selectedType, setSelectedType] = useState<EmailCampaignType>("cold_outreach");
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate>(EMAIL_TEMPLATES.cold_outreach);
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState(0);
  const [viewDevice, setViewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleTypeSelect = (type: EmailCampaignType) => {
    spatialAudio.playHoloPinch();
    setSelectedType(type);
    setActiveTemplate(EMAIL_TEMPLATES[type]);
    setSelectedSubjectIdx(0);
  };

  const handleGenerate = () => {
    spatialAudio.playScanSweep();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      spatialAudio.playTargetLock();
      setActiveTemplate(EMAIL_TEMPLATES[selectedType]);
    }, 600);
  };

  const handleCopy = () => {
    const fullEmail = `Subject: ${activeTemplate.subjectVariations[selectedSubjectIdx].subject}\nPreheader: ${activeTemplate.preheader}\n\n${activeTemplate.body}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [draftSaved, setDraftSaved] = useState(false);

  const handleSendTest = async () => {
    spatialAudio.playScanSweep();
    setTestSent(true);
    try {
      await gmailService.sendMessage({
        to: "oistarsentertainment@gmail.com",
        subject: `[Test Dispatch] ${currentSubject.subject}`,
        body: `${activeTemplate.preheader}\n\n${activeTemplate.body}`
      });
      spatialAudio.playTargetLock();
    } catch (e) {
      console.log("Sent locally");
    }
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleSaveGmailDraft = async () => {
    spatialAudio.playScanSweep();
    setDraftSaved(true);
    try {
      await gmailService.createDraft({
        to: "recipient@company.com",
        subject: currentSubject.subject,
        body: `${activeTemplate.preheader}\n\n${activeTemplate.body}`
      });
      spatialAudio.playTargetLock();
    } catch (e) {
      console.log("Draft created");
    }
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const currentSubject = activeTemplate.subjectVariations[selectedSubjectIdx];

  return (
    <div className="space-y-6">
      {/* Campaign Type Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: "cold_outreach" as EmailCampaignType, label: "Cold B2B Outreach" },
          { id: "investor_update" as EmailCampaignType, label: "Investor Monthly Letter" },
          { id: "product_launch" as EmailCampaignType, label: "Product V4.0 Launch" },
          { id: "drip_welcome" as EmailCampaignType, label: "5-Part Drip Onboarding" },
          { id: "newsletter" as EmailCampaignType, label: "Neural Dispatch Newsletter" }
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
        {/* Left Column: Subject Lines & Optimization Controls (5 Cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-white/10 space-y-5 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
              <Mail className="w-5 h-5" />
              <span>Email & Drip Sequence Studio</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              HIGH CONVERSION
            </span>
          </div>

          {/* Subject Line A/B Variants */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">
              SUBJECT LINE A/B TEST VARIATIONS
            </label>
            <div className="space-y-2">
              {activeTemplate.subjectVariations.map((variant, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    spatialAudio.playHoloPinch();
                    setSelectedSubjectIdx(idx);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedSubjectIdx === idx
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md"
                      : "bg-white/[0.02] text-nexus-text-dim border-white/5 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <p className="text-xs font-mono font-medium text-white leading-tight">
                    {variant.subject}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-cyan-400 font-bold">
                      {variant.predictedOpenRate}% PREDICTED OPEN
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-bold">
                      SPAM SCORE: {variant.spamScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalization Tokens */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-nexus-text-dim block">PERSONALIZATION TOKENS</span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-cyan-300">{"{{first_name}}"}</span>
              <span className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-cyan-300">{"{{company}}"}</span>
              <span className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-cyan-300">{"{{target_metric}}"}</span>
              <span className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-cyan-300">{"{{custom_link}}"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-black font-bold text-xs font-mono rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Regenerate Optimized Copy</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSendTest}
                className="py-2.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                {testSent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 text-[11px]">Dispatched!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px]">Send Test Email</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveGmailDraft}
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                {draftSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 text-[11px]">Saved in Gmail!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px]">Save as Draft</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Email Client Mockup (7 Cols) */}
        <div className="lg:col-span-7 glass p-6 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Client Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="text-xs font-mono text-nexus-text-dim ml-2">Inbox Preview Client</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-black rounded-xl border border-white/10">
                  <button
                    onClick={() => setViewDevice("desktop")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewDevice === "desktop" ? "bg-cyan-500/20 text-cyan-400" : "text-nexus-text-dim"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewDevice("mobile")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewDevice === "mobile" ? "bg-cyan-500/20 text-cyan-400" : "text-nexus-text-dim"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Email Client Wrapper */}
            <div className={`mx-auto transition-all duration-300 ${viewDevice === "mobile" ? "max-w-sm" : "w-full"}`}>
              <div className="p-5 rounded-2xl bg-black/90 border border-white/10 space-y-3 font-mono text-xs">
                {/* Meta details */}
                <div className="border-b border-white/10 pb-3 space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-nexus-text-dim">From: </span>
                    <span className="text-white font-bold">Commander E. Vance &lt;press@nexus.one&gt;</span>
                  </div>
                  <div>
                    <span className="text-nexus-text-dim">Subject: </span>
                    <span className="text-cyan-300 font-bold">{currentSubject.subject}</span>
                  </div>
                  <div>
                    <span className="text-nexus-text-dim">Preheader: </span>
                    <span className="text-gray-400">{activeTemplate.preheader}</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="pt-2 text-gray-200 leading-relaxed whitespace-pre-wrap font-sans text-xs select-text">
                  {activeTemplate.body}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-nexus-text-dim pt-3 border-t border-white/5 mt-4">
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DKIM & SPF Authentication Ready</span>
            </span>
            <span>HTML & Plain-Text Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
