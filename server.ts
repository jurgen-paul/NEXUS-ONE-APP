import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

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
      scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile",
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

  // --- API Routes ---
  app.get("/api/health", (req, res) => {
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NEXUS ONE Server running on http://localhost:${PORT}`);
  });
}

startServer();
