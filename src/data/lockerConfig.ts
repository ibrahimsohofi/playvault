import type { GameResource } from "../types/games";

// Interface for locker configuration
export interface LockerConfig {
  // Instead of having multiple campaign IDs, we'll use a single campaign ID
  // and dynamically handle the redirect
  redirectUrl: string;
}

// AdBlueMedia configuration interface
export interface AdBlueMediaConfig {
  variable: string;  // Variable name like "nUtRu_QzT_cplrFc"
  it: number;        // The "it" value
  key: string;       // The "key" value
  scriptSrc: string; // Script source URL
  functionName: string; // Function name like "_RH", "_Vm", "_uG", etc.
}

// AdBlueMedia configurations per game
// Each game can have its own unique locker configuration
export const GAME_ADBLUE_CONFIGS: Record<string, AdBlueMediaConfig> = {
  // Configuration using the values from index.html

  // Add configurations for all games using the config from index.html
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

// Default configuration (fallback) - using values from index.html
const DEFAULT_CONFIG: AdBlueMediaConfig = {
  variable: "RnBWE_GjX_DURZcc",
  it: 4503226,
  key: "af8d5",
  scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/40bb691.js",
  functionName: "_RH"
};

// Helper function to get AdBlueMedia config for a specific game
export function getAdBlueMediaConfig(gameId: string): AdBlueMediaConfig {
  return GAME_ADBLUE_CONFIGS[gameId] || DEFAULT_CONFIG;
}

// Helper function to get campaign ID for a specific game (legacy)
export function getCampaignId(gameId: string): string {
  const config = getAdBlueMediaConfig(gameId);
  return config.key; // Using key as campaign ID for backward compatibility
}

// Legacy export for backward compatibility
export const ADBLUE_CAMPAIGN_ID = DEFAULT_CONFIG.key; // "af8d5"

// Map game IDs to their download URLs
// This allows us to use a single locker but have different download URLs per game
// Using official store URLs and reliable APK sources
export const DOWNLOAD_URLS: Record<string, string> = {
  // Existing games
  "clash-of-clans": "https://play.google.com/store/apps/details?id=com.supercell.clashofclans",
  "free-fire": "https://play.google.com/store/apps/details?id=com.dts.freefireth",
  "clash-royale": "https://play.google.com/store/apps/details?id=com.supercell.clashroyale",
  "candy-crush": "https://play.google.com/store/apps/details?id=com.king.candycrushsaga",
  "pubg-mobile": "https://play.google.com/store/apps/details?id=com.tencent.ig",
  "pokemon-go": "https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo",
  "subway-surfers": "https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf",
  "genshin-impact": "https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact",
  "roblox": "https://play.google.com/store/apps/details?id=com.roblox.client",
  "among-us": "https://play.google.com/store/apps/details?id=com.innersloth.spacemafia",
  "minecraft": "https://play.google.com/store/apps/details?id=com.mojang.minecraftpe",
  "baseball-9": "https://play.google.com/store/apps/details?id=com.playus.baseball9",

  // New games from updated gameData.ts
  "gta-san-andreas": "https://play.google.com/store/apps/details?id=com.rockstargames.gtasa",
  "fifa-24": "https://play.google.com/store/apps/details?id=com.ea.gp.fifa24mobile",
  "call-of-duty-mw3": "https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter",
  "truck-simulator-ultimate": "https://play.google.com/store/apps/details?id=com.zuuks.truck.simulator.ultimate",
  "need-for-speed-unbound": "https://www.ea.com/games/need-for-speed/need-for-speed-unbound",
  "gta-trilogy-definitive": "https://play.google.com/store/apps/details?id=com.rockstargames.gtavc",
  "carx-street": "https://play.google.com/store/apps/details?id=com.carxtech.carxstreet",

  // Legacy games
  "cyberpunk-mobile": "https://www.cyberpunk.net/mobile",
  "valorant-mobile": "https://playvault.app/download/valorant-mobile"
};

// Helper function to get the download URL for a specific game
export function getDownloadUrl(gameId: string): string {
  return DOWNLOAD_URLS[gameId] || "";
}

// Helper function to get the redirect URL for use with AdBlueMedia locker
// This creates a URL with 'gameId' as a query parameter so we can extract it
// in our redirect handler
export function getRedirectUrl(gameId: string): string {
  // Determine if we're in development or production
  const isProduction = window.location.hostname !== 'localhost';

  if (isProduction) {
    // For production deployment
    return `https://playvault.com/download-handler?game=${encodeURIComponent(gameId)}`;
  }
  // For local development
  return `/download-handler?gameId=${encodeURIComponent(gameId)}`;
}

// Helper function to get locker configuration for a game
export function getLockerConfigForGame(game: GameResource): LockerConfig {
  return {
    redirectUrl: getRedirectUrl(game.id)
  };
}

// To set up AdBlueMedia with your campaign:
// 1. Sign up with AdBlueMedia and create a campaign
// 2. Get your campaign ID and replace the ADBLUE_CAMPAIGN_ID above
// 3. Configure the campaign settings in AdBlueMedia dashboard:
//    - Set allowback to true to let users return to your site
//    - Set the callback URL to your domain to receive completion events
//    - Enable events for better tracking and user experience
