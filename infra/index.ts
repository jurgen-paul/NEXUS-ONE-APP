import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as web from "@pulumi/azure-native/web";

const config = new pulumi.Config();

// OAuth credentials — secrets are encrypted in Pulumi state, plain values
// are used for non-sensitive client IDs. Set them per-stack with:
//   pulumi config set --secret Oistarian-NEXUS-ONE-APP:googleClientSecret <value>
const geminiApiKey = config.getSecret("geminiApiKey") ?? "";
const googleClientId = config.get("googleClientId") ?? "";
const googleClientSecret = config.getSecret("googleClientSecret") ?? "";
const githubClientId = config.get("githubClientId") ?? "";
const githubClientSecret = config.getSecret("githubClientSecret") ?? "";
const linkedinClientId = config.get("linkedinClientId") ?? "";
const linkedinClientSecret = config.getSecret("linkedinClientSecret") ?? "";
const twitterClientId = config.get("twitterClientId") ?? "";
const twitterClientSecret = config.getSecret("twitterClientSecret") ?? "";
const facebookClientId = config.get("facebookClientId") ?? "";
const facebookClientSecret = config.getSecret("facebookClientSecret") ?? "";
const instagramClientId = config.get("instagramClientId") ?? "";
const instagramClientSecret = config.getSecret("instagramClientSecret") ?? "";

// ---------------------------------------------------------------------------
// Azure Resources
// ---------------------------------------------------------------------------

// Resource Group for all NEXUS ONE staging resources.
const resourceGroup = new resources.ResourceGroup("nexus-one-rg");

// Linux App Service Plan — B1 tier is suitable for staging workloads.
const appServicePlan = new web.AppServicePlan("nexus-one-plan", {
    resourceGroupName: resourceGroup.name,
    kind: "Linux",
    reserved: true, // Required for Linux plans.
    sku: {
        name: "B1",
        tier: "Basic",
    },
});

// Web App running Node.js 20 LTS on Linux.
const app = new web.WebApp("nexus-one-app", {
    resourceGroupName: resourceGroup.name,
    serverFarmId: appServicePlan.id,
    kind: "app,linux",
    httpsOnly: true,
    siteConfig: {
        linuxFxVersion: "NODE|20-lts",
        appCommandLine: "node server.js",
        alwaysOn: true,
    },
});

// Application settings are managed as a separate resource so we can
// reference the app's own defaultHostName for APP_URL.
const appUrl = pulumi.interpolate`https://${app.defaultHostName}`;

new web.WebAppApplicationSettings("nexus-one-appsettings", {
    resourceGroupName: resourceGroup.name,
    name: app.name,
    properties: {
        NODE_ENV: "production",
        APP_URL: appUrl,
        GEMINI_API_KEY: geminiApiKey,
        GOOGLE_CLIENT_ID: googleClientId,
        GOOGLE_CLIENT_SECRET: googleClientSecret,
        GITHUB_CLIENT_ID: githubClientId,
        GITHUB_CLIENT_SECRET: githubClientSecret,
        LINKEDIN_CLIENT_ID: linkedinClientId,
        LINKEDIN_CLIENT_SECRET: linkedinClientSecret,
        TWITTER_CLIENT_ID: twitterClientId,
        TWITTER_CLIENT_SECRET: twitterClientSecret,
        FACEBOOK_CLIENT_ID: facebookClientId,
        FACEBOOK_CLIENT_SECRET: facebookClientSecret,
        INSTAGRAM_CLIENT_ID: instagramClientId,
        INSTAGRAM_CLIENT_SECRET: instagramClientSecret,
    },
});

// ---------------------------------------------------------------------------
// Stack Outputs
// ---------------------------------------------------------------------------
export const resourceGroupName = resourceGroup.name;
export const appServicePlanName = appServicePlan.name;
export const appName = app.name;
export const appHostName = app.defaultHostName;
export const endpoint = appUrl;
