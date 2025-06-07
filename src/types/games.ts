// Game resource data types
export interface GameResource {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  logo: string;
  rating: number;
  unlocks: number;
  featured?: boolean;
  new?: boolean;
  wishlist?: boolean; // Added for wishlist functionality
  tags?: string[]; // Added for better categorization
  // Extended information
  developer: string;
  publishYear: number;
  releaseDate?: string; // Added for SEO metadata
  version: string;
  size: string;
  platforms: string[];
  ageRating: string;
  features: string[];
  requirements: string;
  // Store and download links
  storeLink?: string;
  downloadLink?: string;
  screenshots: string[];
}

// Alias for backwards compatibility
export type Game = GameResource;

export interface GameReview {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  date: string;
  helpful: number; // number of users who found this helpful
  verified: boolean; // verified download/purchase
}

export interface GameRating {
  gameId: string;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  joinDate: string;
  preferences: {
    favoriteCategories: string[];
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface DownloadHistory {
  id: string;
  userId: string;
  gameId: string;
  downloadDate: string;
  downloadUrl: string;
  version: string;
  completed: boolean;
}

export interface UserSession {
  user: User;
  isAuthenticated: boolean;
  downloadHistory: DownloadHistory[];
}
