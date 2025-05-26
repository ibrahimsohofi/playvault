import type { GameResource } from "../types/games";

// Interface for locker configuration
export interface LockerConfig {
  // Instead of having multiple campaign IDs, we'll use a single campaign ID
  // and dynamically handle the redirect
  redirectUrl: string;
}

// Single AdBlueMedia campaign ID to use for all games
// IMPORTANT: Replace this with your actual campaign ID from AdBlueMedia dashboard
// This single ID will be used for all game lockers - you don't need separate campaigns!
export const ADBLUE_CAMPAIGN_ID = "cee9bbd";

// Map game IDs to their download URLs
// This allows us to use a single locker but have different download URLs per game
// In a production app, these URLs would point to your actual game files
export const DOWNLOAD_URLS: Record<string, string> = {
  "clash-of-clans": "https://cdn.playvault.com/downloads/clash-of-clans-v14.93.6.apk",
  "free-fire": "https://cdn.playvault.com/downloads/free-fire-v1.92.1.apk",
  "clash-royale": "https://cdn.playvault.com/downloads/clash-royale-v3.3021.apk",
  "candy-crush": "https://cdn.playvault.com/downloads/candy-crush-v1.210.0.3.apk",
  "pubg-mobile": "https://cdn.playvault.com/downloads/pubg-mobile-v2.7.0.apk",
  "pokemon-go": "https://cdn.playvault.com/downloads/pokemon-go-v0.259.0.apk",
  "subway-surfers": "https://cdn.playvault.com/downloads/subway-surfers-v2.36.0.apk",
  "genshin-impact": "https://cdn.playvault.com/downloads/genshin-impact-v4.0.1.apk",
  "roblox": "https://cdn.playvault.com/downloads/roblox-v2.573.589.apk",
  "among-us": "https://cdn.playvault.com/downloads/among-us-v2023.6.13.apk",
  "minecraft": "https://cdn.playvault.com/downloads/minecraft-v1.20.0.apk",
  "baseball-9": "https://cdn.playvault.com/downloads/baseball-9-v1.9.7.apk"
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
  } else {
    // For local development
    return `/download-handler?gameId=${encodeURIComponent(gameId)}`;
  }
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
