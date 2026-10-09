import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2,
  FileCode,
  Layers
} from "lucide-react";
import { spatialAudio } from "../ar/SpatialAudioSynth";

export type CodeLanguage = "typescript" | "python" | "rust" | "solidity" | "sql" | "go";

interface CodeSnippet {
  id: string;
  title: string;
  language: CodeLanguage;
  ext: string;
  prompt: string;
  code: string;
  executionOutput: string;
}

const CODE_TEMPLATES: Record<CodeLanguage, CodeSnippet> = {
  typescript: {
    id: "ts-1",
    title: "Real-time 6DoF Spatial Quaternion Engine",
    language: "typescript",
    ext: "ts",
    prompt: "Write a high-performance TypeScript class that calculates 6DoF spatial quaternions, spherical linear interpolation (SLERP), and camera matrices for holographic rendering.",
    code: `// Nexus Spatial Quaternion Engine v4.2
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export class SpatialMathEngine {
  /**
   * Spherical Linear Interpolation (SLERP) between two orientation quaternions
   */
  public static slerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion {
    let cosHalfTheta = q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;

    if (Math.abs(cosHalfTheta) >= 1.0) {
      return { ...q1 };
    }

    const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < 0.001) {
      return {
        w: q1.w * 0.5 + q2.w * 0.5,
        x: q1.x * 0.5 + q2.x * 0.5,
        y: q1.y * 0.5 + q2.y * 0.5,
        z: q1.z * 0.5 + q2.z * 0.5
      };
    }

    const halfTheta = Math.acos(cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    return {
      w: q1.w * ratioA + q2.w * ratioB,
      x: q1.x * ratioA + q2.x * ratioB,
      y: q1.y * ratioA + q2.y * ratioB,
      z: q1.z * ratioA + q2.z * ratioB
    };
  }
}`,
    executionOutput: `[TS-RUNNER] Compiling module SpatialMathEngine...
[TS-RUNNER] Zero type errors.
[TEST SUITE] Running SLERP unit tests (t=0.0 to 1.0)...
✔ SLERP smooth convergence verified in 0.04 ms.
✔ Normalized quaternion magnitude = 1.000000.
Status: PASS (3/3 assertions verified)`
  },
  solidity: {
    id: "sol-1",
    title: "Quantum Escrow & Neural Settlement Contract",
    language: "solidity",
    ext: "sol",
    prompt: "Write a secure Solidity smart contract for multi-party decentralized agent settlements with verifiable zero-knowledge state anchors.",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NexusAgentSettlement {
    address public immutable governor;
    uint256 public totalSettledVolume;

    event TelemetryAnchorRecorded(bytes32 indexed anchorHash, uint256 timestamp);
    event EscrowReleased(address indexed recipient, uint256 amount);

    struct NodeState {
        bool isCalibrated;
        uint256 stakeAmount;
        uint256 lastHeartbeat;
    }

    mapping(address => NodeState) public nodes;

    modifier onlyGovernor() {
        require(msg.sender == governor, "UNAUTHORIZED");
        _;
    }

    constructor() {
        governor = msg.sender;
    }

    function recordStateAnchor(bytes32 _anchorHash) external {
        require(nodes[msg.sender].isCalibrated, "NODE_NOT_CALIBRATED");
        emit TelemetryAnchorRecorded(_anchorHash, block.timestamp);
    }
}`,
    executionOutput: `[SOLC] Compiler v0.8.20 (via-ir enabled)...
[SECURITY AUDIT] Gas optimization pass: OK (21,420 gas / write)
[SECURITY AUDIT] Reentrancy check: PASS
[SECURITY AUDIT] Integer overflow check: PASS
Status: READY FOR MAINNET DEPLOYMENT`
  },
  python: {
    id: "py-1",
    title: "FastAPI Multimodal Vector Orchestration",
    language: "python",
    ext: "py",
    prompt: "Create an async FastAPI microservice that streams Gemini 3.7 multimodal embeddings into a localized HNSW vector index.",
    code: `import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Nexus Multimodal Embedding Router", version="4.8.0")

class EmbeddingRequest(BaseModel):
    prompt: str
    dimension: int = 1536
    temperature: float = 0.2

@app.post("/api/v1/vector/embed")
async def generate_vector_embedding(req: EmbeddingRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Empty prompt rejected")
    
    # Simulated high-speed tensor embedding
    await asyncio.sleep(0.01)
    vector = np.random.normal(0, 1, req.dimension).tolist()
    
    return {
        "status": "synchronized",
        "dimensions": req.dimension,
        "coherence_score": 0.9982,
        "embedding_vector": vector[:8] # sample slice
    }`,
    executionOutput: `[UVICORN] Application startup complete on 0.0.0.0:8000
[TEST REQ] POST /api/v1/vector/embed -> HTTP 200 OK
[METRICS] Latency: 11.4 ms | Memory: 42.1 MB
Status: HEALTHY (120 req/sec benchmark)`
  },
  rust: {
    id: "rs-1",
    title: "Rust Ultra-Low Latency Packet Parser",
    language: "rust",
    ext: "rs",
    prompt: "Write a zero-allocation Rust binary frame parser with SIMD acceleration for processing 64-beam LiDAR point streams.",
    code: `// Nexus Zero-Copy LiDAR Frame Deserializer
#[derive(Debug, Clone, Copy, PartialEq)]
#[repr(C, packed)]
pub struct LidarPoint3D {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub reflectivity: u8,
}

pub struct FrameStreamParser;

impl FrameStreamParser {
    #[inline(always)]
    pub fn parse_raw_buffer(buf: &[u8]) -> Result<&[LidarPoint3D], &'static str> {
        let point_size = std::mem::size_of::<LidarPoint3D>();
        if buf.len() % point_size != 0 {
            return Err("Invalid buffer alignment for LidarPoint3D");
        }

        let num_points = buf.len() / point_size;
        let points = unsafe {
            std::slice::from_raw_parts(buf.as_ptr() as *const LidarPoint3D, num_points)
        };

        Ok(points)
    }
}`,
    executionOutput: `[CARGO BUILD] --release in 0.42s
[BENCHMARK] test bench_parse_100k_points ... bench: 4,120 ns/iter (+/- 12)
[THROUGHPUT] 1.84 GB/s throughput achieved (Zero Memory Allocations)
Status: COMPILATION SUCCESS`
  },
  sql: {
    id: "sql-1",
    title: "High-Volume Telemetry Time-Series Analytics",
    language: "sql",
    ext: "sql",
    prompt: "Write an analytical SQL window query calculating 95th percentile latency, geographic bucket anomalies, and throughput jitter across time buckets.",
    code: `-- Nexus Distributed Node Analytics
WITH AggregatedIntervals AS (
    SELECT 
        time_bucket('1 minute', recorded_at) AS time_window,
        node_region,
        AVG(photon_latency_ms) AS avg_latency,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY photon_latency_ms) AS p95_latency,
        SUM(data_bytes_processed) / (1024 * 1024) AS mb_throughput
    FROM node_telemetry_stream
    WHERE recorded_at >= NOW() - INTERVAL '24 hours'
    GROUP BY 1, 2
)
SELECT 
    time_window,
    node_region,
    ROUND(avg_latency::numeric, 3) AS avg_latency_ms,
    ROUND(p95_latency::numeric, 3) AS p95_latency_ms,
    ROUND(mb_throughput::numeric, 2) AS throughput_mb
FROM AggregatedIntervals
ORDER BY time_window DESC, p95_latency_ms DESC;`,
    executionOutput: `[QUERY EXEC] Query executed in 18 ms against 4.8M records.
[EXPLAIN ANALYZE] Index Scan using idx_recorded_at on node_telemetry_stream.
Rows Returned: 1,440 buckets (24hr timeline).`
  },
  go: {
    id: "go-1",
    title: "Go Multi-Core Goroutine Worker Pool",
    language: "go",
    ext: "go",
    prompt: "Write an idiomatic Go concurrent worker pool with channel backpressure and graceful context cancellation.",
    code: `package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type TelemetryTask struct {
	ID        string
	Payload   []byte
	CreatedAt time.Time
}

func Worker(ctx context.Context, id int, jobs <-chan TelemetryTask, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		case task, ok := <-jobs:
			if !ok {
				return
			}
			// Process task with low jitter
			_ = task
		}
	}
}`,
    executionOutput: `[GO BUILD] Compiled main.go in 0.08s
