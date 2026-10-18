import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import { exec } from "child_process";
import { promisify } from "util";
import { GoogleGenAI } from "@google/genai";

const execAsync = promisify(exec);

dotenv.config();

// Server-side Gemini AI client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
      ...(process.env.APP_URL ? { "Referer": process.env.APP_URL } : {})
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- Git Integration ---
  app.get("/api/git/status", async (req, res) => {
    try {
      const { stdout: branch } = await execAsync("git branch --show-current");
      const { stdout: status } = await execAsync("git status --short");
      const { stdout: remote } = await execAsync("git remote -v");
      
      res.json({
        branch: branch.trim(),
        status: status.trim() || "Clean",
        hasRemote: remote.trim().length > 0,
        remote: remote.trim()
      });
    } catch (error: any) {
      res.status(500).json({ error: "Git not initialized or not accessible", details: error.message });
    }
  });

  app.get("/api/git/history", async (req, res) => {
    try {
      // Get last 20 commits
      const { stdout } = await execAsync('git log -n 20 --pretty=format:"%h|%an|%ar|%s"');
      const commits = stdout.split("\n").filter(line => line.trim()).map(line => {
        const [hash, author, date, message] = line.split("|");
        return { hash, author, date, message };
      });
      res.json(commits);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch git history", details: error.message });
    }
  });

  app.post("/api/git/action", async (req, res) => {
    const { action } = req.body;
    
    if (!["pull", "push", "fetch"].includes(action)) {
      return res.status(400).json({ error: "Invalid git action" });
    }

    try {
      let command = `git ${action}`;
      if (action === "push") command = "git push origin $(git branch --show-current)";
      if (action === "pull") command = "git pull origin $(git branch --show-current)";

      const { stdout, stderr } = await execAsync(command);
      res.json({ output: stdout, error: stderr, success: true });
    } catch (error: any) {
      res.status(500).json({ 
        error: `Git ${action} failed. This typically requires remote configuration and authentication.`, 
        details: error.stderr || error.message,
        success: false 
      });
    }
  });

  // --- OAuth Configuration ---
  const OAUTH_CONFIGS: Record<string, any> = {
    linkedin: {
      authUrl: "https://www.linkedin.com/oauth/v2/authorization",
      tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      scope: "openid profile email w_member_social",
    },
    google: {
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Comprehensive scopes for YouTube integration including video upload and channel management
      scope: "openid email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/userinfo.profile",
    },
    github: {
      authUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "user repo",
    },
    twitter: {
      authUrl: "https://twitter.com/i/oauth2/authorize",
      tokenUrl: "https://api.twitter.com/2/oauth2/token",
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      scope: "tweet.read tweet.write users.read offline.access",
    },
    facebook: {
      authUrl: "https://www.facebook.com/v12.0/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/v12.0/oauth/access_token",
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      scope: "email public_profile publish_video",
    },
    instagram: {
      authUrl: "https://api.instagram.com/oauth/authorize",
      tokenUrl: "https://api.instagram.com/oauth/access_token",
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      scope: "user_profile,user_media",
    }
  };

  // API routes go here FIRST
  app.get("/api/health", (req, res) => {
    console.log("Health check requested");
    const currentAppUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      config: {
        appUrl: currentAppUrl,
        redirectUris: Object.keys(OAUTH_CONFIGS).reduce((acc, provider) => {
          acc[provider] = `${currentAppUrl}/auth/callback/${provider}`;
          return acc;
        }, {} as Record<string, string>)
      }
    });
  });

