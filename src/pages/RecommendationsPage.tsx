import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GameRatingDisplay from '@/components/shared/GameRatingDisplay';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, ArrowLeft, Download, Heart, Gamepad2, Loader2 } from "lucide-react";
import {
  getPersonalizedRecommendations,
  getTrendingGames,
  getNewReleases,
  getRecommendationsByCategory
} from "@/utils/RecommendationEngine";
import type { GameResource } from "@/types/games";
import { useWishlist } from "@/context/WishlistContext";
import { GAME_RESOURCES } from "@/data/games";

import { SEOMetadata } from '@/components/shared/SEOMetadata';
import { LazyGameImage } from "@/components/shared/LazyGameImage";
import { ErrorDialog } from "@/components/shared/ErrorDialog";


export function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [personalizedGames, setPersonalizedGames] = useState<GameResource[]>([]);
  const [trendingGames, setTrendingGames] = useState<GameResource[]>([]);
  const [newReleases, setNewReleases] = useState<GameResource[]>([]);
  const [categoryRecommendations, setCategoryRecommendations] = useState<{[key: string]: GameResource[]}>({});
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<GameResource | null>(null);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [downloading, setDownloading] = useState(false);
  const [showError, setShowError] = useState(false);

  // Reset all states when component mounts
  useEffect(() => {
    console.log('RecommendationsPage mounted - resetting states');
    setDownloading(false);
    setShowError(false);
    setSelectedResource(null);
  }, []);

  // Cleanup states when component unmounts
  useEffect(() => {
    return () => {
      console.log('RecommendationsPage unmounting - cleaning up states');
      setDownloading(false);
      setShowError(false);
      setSelectedResource(null);
    };
  }, []);

  // Load recommendations based on the active tab and user categories
  const loadRecommendations = useCallback(() => {
    // For You tab - personalized recommendations
    const personalized = getPersonalizedRecommendations(8);
    setPersonalizedGames(personalized);

    // Trending tab - most popular games
    setTrendingGames(getTrendingGames(8));

    // New releases
    setNewReleases(getNewReleases(8));

    // Load category recommendations for user's favorite categories
    const categoryRecs: {[key: string]: GameResource[]} = {};
    for (const category of userCategories) {
      categoryRecs[category] = getRecommendationsByCategory(category, 4);
    }
    setCategoryRecommendations(categoryRecs);
  }, [userCategories]);

  // Get user data on mount
  useEffect(() => {
    // Get downloaded games
    const downloadedGameIds = GAME_RESOURCES
      .filter(game => localStorage.getItem(`unlocked_${game.id}`) === 'true')
      .map(game => game.id);

    // Get wishlist
    const wishlistIds: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]');

    // Get favorite categories based on user's downloads and wishlist
    const favoriteCategories = new Map<string, number>();

    // Count categories from downloaded games
    for (const game of GAME_RESOURCES.filter(game => downloadedGameIds.includes(game.id) || wishlistIds.includes(game.id))) {
      const count = favoriteCategories.get(game.category) || 0;
      favoriteCategories.set(game.category, count + 1);
    }

    // Convert to array and sort by frequency
    const sortedCategories = Array.from(favoriteCategories.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);

    // Take top 3 categories or all if less than 3
    setUserCategories(sortedCategories.slice(0, 3));
  }, []);

  // Load recommendations when the tab changes or userCategories change
  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleDownloadClick = async (game: GameResource) => {
    console.log('Download button clicked for:', game.title);

    // Prevent multiple clicks during download
    if (downloading) {
      console.log('Download already in progress');
      return;
    }

    try {
      setDownloading(true);
      setShowError(false);
      setSelectedResource(game);

      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success - in a real app this would trigger the actual download
      console.log(`Download ready for: ${game.title}`);

      // Reset state
      setSelectedResource(null);

    } catch (error) {
      console.error('Error in download process:', error);
      setShowError(true);
      setSelectedResource(null);
    } finally {
      setDownloading(false);
    }
  };

  const handleWishlistToggle = (gameId: string) => {
    if (isInWishlist(gameId)) {
      removeFromWishlist(gameId);
    } else {
      addToWishlist(gameId);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <SEOMetadata
        title="Game Recommendations - PlayVault"
        description="Discover personalized game recommendations based on your preferences and play history."
      />
      <div className="container-custom py-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-[#00f7ff] mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold">Game Recommendations</h1>
          <p className="text-muted-foreground mt-2">
            Discover new games tailored to your interests and preferences
          </p>
        </div>

        <Tabs defaultValue="for-you" value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-6">
            <TabsTrigger
              value="for-you"
              className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground"
            >
              For You
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground"
            >
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="data-[state=active]:bg-[#00f7ff] data-[state=active]:text-primary-foreground"
            >
              New Releases
            </TabsTrigger>
          </TabsList>

          {/* For You Tab */}
          <TabsContent value="for-you" className="space-y-8">
            {personalizedGames.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {personalizedGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onDownload={() => handleDownloadClick(game)}
                      onWishlistToggle={() => handleWishlistToggle(game.id)}
                      isInWishlist={isInWishlist(game.id)}
                      view="grid"
                    />
                  ))}
                </div>

                {/* Show category recommendations */}
                {userCategories.map(category => (
                  <CategorySection
                    key={category}
                    category={category}
                    games={categoryRecommendations[category] || []}
                    onDownload={handleDownloadClick}
                    onWishlistToggle={handleWishlistToggle}
                    isInWishlist={isInWishlist}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12 border border-dashed border-[#00f7ff]/20 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  No personalized recommendations yet. Download or wishlist a few games to get started!
                </p>
                <Link to="/categories">
                  <Button className="btn-primary">Browse Categories</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onDownload={() => handleDownloadClick(game)}
                  onWishlistToggle={() => handleWishlistToggle(game.id)}
                  isInWishlist={isInWishlist(game.id)}
                  view="grid"
                />
              ))}
            </div>
          </TabsContent>

          {/* New Releases Tab */}
          <TabsContent value="new" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newReleases.length > 0 ? (
                newReleases.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onDownload={() => handleDownloadClick(game)}
                    onWishlistToggle={() => handleWishlistToggle(game.id)}
                    isInWishlist={isInWishlist(game.id)}
                    view="grid"
                  />
                ))
              ) : (
                <div className="col-span-4 text-center py-8">
                  <p className="text-muted-foreground">No new releases available right now. Check back later!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Only render dialogs if we have a selected resource */}
        {selectedResource && (
          <>
            {/* Error Dialog */}
            <ErrorDialog
              isOpen={showError}
              onClose={() => {
                console.log('Error dialog closed');
                setShowError(false);
              }}
              message="An error occurred while processing your request. Please try again."
            />


          </>
        )}
      </div>
    </div>
  );
}