[RUNTIME] Spawned 32 parallel worker goroutines across 16 CPU cores.
[STATS] 500,000 tasks dispatched & completed with 0 deadlocks.
Status: PASS`
  }
};

export const CodeGeneratorTab: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<CodeLanguage>("typescript");
  const [prompt, setPrompt] = useState(CODE_TEMPLATES.typescript.prompt);
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet>(CODE_TEMPLATES.typescript);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testOutput, setTestOutput] = useState(CODE_TEMPLATES.typescript.executionOutput);

  const handleLangSelect = (lang: CodeLanguage) => {
    spatialAudio.playHoloPinch();
    setSelectedLang(lang);
    setPrompt(CODE_TEMPLATES[lang].prompt);
    setActiveSnippet(CODE_TEMPLATES[lang]);
    setTestOutput(CODE_TEMPLATES[lang].executionOutput);
  };

  const handleGenerateCode = () => {
    if (!prompt.trim()) return;
    spatialAudio.playScanSweep();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      spatialAudio.playTargetLock();
      setActiveSnippet(CODE_TEMPLATES[selectedLang]);
      setTestOutput(CODE_TEMPLATES[selectedLang].executionOutput);
    }, 700);
  };

  const handleRunExecution = () => {
    spatialAudio.playScanSweep();
    setIsRunningTest(true);
    setTestOutput("Executing runtime simulation and compiling test harness...");

    setTimeout(() => {
      setIsRunningTest(false);
      spatialAudio.playTargetLock();
      setTestOutput(activeSnippet.executionOutput);
    }, 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeSnippet.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-${activeSnippet.language}-snippet.${activeSnippet.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Language Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: "typescript" as CodeLanguage, label: "TypeScript / React" },
          { id: "solidity" as CodeLanguage, label: "Solidity Smart Contract" },
          { id: "python" as CodeLanguage, label: "Python / FastAPI" },
          { id: "rust" as CodeLanguage, label: "Rust Systems" },
          { id: "go" as CodeLanguage, label: "Go Microservice" },
          { id: "sql" as CodeLanguage, label: "SQL Analytics" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleLangSelect(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
              selectedLang === tab.id
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
        {/* Left Column: Code Directive & Controls (5 Cols) */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-white/10 space-y-5 bg-black/60 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-base">
              <Code2 className="w-5 h-5" />
              <span>Neural Code Architect</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 uppercase">
              {selectedLang} COMPLIANT
            </span>
          </div>

          {/* Prompt Area */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-nexus-text-dim block">
              ARCHITECTURE SPECIFICATION & INTERFACE CONTRACT
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Specify requirements, inputs, outputs, error handling, algorithms..."
              className="w-full bg-black/70 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none leading-relaxed font-mono"
            />
          </div>

          {/* Code Quality & Security Vitals */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[9px] text-nexus-text-dim uppercase block">TYPE RIGOR</span>
              <span className="text-sm font-bold text-green-400">Strict (No Any)</span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              <span className="text-[9px] text-nexus-text-dim uppercase block">SECURITY PASS</span>
              <span className="text-sm font-bold text-cyan-400">OWASP Verified</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-black font-bold text-xs font-mono rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 text-black animate-spin" />
                  <span>Synthesizing Syntactical AST...</span>
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4 text-black" />
                  <span>Generate Production Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleRunExecution}
              disabled={isRunningTest}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-green-400" />
              <span>Simulate Unit Test Suite</span>
            </button>
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Terminal (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Main Code Viewport */}
          <div className="glass p-5 rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs text-white font-bold">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>{activeSnippet.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-nexus-text-dim hover:text-white border border-white/10 transition-colors"
                    title="Download Code File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Box */}
              <div className="mt-3 p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-xs text-cyan-300 leading-relaxed max-h-[360px] overflow-y-auto custom-scrollbar select-text">
                <pre>{activeSnippet.code}</pre>
              </div>
            </div>

            {/* Simulated Terminal Test Output */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-nexus-text-dim">
                <Terminal className="w-3.5 h-3.5 text-green-400" />
                <span>RUNTIME / COMPILER OUTPUT</span>
              </div>
              <div className="p-3 rounded-xl bg-black/95 border border-green-500/20 font-mono text-[11px] text-green-400 leading-relaxed whitespace-pre-wrap select-text">
                {testOutput}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
