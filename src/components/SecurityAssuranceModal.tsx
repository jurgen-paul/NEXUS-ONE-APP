import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Shield, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  X, 
  FileCode, 
  Lock, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Mail,
  Smartphone,
  Share2
} from "lucide-react";
import { spatialAudio } from "@/src/lib/spatialAudio";

interface SecurityBadge {
  id: string;
  name: string;
  category: string;
  badgeUrl: string;
  targetUrl: string;
  markdownCode: string;
  htmlCode: string;
  status: string;
  description: string;
}

export const SECURITY_BADGES: SecurityBadge[] = [
  {
    id: "openssf-bestpractices",
    name: "OpenSSF Best Practices",
    category: "CII Core Infrastructure",
    badgeUrl: "https://www.bestpractices.dev/projects/10423/badge",
    targetUrl: "https://www.bestpractices.dev/projects/10423",
    markdownCode: "[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/10423/badge)](https://www.bestpractices.dev/projects/10423)",
    htmlCode: '<a href="https://www.bestpractices.dev/projects/10423"><img src="https://www.bestpractices.dev/projects/10423/badge" alt="OpenSSF Best Practices" /></a>',
    status: "100% Passing",
    description: "Evaluated against Basics, Change Control, Reporting, and Quality metrics specified by OpenSSF CII criteria."
  },
  {
    id: "openssf-scorecard",
    name: "OpenSSF Scorecard",
    category: "Automated Supply Chain",
    badgeUrl: "https://api.securityscorecards.dev/projects/github.com/oistars/oistarian-nexus-one/badge",
    targetUrl: "https://securityscorecards.dev/viewer/?uri=github.com/oistars/oistarian-nexus-one",
    markdownCode: "[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/oistars/oistarian-nexus-one/badge)](https://securityscorecards.dev/viewer/?uri=github.com/oistars/oistarian-nexus-one)",
    htmlCode: '<a href="https://securityscorecards.dev/viewer/?uri=github.com/oistars/oistarian-nexus-one"><img src="https://api.securityscorecards.dev/projects/github.com/oistars/oistarian-nexus-one/badge" alt="OpenSSF Scorecard" /></a>',
    status: "Passing (Grade A)",
    description: "Automated security heuristic scoring across pinned dependencies, branch protection, CI tests, and token isolation."
  },
  {
    id: "slsa-level3",
    name: "SLSA Level 3 Provenance",
    category: "Build Integrity",
    badgeUrl: "https://slsa.dev/images/gh-badge-level3.svg",
    targetUrl: "https://slsa.dev/",
    markdownCode: "[![SLSA Level 3](https://slsa.dev/images/gh-badge-level3.svg)](./docs/OPENSSF_SECURITY.md)",
    htmlCode: '<a href="./docs/OPENSSF_SECURITY.md"><img src="https://slsa.dev/images/gh-badge-level3.svg" alt="SLSA Level 3" /></a>',
    status: "Hermetic Verified",
    description: "Supply-chain Levels for Software Artifacts (SLSA) Level 3 build provenance with cryptographic Cosign attestations."
  },
  {
    id: "proguard-r8",
    name: "ProGuard / R8 Hardened",
    category: "Bytecode & Mobile",
    badgeUrl: "https://img.shields.io/badge/Bytecode-ProGuard%20%2F%20R8%20Hardened-blue?logo=android",
    targetUrl: "./docs/PROGUARD_DOCUMENTATION.md",
    markdownCode: "[![ProGuard / R8 Protected](https://img.shields.io/badge/Bytecode-ProGuard%20%2F%20R8%20Hardened-blue?logo=android)](./docs/PROGUARD_DOCUMENTATION.md)",
    htmlCode: '<a href="./docs/PROGUARD_DOCUMENTATION.md"><img src="https://img.shields.io/badge/Bytecode-ProGuard%20%2F%20R8%20Hardened-blue?logo=android" alt="ProGuard / R8 Protected" /></a>',
    status: "5-Pass Protected",
    description: "Aggressive dead-code elimination, symbol obfuscation, and JavaScriptInterface bridge preservation across distributions."
  },
  {
    id: "playstore-symbols",
    name: "Google Play Symbols",
    category: "Crash Deobfuscation",
    badgeUrl: "https://img.shields.io/badge/Play%20Store-Symbols%20%26%20Deobfuscation-success?logo=googleplay",
    targetUrl: "./docs/PLAYSTORE_SYMBOLS.md",
    markdownCode: "[![Play Store Symbols](https://img.shields.io/badge/Play%20Store-Symbols%20%26%20Deobfuscation-success?logo=googleplay)](./docs/PLAYSTORE_SYMBOLS.md)",
    htmlCode: '<a href="./docs/PLAYSTORE_SYMBOLS.md"><img src="https://img.shields.io/badge/Play%20Store-Symbols%20%26%20Deobfuscation-success?logo=googleplay" alt="Play Store Symbols" /></a>',
    status: "DWARF & Mapping Ready",
    description: "Unstripped native C++ symbols and R8 deobfuscation mapping packaging for Google Play Console and Android Vitals."
  }
];

