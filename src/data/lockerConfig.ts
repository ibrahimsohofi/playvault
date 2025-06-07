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
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
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
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
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

  // New games from updated gameData.ts
  "gta-san-andreas": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "fifa-24": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
  },

  "call-of-duty-mw3": {
    variable: "RnBWE_GjX_DURZcc",
    it: 4503226,
    key: "af8d5",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
    functionName: "_RH"
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

// To set up AdBlueMedia with your campaign:
// 1. Sign up with AdBlueMedia and create a campaign
// 2. Get your campaign ID and replace the ADBLUE_CAMPAIGN_ID above
// 3. Configure the campaign settings in AdBlueMedia dashboard:
//    - Set allowback to true to let users return to your site
//    - Set the callback URL to your domain to receive completion events
//    - Enable events for better tracking and user experience