export default RecommendationsPage;

// Game Card Component
interface GameCardProps {
  game: GameResource;
  onDownload: () => void;
  onWishlistToggle: () => void;
  isInWishlist: boolean;
  view?: "grid" | "list";
}

function GameCard({ game, onDownload, onWishlistToggle, isInWishlist, view = "grid" }: GameCardProps) {
  const isUnlocked = localStorage.getItem(`unlocked_${game.id}`) === 'true';
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVerifying(true);
    try {
      await onDownload();
    } finally {
      setIsVerifying(false);
    }
  };

  if (view === "list") {
    return (
      <div className="flex gap-4 p-4 border border-[#00f7ff]/20 rounded-lg hover:shadow-md transition-shadow bg-card/70 backdrop-blur-sm">
        <div className="w-24 h-16 flex-shrink-0">
          <LazyGameImage
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-1">{game.title}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{game.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{game.category}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className={`h-8 w-8 rounded-full ${
                  isInWishlist
                    ? 'bg-[#00f7ff]/80 hover:bg-[#00f7ff] text-primary-foreground'
                    : 'bg-black/50 hover:bg-black/70 text-white hover:text-[#00f7ff]'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onWishlistToggle();
                }}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`}
                />
              </Button>
              <Button
                onClick={handleDownloadClick}
                size="sm"
                className="bg-[#00f7ff] hover:bg-[#00d4dd] text-primary-foreground"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : isUnlocked ? (
                  <>
                    <Gamepad2 className="mr-1 h-4 w-4" />
                    Play
                  </>
                ) : (
                  <>
                    <Download className="mr-1 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(0,247,255,0.2)] transition-all">
      <div className="relative h-40 overflow-hidden">
        <LazyGameImage
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {game.featured && (
          <Badge className="absolute top-2 left-2 bg-[#00f7ff] text-primary-foreground z-10">
            Featured
          </Badge>
        )}
        {game.new && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground z-10">
            New
          </Badge>
        )}

        {/* Wishlist button */}
        <Button
          variant="secondary"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 rounded-full z-10 ${
            isInWishlist
              ? 'bg-[#00f7ff]/80 hover:bg-[#00f7ff] text-primary-foreground'
              : 'bg-black/50 hover:bg-black/70 text-white hover:text-[#00f7ff]'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onWishlistToggle();
          }}
        >
          <Heart
            className={`h-4 w-4 ${isInWishlist ? 'fill-primary-foreground' : ''}`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-md mb-1">{game.title}</h3>
            <Badge variant="outline" className="text-xs border-[#00f7ff]/20">
              {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {game.description}
          </p>
        </div>

        <div className="flex justify-between items-center mb-3 text-sm">
          <div className="flex items-center">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            <GameRatingDisplay gameId={game.id} size="sm" showCount={false} />
          </div>
          <span className="text-xs text-muted-foreground">By {game.developer}</span>
        </div>

        <div className="flex gap-2">
          <Button
            className={`flex-1 ${isUnlocked ? 'bg-green-600 hover:bg-green-700' : 'btn-primary'}`}
            onClick={handleDownloadClick}
            disabled={isVerifying}
            size="sm"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : isUnlocked ? (
              <>
                <Gamepad2 className="mr-1 h-4 w-4" />
                Play
              </>
            ) : (
              <>
                <Download className="mr-1 h-4 w-4" />
                Download
              </>
            )}
          </Button>


        </div>
      </CardContent>
    </Card>
  );
}

// Category Section Component
interface CategorySectionProps {
  category: string;
  games: GameResource[];
  onDownload: (game: GameResource) => void;
  onWishlistToggle: (gameId: string) => void;
  isInWishlist: (gameId: string) => boolean;
}

function CategorySection({ category, games, onDownload, onWishlistToggle, isInWishlist }: CategorySectionProps) {
  if (games.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold capitalize">
          Because you like <span className="text-[#00f7ff]">{category}</span> games
        </h2>
        <Link to={`/categories?category=${category}`} className="text-sm text-[#00f7ff] hover:underline">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onDownload={() => onDownload(game)}
            onWishlistToggle={() => onWishlistToggle(game.id)}
            isInWishlist={isInWishlist(game.id)}
            view="grid"
          />
        ))}
      </div>
    </div>
  );
}
