import type { GameResource } from "../types/games";

// AdBlueMedia configuration interface
export interface AdBlueMediaConfig {
  variable: string;  // Variable name like "nUtRu_QzT_cplrFc"
  it: number;        // The "it" value
  key: string;       // The "key" value
  scriptSrc: string; // Script source URL
  functionName: string; // Function name like "_iH", "_VR", etc.
}

// Default AdBlueMedia configuration
const DEFAULT_CONFIG: AdBlueMediaConfig = {
  variable: "RnBWE_GjX_DURZcc",
  it: 4503226,
  key: "af8d5",
  scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
  functionName: "_RH"
};

// AdBlueMedia configurations per game
// Each game can have its own unique locker configuration
export const GAME_ADBLUE_CONFIGS: Record<string, AdBlueMediaConfig> = {
  // Configuration using the values from index.html
  "clash-of-clans": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "free-fire": {
    variable: "Tonbz_dyP_lLljic",
    it: 4510531,
    key: "eb00e",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/4aece94.js",
    functionName: "_Tz" // This will be determined from the loaded script
  },

  "clash-royale": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "candy-crush": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "pubg-mobile": {
    variable: "WnlWQ_NVr_CRsTyc",
    it: 4510529,
    key: "eb283",
    scriptSrc: "https://dlk457skl57zp.cloudfront.net/74d5a96.js",
    functionName: "_WQ" // This will be determined from the loaded script
  },

  "pokemon-go": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "subway-surfers": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "genshin-impact": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "roblox": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "among-us": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "minecraft": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "baseball-9": {
    variable: "lyRXf_nTE_DVXZFc",
    it: 4509593,
    key: "0c97f",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/54bed62.js",
    functionName: "_uG"
  },

  // New Custom Game
  "cyberpunk-mobile": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  // Additional Premium Games
  "valorant-mobile": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "apex-legends-mobile": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "diablo-immortal": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "codm-warzone-mobile": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "league-of-legends-wild-rift": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "mario-kart-tour": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "asphalt-9-legends": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "dead-by-daylight-mobile": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "hearthstone": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "brawl-stars": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "mobile-legends-bang-bang": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "fall-guys": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "raid-shadow-legends": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  // New games from updated gameData.ts with real AdBlueMedia configs
  "gta-san-andreas": {
    variable: "nDLyN_KhV_KvlkNc",
    it: 4510524,
    key: "3028e",
    scriptSrc: "https://dlk457skl57zp.cloudfront.net/d9e8b75.js",
    functionName: "_iH" // This will be determined from the loaded script
  },

  "fifa-24": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "call-of-duty-mw3": {
    variable: "VUday_yWf_WLYVVc",
    it: 4510527,
    key: "ff551",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/d83cac8.js",
    functionName: "_VR" // This will be determined from the loaded script
  },

  "truck-simulator-ultimate": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "need-for-speed-unbound": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "gta-trilogy-definitive": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "carx-street": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  }
};

// Helper function to get the AdBlueMedia config for a specific game
export function getAdBlueMediaConfig(gameId: string): AdBlueMediaConfig | undefined {
  return GAME_ADBLUE_CONFIGS[gameId];
}

// Helper function to get campaign ID for a specific game (legacy)
export function getCampaignId(gameId: string): string {
  const config = getAdBlueMediaConfig(gameId);
  return config?.key || DEFAULT_CONFIG.key; // Using key as campaign ID for backward compatibility
}

// Legacy export for backward compatibility
export const ADBLUE_CAMPAIGN_ID = DEFAULT_CONFIG.key; // "af8d5"

// Download URLs for each game (can be customized)
export const DOWNLOAD_URLS: Record<string, string> = {
  "gta-san-andreas": "https://example.com/downloads/gta-sa.apk",
  "fifa-24": "https://example.com/downloads/fifa-24.apk",
  "call-of-duty-mw3": "https://example.com/downloads/cod-mw3.apk",
  "truck-simulator-ultimate": "https://example.com/downloads/truck-sim.apk",
  "need-for-speed-unbound": "https://example.com/downloads/nfs-unbound.apk",
  "gta-trilogy-definitive": "https://example.com/downloads/gta-trilogy.apk",
  "carx-street": "https://example.com/downloads/carx-street.apk",
  "clash-of-clans": "https://example.com/downloads/clash-of-clans.apk",
  "free-fire": "https://example.com/downloads/free-fire.apk",
  "clash-royale": "https://example.com/downloads/clash-royale.apk",
  "candy-crush": "https://example.com/downloads/candy-crush.apk",
  "pubg-mobile": "https://example.com/downloads/pubg-mobile.apk",
  "pokemon-go": "https://example.com/downloads/pokemon-go.apk",
  "subway-surfers": "https://example.com/downloads/subway-surfers.apk",
  "genshin-impact": "https://example.com/downloads/genshin-impact.apk",
  "roblox": "https://example.com/downloads/roblox.apk",
  "among-us": "https://example.com/downloads/among-us.apk",
  "minecraft": "https://example.com/downloads/minecraft.apk",
  "baseball-9": "https://example.com/downloads/baseball-9.apk",
};

// Helper function to get download URL for a game
export function getDownloadUrl(gameId: string): string {
  return DOWNLOAD_URLS[gameId] || `https://example.com/downloads/${gameId}.apk`;
}

// Helper function to get redirect URL after AdBlue completion
export function getRedirectUrl(gameId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/games/${gameId}?unlocked=true`;
}

// To set up AdBlueMedia with your campaign:
// 1. Sign up with AdBlueMedia and create a campaign
// 2. Get your campaign ID and replace the ADBLUE_CAMPAIGN_ID above
// 3. Configure the campaign settings in AdBlueMedia dashboard:
//    - Set allowback to true to let users return to your site
//    - Set the callback URL to your domain to receive completion events
//    - Enable events for better tracking and user experience