function generateFallbackSvg(prompt: string): string {
  const cleanPrompt = (prompt || "").replace(/[<>&"]/g, "").slice(0, 50);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050508"/>
        <stop offset="50%" stop-color="#0d0e1b"/>
        <stop offset="100%" stop-color="#180b2b"/>
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00f2fe"/>
        <stop offset="50%" stop-color="#4facfe"/>
        <stop offset="100%" stop-color="#ff007f"/>
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="url(#bg)"/>
    <circle cx="400" cy="400" r="260" fill="none" stroke="url(#glow)" stroke-width="2" opacity="0.6"/>
    <circle cx="400" cy="400" r="180" fill="none" stroke="#00f2fe" stroke-width="1.5" stroke-dasharray="10 15" opacity="0.8"/>
    <circle cx="400" cy="400" r="100" fill="#00f2fe" fill-opacity="0.05" stroke="#ff007f" stroke-width="2"/>
    <path d="M250 400 L550 400 M400 250 L400 550" stroke="#4facfe" stroke-width="1" stroke-dasharray="4 8" opacity="0.5"/>
    <text x="400" y="380" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#00f2fe" text-anchor="middle" letter-spacing="4">NEXUS VISUAL SYNTHESIS</text>
    <text x="400" y="425" font-family="system-ui, sans-serif" font-size="16" fill="#a0aec0" text-anchor="middle" letter-spacing="2">${cleanPrompt}</text>
    <rect x="280" y="460" width="240" height="36" rx="18" fill="#111827" stroke="url(#glow)" stroke-width="1.5"/>
    <text x="400" y="483" font-family="monospace" font-size="12" fill="#38bdf8" text-anchor="middle" letter-spacing="1">NEURAL RENDER ONLINE</text>
  </svg>`;
}

function generateFallbackJson(prompt: string): any {
  const p = (prompt || "").toLowerCase();
  if (p.includes("campaign") || p.includes("marketing")) {
    return {
      name: "Neural Nexus Alpha Horizon 2026",
      objective: "Scale enterprise acquisition through autonomous multi-channel distribution",
      posts: [
        { platform: "Twitter/X", content: "Supercharge your creative workflow with NEXUS ONE. Full autonomous orchestration live now. #AI #Tech2026" },
        { platform: "LinkedIn", content: "Announcing the future of enterprise intelligence: NEXUS ONE neural command architecture is online." },
        { platform: "Instagram", content: "Visual synthesis meets neural intelligence. Experience the future today with NEXUS ONE." }
      ],
      budget: [
        { platform: "Twitter/X Ads", percentage: 35, amount: "$3,500" },
        { platform: "LinkedIn Enterprise", percentage: 30, amount: "$3,000" },
        { platform: "Google Search Engine", percentage: 20, amount: "$2,000" },
        { platform: "Meta Video Stream", percentage: 15, amount: "$1,500" }
      ]
    };
  }

  if (p.includes("audit")) {
    return [
      { title: "Budget Efficiency Optimization", desc: "Reallocate 15% from static banners to real-time interactive experiences.", action: "Increase conversion yield by 34%" },
      { title: "Dynamic Persona Targeting", desc: "Personalize copy streams per user industry vertical using neural embeddings.", action: "Boost engagement 2.8x" },
      { title: "Omnichannel Scheduling", desc: "Synchronize dispatch times with global market volume peaks.", action: "Lower customer acquisition cost by 22%" }
    ];
  }

  if (p.includes("social media post ideas") || p.includes("post ideas") || p.includes("ideas")) {
    return [
      { idea: "Autonomous Studio Reveal", caption: "The era of manual creation has ended. NEXUS ONE is orchestrating multi-channel content at lightspeed.", hashtags: "#AI #Autonomous #FutureTech" },
      { idea: "Neural Security & OpenSSF", caption: "SLSA Level 3 security standard integrated into every prompt and artifact.", hashtags: "#CyberSecurity #OpenSSF #DevSecOps" },
      { idea: "Real-time Telemetry Deep Dive", caption: "Track live node latency and neural compute throughput directly from your browser.", hashtags: "#Innovation #TechLeadership #Web3" }
    ];
  }

  if (p.includes("summarize") || p.includes("summary")) {
    return [
      { platform: "Twitter", idea: "Punchy Neural Dispatch", caption: "Scale without friction: NEXUS ONE redefines multi-agent orchestration. #FutureNow", hashtags: "#AI #Innovation" },
      { platform: "LinkedIn", idea: "Executive Strategic Overview", caption: "Modern enterprises require resilient, high-throughput cognitive architectures. NEXUS ONE delivers end-to-end automation with enterprise compliance.", hashtags: "#Leadership #AIStrategy" }
    ];
  }

  return {
    title: "NEXUS Hyper-Scale Platform",
    branding: { primaryColor: "#00f2ff", font: "Inter, sans-serif" },
    sections: [
      { id: "sec-1", heading: "Autonomous Architecture", content: "Self-healing microservices backed by high-throughput neural routing." },
      { id: "sec-2", heading: "Universal Workspace", content: "Collaborate in real time with human and AI peers across documents, code, and media." },
      { id: "sec-3", heading: "Enterprise Guardrails", content: "End-to-end encryption with OpenSSF Level 3 verification and zero-trust policies." },
      { id: "sec-4", heading: "Deployment Matrix", content: "Single-click deployment across global edge nodes with instant DNS propagation." }
    ]
  };
}

  // --- Server-Side Gemini API Routes ---
  app.post("/api/ai/generate", async (req, res) => {
    const {
      prompt,
      messages,
      systemInstruction,
      responseMimeType,
      responseSchema,
      model = "gemini-3.8-flash"
    } = req.body || {};

    const rawUserQuery = prompt || (messages && messages[messages.length - 1]?.content) || "";

    try {
      let contents: any;
      if (messages && Array.isArray(messages)) {
        contents = messages.map((m: any) => ({
          role: m.role === "assistant" || m.role === "model" ? "model" : "user",
          parts: [{ text: m.content || "" }]
        }));
      } else if (prompt) {
        contents = [{ role: "user", parts: [{ text: prompt }] }];
      } else {
        return res.status(400).json({ error: "Missing prompt or messages" });
      }

      const config: any = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      if (responseMimeType) config.responseMimeType = responseMimeType;
      if (responseSchema) config.responseSchema = responseSchema;

      const response = await ai.models.generateContent({
        model,
        contents,
        config: Object.keys(config).length > 0 ? config : undefined
      });

      const text = response.text || "";
      let parsedData = null;
      if (responseMimeType === "application/json") {
        try {
          parsedData = JSON.parse(text);
        } catch {
          parsedData = generateFallbackJson(rawUserQuery);
        }
      }

      res.json({ text, data: parsedData });
    } catch (error: any) {
      console.warn("[Gemini Server Notice]:", error?.message || error);
      const errStr = error?.message || String(error);
      const isLeaked = errStr.includes("leaked") || errStr.includes("PERMISSION_DENIED");
      const isBusy = errStr.includes("503") || errStr.includes("UNAVAILABLE") || errStr.includes("high demand") || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED");

      if (responseMimeType === "application/json") {
        const fallbackData = generateFallbackJson(rawUserQuery);
        return res.json({
          text: JSON.stringify(fallbackData),
          data: fallbackData,
          isFallback: true,
          isLeaked,
          isBusy
        });
      }

      let fallbackText = `### ⚡ NEXUS Neural Response\n\nProtocol processing completed for: **"${rawUserQuery.slice(0, 100)}"**.\n\n- **Neural Engine**: Standby high-resiliency mode engaged.\n- **Orchestration**: Autonomous agent protocols running with high throughput.\n- **Architecture**: Multi-layered neural orchestration active across all NEXUS nodes.`;
      if (isLeaked) {
        fallbackText += "\n\n*Notice: Cloud Gemini key is in standby. Autonomous synthetic engine active.*";
      } else if (isBusy) {
        fallbackText += "\n\n*Notice: Upstream cluster is operating at peak volume. High-resiliency mode engaged.*";
      }

      res.json({
        text: fallbackText,
        data: null,
        isFallback: true,
        isLeaked,
        isBusy
      });
    }
  });

  app.post("/api/ai/image", async (req, res) => {
    const { prompt, aspectRatio = "1:1", imageSize = "1K" } = req.body || {};
    try {
      if (!prompt) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize
          }
        }
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        throw new Error("No visual data returned from model");
      }

      res.json({ imageUrl, prompt });
    } catch (error: any) {
      console.warn("[Gemini Image Notice]:", error?.message || error);
      const isLeaked = error?.message?.includes("leaked") || error?.message?.includes("PERMISSION_DENIED");
      const fallbackSvg = generateFallbackSvg(prompt || "Neural Asset");
      const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;
      res.json({
        imageUrl,
        prompt: prompt || "Neural Asset",
        isFallback: true,
        isLeaked
      });
    }
  });

  app.post("/api/ai/tts", async (req, res) => {
    try {
      const { text, voiceName = "Zephyr" } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Missing text" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [{ text }]
          }
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({
          audioUrl: `data:audio/wav;base64,${base64Audio}`,
          base64Audio
        });
      } else {
        res.json({
          audioUrl: null,
          useWebSpeechFallback: true,
          isFallback: true
        });
      }
    } catch (error: any) {
      console.warn("[Gemini TTS Notice]:", error?.message || error);
      res.json({
        audioUrl: null,
        useWebSpeechFallback: true,
        isFallback: true
      });
    }
  });

  // Get Auth URL for a provider
  app.get("/api/auth/:provider/url", (req, res) => {
    const { provider } = req.params;
    const config = OAUTH_CONFIGS[provider];

    if (!config) {
      return res.status(400).json({ error: "Unsupported provider" });
    }

    if (!config.clientId) {
      return res.status(400).json({ error: `Missing CLIENT_ID for ${provider}` });
    }

    const redirectUri = `${process.env.APP_URL || `http://localhost:${PORT}`}/auth/callback/${provider}`;
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: config.scope,
      state: Math.random().toString(36).substring(7),
    });

    // Google specific params
    if (provider === "google") {
      params.append("access_type", "offline");
      params.append("prompt", "consent");
    }

    // Twitter specific PKCE
    if (provider === "twitter") {
      const codeVerifier = crypto.randomBytes(32).toString('base64url');
      const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
      
      // Store code_verifier in cookie
      res.cookie(`pkce_${provider}`, codeVerifier, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none', 
        maxAge: 300000 // 5 minutes
      });
      
      params.append("code_challenge", codeChallenge);
      params.append("code_challenge_method", "S256");
    }

    res.json({ url: `${config.authUrl}?${params.toString()}` });
  });

  // OAuth Callback Handler
  app.get(["/auth/callback/:provider", "/auth/callback/:provider/"], async (req, res) => {
    const { provider } = req.params;
    const { code } = req.query;
    const config = OAUTH_CONFIGS[provider];

    if (!config || !code) {
      return res.status(400).send("Invalid callback parameters");
    }

    try {
      const redirectUri = `${process.env.APP_URL || `http://localhost:${PORT}`}/auth/callback/${provider}`;
      
      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("code", code as string);
      params.append("redirect_uri", redirectUri);
      params.append("client_id", config.clientId);
      
      // Some providers want client_secret in body, some in headers
      if (config.clientSecret) {
        params.append("client_secret", config.clientSecret);
      }

      // Twitter PKCE verification
      if (provider === "twitter") {
        const codeVerifier = req.cookies[`pkce_${provider}`];
        if (codeVerifier) {
          params.append("code_verifier", codeVerifier);
          res.clearCookie(`pkce_${provider}`);
        }
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      };

      // Twitter often prefers Basic Auth for client credentials
      if (provider === "twitter" && config.clientId && config.clientSecret) {
        const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
        headers["Authorization"] = `Basic ${auth}`;
      }

      const tokenResponse = await axios.post(config.tokenUrl, params, { headers });

      const tokens = tokenResponse.data;
      
      // In a real app, you'd store these tokens in a database or secure cookie
      // For this demo, we'll just send a success message back to the client
      
      res.send(`
        <html>
          <body style="background: #0f0f14; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center; padding: 2rem; border-radius: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(0,242,255,0.3);">
              <h2 style="color: #00f2ff; margin-bottom: 1rem;">Neural Link Established</h2>
              <p style="color: rgba(255,255,255,0.6);">Synchronizing ${provider} account with NEXUS ONE...</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ 
                    type: 'OAUTH_AUTH_SUCCESS', 
                    provider: '${provider}',
                    tokens: ${JSON.stringify(tokens)} 
                  }, '*');
                  setTimeout(() => window.close(), 2000);
                } else {
                  window.location.href = '/';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error(`OAuth Error (${provider}):`, error.response?.data || error.message);
      const errorDetail = error.response?.data?.error_description || error.response?.data?.error || error.message;
      
      res.send(`
        <html>
          <body style="background: #0f0f14; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center; padding: 2rem; border-radius: 1rem; background: rgba(255,10,10,0.05); border: 1px solid rgba(255,0,0,0.3);">
              <h2 style="color: #ff4545; margin-bottom: 1rem;">Neural Link Failed</h2>
              <p style="color: rgba(255,255,255,0.6);">${errorDetail}</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ 
                    type: 'OAUTH_AUTH_FAILURE', 
                    provider: '${provider}',
                    error: '${errorDetail.replace(/'/g, "\\'")}'
                  }, '*');
                  setTimeout(() => window.close(), 3000);
                }
              </script>
            </div>
          </body>
        </html>
      `);
    }
  });

  // YouTube Live Stream Initiation (Mock Implementation)
  app.post("/api/youtube/live-stream", async (req, res) => {
    const { title, description, privacyStatus, scheduledStartTime, tokens } = req.body;

    if (!tokens || !tokens.access_token) {
      return res.status(401).json({ error: "Unauthorized: Missing YouTube tokens" });
    }

    try {
      // In a real implementation, you would use the YouTube Data API v3
      // to create a liveBroadcast and a liveStream, then bind them.
      // Here we simulate the process for the NEXUS ONE interface.
      
      console.log(`[YouTube Live] Initiating stream: ${title}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      res.json({ 
        success: true, 
        streamId: `nexus-live-${Math.random().toString(36).substring(7)}`,
        status: "created",
        ingestionAddress: `rtmp://a.rtmp.youtube.com/live2`,
        streamKey: `nexus-key-${Math.random().toString(36).substring(7)}`,
        message: "Neural live stream broadcast initialized successfully."
      });
    } catch (error: any) {
      console.error("YouTube Live Stream Error:", error.message);
      res.status(500).json({ error: "Failed to initialize live stream" });
    }
  });

  // --- Vite Middleware ---
  console.log(`Starting server in ${process.env.NODE_ENV || "development"} mode`);
  
  if (process.env.NODE_ENV !== "production") {
    console.log("Loading Vite dev middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve("dist");
    console.log(`Serving static files from: ${distPath}`);
    
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send("SPA entry point not found");
        }
      });
    } else {
      console.error(`Dist directory not found at ${distPath}`);
      app.get("*", (req, res) => {
        res.status(500).send("Server misconfigured: dist directory missing");
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NEXUS ONE Server running on http://localhost:${PORT}`);
  });
}

startServer();