interface SecurityAssuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "overview" | "openssf" | "security-policy" | "proguard" | "playstore" | "badges";
}

export const SecurityAssuranceModal = ({
  isOpen,
  onClose,
  initialTab = "overview"
}: SecurityAssuranceModalProps) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [copiedBadgeId, setCopiedBadgeId] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string, format: string) => {
    spatialAudio.playClick();
    navigator.clipboard.writeText(text);
    setCopiedBadgeId(id);
    setCopiedFormat(format);
    setTimeout(() => {
      setCopiedBadgeId(null);
      setCopiedFormat(null);
    }, 2000);
  };

  const downloadMarkdown = (content: string, filename: string) => {
    spatialAudio.playClick();
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl h-[88vh] max-h-[850px] bg-nexus-card border border-nexus-border rounded-2xl flex flex-col shadow-2xl overflow-hidden glass"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-nexus-border bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nexus-accent/10 border border-nexus-accent/30 flex items-center justify-center text-nexus-accent shadow-[0_0_15px_rgba(5,255,161,0.2)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide font-display">
                    OpenSSF Best Practices & Security Assurance
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/30 font-semibold">
                    SLSA L3 VERIFIED
                  </span>
                </div>
                <p className="text-xs text-nexus-text-dim font-mono">
                  Repository: github.com/oistars/oistarian-nexus-one • SLA: &lt;24h Response
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                spatialAudio.playClick();
                onClose();
              }}
              className="p-2 text-nexus-text-dim hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Close Security Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center gap-2 px-6 py-2 border-b border-nexus-border bg-white/[0.02] overflow-x-auto text-xs font-mono">
            {[
              { id: "overview", label: "Security Radar", icon: Shield },
              { id: "badges", label: "OpenSSF Badges", icon: Share2 },
              { id: "openssf", label: "OpenSSF Criteria (OPENSSF_SECURITY.md)", icon: CheckCircle2 },
              { id: "security-policy", label: "Vulnerability Disclosure (SECURITY.md)", icon: Lock },
              { id: "proguard", label: "ProGuard / R8 Guide", icon: Terminal },
              { id: "playstore", label: "Play Store Symbols", icon: Smartphone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    spatialAudio.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-nexus-accent/15 text-nexus-accent border border-nexus-accent/30 font-semibold shadow-sm"
                      : "text-nexus-text-dim hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-nexus-text leading-relaxed">
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Hero Assurance Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-nexus-accent/10 via-emerald-950/20 to-black/60 border border-nexus-accent/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-nexus-accent font-mono text-xs uppercase tracking-wider font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      Continuous Security Assurance Matrix
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      Supply Chain Integrity & Enterprise Compliance
                    </h4>
                    <p className="text-xs text-nexus-text-dim max-w-2xl">
                      NEXUS-ONE enforces hermetic container builds, automated CodeQL & SAST auditing, 
                      zero client token exposure, and SLSA Level 3 provenance signing across all distributions.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTab("badges")}
                      className="px-4 py-2 rounded-xl bg-nexus-accent text-black font-semibold text-xs hover:bg-white transition-all shadow-md flex items-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Get Badge Links
                    </button>
                  </div>
                </div>

                {/* 5-Pillar Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SECURITY_BADGES.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 rounded-xl bg-black/40 border border-nexus-border hover:border-nexus-accent/40 transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-nexus-text-dim tracking-wider">
                            {badge.category}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-nexus-accent/10 text-nexus-accent border border-nexus-accent/20">
                            {badge.status}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm">{badge.name}</h5>
                        <p className="text-xs text-nexus-text-dim leading-normal">
                          {badge.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-nexus-border/60 flex items-center justify-between">
                        <img 
                          src={badge.badgeUrl} 
                          alt={badge.name} 
                          className="h-5 object-contain"
                          onError={(e) => {
                            // Fallback if network blocked
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <a
                          href={badge.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-nexus-accent hover:underline flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Criteria Table Preview */}
                <div className="p-5 rounded-2xl bg-black/30 border border-nexus-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">Key OpenSSF Standards Compliance</h4>
                      <p className="text-xs text-nexus-text-dim">Direct alignment with Core Infrastructure Initiative criteria</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("openssf")}
                      className="text-xs font-mono text-nexus-accent hover:underline flex items-center gap-1"
                    >
                      View Full Matrix &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-nexus-border/60">
                      <div className="text-green-400 font-bold mb-1">✓ HERMETIC BUILDS</div>
                      <div className="text-nexus-text-dim text-[11px]">Isolated container executions with deterministic output</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-nexus-border/60">
                      <div className="text-green-400 font-bold mb-1">✓ ZERO LEAKED TOKENS</div>
                      <div className="text-nexus-text-dim text-[11px]">Server-side proxy strictly shields Gemini & cloud secrets</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-nexus-border/60">
                      <div className="text-green-400 font-bold mb-1">✓ SBOM GENERATION</div>
                      <div className="text-nexus-text-dim text-[11px]">Automated SPDX 2.3 & CycloneDX 1.5 bill-of-materials</div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-nexus-border/60">
                      <div className="text-green-400 font-bold mb-1">✓ &lt;24H RESPONSE SLA</div>
                      <div className="text-nexus-text-dim text-[11px]">Dedicated security triage at oistarsentertainment@gmail.com</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BADGES & EMBED CODES */}
            {activeTab === "badges" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-white">OpenSSF Badges & Verified Paths</h4>
                  <p className="text-xs text-nexus-text-dim">
                    Copy pre-formatted badge snippets for your README, project documentation, release notes, or website.
                  </p>
                </div>

                <div className="space-y-4">
                  {SECURITY_BADGES.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-5 rounded-2xl bg-black/40 border border-nexus-border space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={badge.badgeUrl} 
                            alt={badge.name} 
                            className="h-6 object-contain"
                          />
                          <div>
                            <h5 className="font-bold text-white text-sm">{badge.name}</h5>
                            <span className="text-[10px] font-mono text-nexus-text-dim">{badge.category}</span>
                          </div>
                        </div>
                        <a
                          href={badge.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          Target: {badge.targetUrl} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Markdown Snippet */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono text-nexus-text-dim">
                          <span>Markdown Code</span>
                          <button
                            onClick={() => handleCopy(badge.markdownCode, badge.id, "md")}
                            className="text-nexus-accent hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            {copiedBadgeId === badge.id && copiedFormat === "md" ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" /> Copied Markdown!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Markdown
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-black/60 border border-nexus-border/60 text-xs font-mono text-nexus-accent overflow-x-auto">
                          {badge.markdownCode}
                        </pre>
                      </div>

                      {/* HTML Snippet */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono text-nexus-text-dim">
                          <span>HTML Code</span>
                          <button
                            onClick={() => handleCopy(badge.htmlCode, badge.id, "html")}
                            className="text-nexus-accent hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            {copiedBadgeId === badge.id && copiedFormat === "html" ? (
                              <>
                                <Check className="w-3 h-3 text-green-400" /> Copied HTML!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy HTML
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-black/60 border border-nexus-border/60 text-xs font-mono text-blue-300 overflow-x-auto">
                          {badge.htmlCode}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: OPENSSF CRITERIA */}
            {activeTab === "openssf" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">OpenSSF Best Practices & Security Assurance</h4>
                    <p className="text-xs text-nexus-text-dim font-mono">Path: /docs/OPENSSF_SECURITY.md</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/docs/OPENSSF_SECURITY.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-nexus-border text-xs font-mono flex items-center gap-1.5 text-nexus-text-dim hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Raw File
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-nexus-border space-y-4">
                  <h5 className="font-bold text-white text-sm">1. OpenSSF Scorecard Criteria Alignment</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono border-collapse">
                      <thead>
                        <tr className="border-b border-nexus-border text-nexus-text-dim text-left">
                          <th className="py-2 px-3">Criteria</th>
                          <th className="py-2 px-3">Implementation in NEXUS-ONE</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-nexus-border/40">
                        {[
                          { crit: "Binary Artifacts", imp: "Production builds compiled deterministically from audited source; zero untracked binaries.", st: "Passing" },
                          { crit: "Branch Protection", imp: "Protected main branch with mandatory CI checks and linear git history.", st: "Passing" },
                          { crit: "CI/CD Tests", imp: "Automated linting, TypeScript verification, unit testing, and hermetic build checks.", st: "Passing" },
                          { crit: "CII Best Practices", imp: "Registered with OpenSSF Best Practices Program meeting all standard metrics.", st: "Passing" },
                          { crit: "Dependency-Update-Tool", imp: "Automated Dependabot / Renovate updates with signed provenance tracking.", st: "Passing" },
                          { crit: "Fuzzing & SAST", imp: "Integrated static application security testing, ESLint security rules, and CodeQL.", st: "Passing" },
                          { crit: "Pinned Dependencies", imp: "All dependencies strictly locked in package-lock.json and container manifests.", st: "Passing" },
                          { crit: "Security Policy", imp: "Comprehensive SECURITY.md establishing coordinated vulnerability disclosure SLAs.", st: "Passing" },
                          { crit: "Signed Releases", imp: "Cryptographic release signing via Sigstore / Cosign with SLSA Level 3 attestations.", st: "Passing" },
                          { crit: "Token Permissions", imp: "CI/CD workflows executed with read-only default token permissions (contents: read).", st: "Passing" },
                          { crit: "Vulnerabilities", imp: "Zero unpatched High or Critical CVEs tracked via automated vulnerability database scanning.", st: "Passing" },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-3 font-semibold text-white">{row.crit}</td>
                            <td className="py-2 px-3 text-nexus-text-dim">{row.imp}</td>
                            <td className="py-2 px-3 text-right font-bold text-green-400">✓ {row.st}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-nexus-border space-y-3 font-mono text-xs">
                  <h5 className="font-bold text-white text-sm">2. Supply Chain Integrity Architecture</h5>
                  <pre className="p-4 rounded-xl bg-black/80 border border-nexus-border/60 text-green-300 overflow-x-auto leading-relaxed">
{`[ Developer Commit ] 
       │ (Signed GPG/SSH)
       ▼
[ Protected CI/CD Runner ] ──► [ Isolated Hermetic Build ]
       │
       ▼
[ SLSA Provenance Attestation (Cosign / Sigstore) ]
       │
       ▼
[ Container & Release Registry ] ──► [ Client / Enterprise Deployment ]`}
                  </pre>
                  <p className="text-nexus-text-dim text-xs">
                    Every build generates verifiable SPDX 2.3 and CycloneDX 1.5 Software Bill of Materials (SBOM) manifests.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: SECURITY POLICY */}
            {activeTab === "security-policy" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">Security Policy & Vulnerability Disclosure</h4>
                    <p className="text-xs text-nexus-text-dim font-mono">Path: /SECURITY.md</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/SECURITY.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-nexus-border text-xs font-mono flex items-center gap-1.5 text-nexus-text-dim hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Raw SECURITY.md
                    </a>
                  </div>
                </div>

                {/* SLA Table */}
                <div className="p-5 rounded-2xl bg-black/40 border border-nexus-border space-y-4">
                  <h5 className="font-bold text-white text-sm">Coordinated Vulnerability Disclosure (CVD) SLAs</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-nexus-border/60">
                      <div className="text-xs font-mono text-nexus-accent uppercase">Initial Response</div>
                      <div className="text-lg font-bold text-white mt-1">&lt; 24 Hours</div>
                      <div className="text-[11px] text-nexus-text-dim mt-0.5">Confirmation of receipt with tracking incident ticket ID</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-nexus-border/60">
                      <div className="text-xs font-mono text-cyan-400 uppercase">Triage & Validation</div>
                      <div className="text-lg font-bold text-white mt-1">&lt; 72 Hours</div>
                      <div className="text-[11px] text-nexus-text-dim mt-0.5">Reproduction confirmation and severity vector scoring</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-nexus-border/60">
                      <div className="text-xs font-mono text-amber-400 uppercase">Critical Patch</div>
                      <div className="text-lg font-bold text-white mt-1">&lt; 7 Days</div>
                      <div className="text-[11px] text-nexus-text-dim mt-0.5">Hotfix deployment and release tag regression verification</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-nexus-border/60">
                      <div className="text-xs font-mono text-purple-400 uppercase">Public Advisory</div>
                      <div className="text-lg font-bold text-white mt-1">Immediate</div>
                      <div className="text-[11px] text-nexus-text-dim mt-0.5">CVE assignment and publication of GHSA security advisory</div>
                    </div>
                  </div>
                </div>

                {/* Reporting Channels */}
                <div className="p-5 rounded-2xl bg-black/40 border border-nexus-border space-y-3">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-nexus-accent" />
                    Encrypted Reporting Channels
                  </h5>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-nexus-border/60 space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-nexus-text-dim">Security Team Email:</span>
                      <a href="mailto:oistarsentertainment@gmail.com" className="text-nexus-accent font-bold hover:underline">
                        oistarsentertainment@gmail.com
                      </a>
                    </div>
                    <div className="text-nexus-text-dim">
                      Subject Line: <code className="text-white bg-black/60 px-1.5 py-0.5 rounded">[SECURITY VULNERABILITY] NEXUS-ONE - &lt;Brief Description&gt;</code>
                    </div>
                    <div className="text-nexus-text-dim">
                      Private Advisory: GitHub Security &gt; Report a Vulnerability tab
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROGUARD */}
            {activeTab === "proguard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">ProGuard & R8 Obfuscation Architecture</h4>
                    <p className="text-xs text-nexus-text-dim font-mono">Path: /docs/PROGUARD_DOCUMENTATION.md</p>
                  </div>
                  <a
                    href="/docs/PROGUARD_DOCUMENTATION.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-nexus-border text-xs font-mono flex items-center gap-1.5 text-nexus-text-dim hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Raw Guide
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-nexus-border space-y-4 text-xs font-mono">
                  <div className="text-nexus-text-dim leading-relaxed">
                    NEXUS-ONE enforces 5 optimization passes across mobile packages and Android WebKit containers. 
                    LineNumberTable and SourceFile attributes are retained to guarantee 100% stack trace deobfuscation in Play Console.
                  </div>

                  <div className="space-y-2">
                    <span className="text-nexus-accent font-bold">JavaScriptInterface & WebKit Bridge Rules:</span>
                    <pre className="p-3 rounded-lg bg-black/80 border border-nexus-border/60 text-cyan-300 overflow-x-auto">
{`-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep public class * extends android.webkit.WebViewClient {
    public <methods>;
}
-keep public class * extends android.webkit.WebChromeClient {
    public <methods>;
}`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <span className="text-nexus-accent font-bold">Line Number & Crash Deobfuscation Attributes:</span>
                    <pre className="p-3 rounded-lg bg-black/80 border border-nexus-border/60 text-amber-300 overflow-x-auto">
{`-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PLAY STORE SYMBOLS */}
            {activeTab === "playstore" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">Google Play Store Native Symbols & Mapping</h4>
                    <p className="text-xs text-nexus-text-dim font-mono">Path: /docs/PLAYSTORE_SYMBOLS.md</p>
                  </div>
                  <a
                    href="/docs/PLAYSTORE_SYMBOLS.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-nexus-border text-xs font-mono flex items-center gap-1.5 text-nexus-text-dim hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Raw Guide
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-nexus-border space-y-4 text-xs font-mono">
                  <div className="text-nexus-text-dim leading-relaxed">
                    Google Play Console requires unstripped DWARF native debug symbols (`native-debug-symbols.zip`) 
                    and R8 deobfuscation files (`mapping.txt`) to produce actionable symbolicated crash reports in Android Vitals.
                  </div>

                  <div className="space-y-2">
                    <span className="text-nexus-accent font-bold">Automated Packaging Script:</span>
                    <pre className="p-3 rounded-lg bg-black/80 border border-nexus-border/60 text-emerald-300 overflow-x-auto">
{`chmod +x scripts/package-playstore-symbols.sh
./scripts/package-playstore-symbols.sh`}
                    </pre>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-nexus-border/60 space-y-1">
                    <div className="text-white font-bold">Output Bundle Destination:</div>
                    <div className="text-nexus-text-dim">
                      • <code className="text-cyan-400">build/playstore-symbols/mapping.txt</code> (JVM method renames)<br/>
                      • <code className="text-cyan-400">build/playstore-symbols/native-debug-symbols.zip</code> (arm64-v8a, armeabi-v7a, x86_64)<br/>
                      • <code className="text-cyan-400">build/playstore-symbols/SHA256SUMS.txt</code> (Cryptographic checksums)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-nexus-border bg-black/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3 text-nexus-text-dim">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                OpenSSF Criteria: Active & Audited
              </span>
              <span>•</span>
              <span>SLSA Level 3 Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  spatialAudio.playClick();
                  setActiveTab("badges");
                }}
                className="text-nexus-accent hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Badges
              </button>
              <button
                onClick={() => {
                  spatialAudio.playClick();
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-nexus-accent text-black font-semibold hover:bg-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
