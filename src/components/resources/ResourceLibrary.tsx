import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, startTransition } from "react";
import { SearchBar } from "../shared/SearchBar";
import { Link } from "react-router-dom";
import { GAME_RESOURCES } from "../../data/games";
import type { GameResource } from "../../types/games";
import { Filter, ChevronDown, ChevronUp, Star, Download, ShieldAlert, Heart, Gamepad } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useDialogContext } from "@/context/DialogContext";
import { GameCardSkeleton } from "../shared/GameCardSkeleton";

// Extract all unique categories from games data
const uniqueCategories = [...new Set(GAME_RESOURCES.map(game => game.category))];

// Create categories array with counts
const CATEGORIES = [
  { id: "all", name: "All Games", count: GAME_RESOURCES.length },
  ...uniqueCategories.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    count: GAME_RESOURCES.filter(game => game.category === category).length
  }))
];

type ResourceLibraryProps = {
  initialCategory?: string | null;
};

export function ResourceLibrary({ initialCategory = null }: ResourceLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<GameResource | null>(null);
  const [filteredResources, setFilteredResources] = useState<GameResource[]>(GAME_RESOURCES);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { queueDialog, closeDialog } = useDialogContext();

  // Download state
  const [downloading, setDownloading] = useState(false);

  // Verification dialog state
  const [verifying, setVerifying] = useState(false);
  const [pendingResource, setPendingResource] = useState<GameResource | null>(null);

  // Simulate initial loading state
  useEffect(() => {
    setIsLoading(true);
    const loadingTimer = setTimeout(() => {
      startTransition(() => {
        setIsLoading(false);
      });
    }, 1500); // 1.5 second loading simulation

    return () => clearTimeout(loadingTimer);
  }, []);

  // Set initial category when initialCategory prop changes
  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, selectedCategory]);

  // Apply filtering when category or search query changes
  useEffect(() => {
    let result = GAME_RESOURCES;

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "featured") {
        result = result.filter(resource => resource.featured);
      } else if (selectedCategory === "new") {
        result = result.filter(resource => resource.new);
      } else {
        result = result.filter(resource => resource.category === selectedCategory);
      }
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        resource =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.category.toLowerCase().includes(query)
      );
    }

    startTransition(() => {
      setFilteredResources(result);
    });
  }, [selectedCategory, searchQuery]);

  const handleResourceClick = (resource: GameResource) => {
    setSelectedResource(resource);
  };

  const handleDownloadClick = (resource: GameResource) => {
    console.log('Download clicked for:', resource.title);
    setSelectedResource(resource);
    handleDownloadVerifyClick(resource);
  };

  const handleDownloadVerifyClick = async (resource: GameResource) => {
    console.log('Download verify clicked for:', resource.title);

    if (downloading) {
      console.log('Download already in progress');
      return;
    }

    try {
      setDownloading(true);

      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      queueDialog({
        type: 'success',
        props: {
          title: 'Download Ready',
          message: `${resource.title} is ready for download. Thank you for using PlayVault!`,
          onClose: closeDialog
        },
        priority: 0,
      });

    } catch (error) {
      console.error('Error during download process:', error);
      queueDialog({
        type: 'error',
        props: {
          title: 'Download Failed',
          message: 'An error occurred during the download process. Please try again.',
          onClose: closeDialog
        },
        priority: 0,
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleVerificationComplete = () => {
    if (pendingResource) {
      setSelectedResource(pendingResource);
    }
    setVerifying(false);
    setPendingResource(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  // Count of featured and new games
  const featuredCount = GAME_RESOURCES.filter(game => game.featured).length;
  const newCount = GAME_RESOURCES.filter(game => game.new).length;

  return (
    <section id="games" className="py-20 relative">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Explore Our Game <span className="text-[#00f7ff]">Library</span>
          </h2>
          <p className="text-muted-foreground">
            Browse our collection of popular mobile games across various categories.
            Use the filter options to find exactly what you're looking for.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
          {/* Search bar */}
          <div className="w-full md:w-1/2">
            <SearchBar
              onSearch={handleSearch}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search games by title, category or features..."
            />
          </div>

          {/* Filter controls for mobile */}
          <div className="md:hidden w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between border-[#00f7ff]/30 hover:bg-[#00f7ff]/10"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter: {selectedCategory === "all" ? "All Games" : CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
              </div>
              {showCategoryDropdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showCategoryDropdown && (
              <div className="mt-2 bg-card border border-[#00f7ff]/20 rounded-md p-2 shadow-lg z-10 relative">
                {CATEGORIES.map(category => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`px-3 py-1.5 text-sm cursor-pointer mb-1 w-full justify-between ${
                      selectedCategory === category.id
                        ? "bg-[#00f7ff] hover:bg-[#00c4cc] text-primary-foreground"
                        : "hover:bg-[#00f7ff]/10 border-[#00f7ff]/30"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs opacity-80">{category.count}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick filter badges for desktop */}
        <div className="hidden md:flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground mr-1">Quick Filters:</span>
          {CATEGORIES.map(category => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`px-3 py-1.5 text-sm cursor-pointer ${
                selectedCategory === category.id
                  ? "bg-[#00f7ff] hover:bg-[#00c4cc] text-primary-foreground"
                  : "hover:bg-[#00f7ff]/10 border-[#00f7ff]/30"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name} <span className="ml-1 text-xs opacity-80">({category.count})</span>
            </Badge>
          ))}

          <Badge
            variant={selectedCategory === "featured" ? "default" : "outline"}
            className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary/10 border-secondary/30 ${
              selectedCategory === "featured" ? "bg-[#00f7ff] text-primary-foreground" : ""
            }`}
            onClick={() => setSelectedCategory("featured")}
          >
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            Featured <span className="ml-1 text-xs opacity-80">({featuredCount})</span>
          </Badge>

          <Badge
            variant={selectedCategory === "new" ? "default" : "outline"}
            className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-pink-600/10 border-pink-600/30 ${
              selectedCategory === "new" ? "bg-pink-600 text-white" : ""
            }`}
            onClick={() => setSelectedCategory("new")}
          >
            <ShieldAlert className="h-3 w-3 mr-1 text-pink-600" />
            New <span className="ml-1 text-xs opacity-80">({newCount})</span>
          </Badge>
        </div>

        {/* Active filters display */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="flex items-center gap-2 mb-6 p-2 bg-card/50 border border-[#00f7ff]/10 rounded">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            {selectedCategory !== "all" && (
              <Badge className="bg-[#00f7ff]/20 text-foreground hover:bg-[#00f7ff]/30 cursor-pointer" onClick={() => setSelectedCategory("all")}>
                Category: {selectedCategory === "featured"
                  ? "Featured"
                  : selectedCategory === "new"
                  ? "New"
                  : CATEGORIES.find(c => c.id === selectedCategory)?.name} ✕
              </Badge>
            )}
            {searchQuery && (
              <Badge className="bg-[#00f7ff]/20 text-foreground hover:bg-[#00f7ff]/30 cursor-pointer" onClick={() => setSearchQuery("")}>
                Search: "{searchQuery}" ✕
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}

        {/* Search results count */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              {filteredResources.length === 0
                ? `No results found ${searchQuery ? `for "${searchQuery}"` : ""} ${
                    selectedCategory !== "all"
                      ? `in category "${
                          selectedCategory === "featured"
                            ? "Featured"
                            : selectedCategory === "new"
                            ? "New"
                            : CATEGORIES.find(c => c.id === selectedCategory)?.name
                        }"`
                      : ""
                  }`
                : `Found ${filteredResources.length} result${filteredResources.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}

        {/* Resources grid with skeleton loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show 6 skeleton loaders during initial load */}
            {Array.from({ length: 6 }, (_, index) => (
              <GameCardSkeleton key={`skeleton-${Date.now()}-${index}`} />
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDownloadClick={() => handleDownloadClick(resource)}
                onGameClick={() => handleResourceClick(resource)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-[#00f7ff]/20 rounded-lg bg-card/30">
            <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No Games Found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or browsing a different category.</p>
            <Button variant="outline" className="border-[#00f7ff]/30 hover:bg-[#00f7ff]/10" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

type ResourceCardProps = {
  resource: GameResource;
  onDownloadClick: () => void;
  onGameClick?: () => void;
};

function ResourceCard({ resource, onDownloadClick, onGameClick }: ResourceCardProps) {
  const isUnlocked = localStorage.getItem(`unlocked_${resource.id}`) === 'true';
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(resource.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (inWishlist) {
      removeFromWishlist(resource.id);
    } else {
      addToWishlist(resource.id);
    }
  };

  const handleCardClick = () => {
    // Navigate to game details page
    window.location.href = `/games/${resource.id}`;
  };

  return (
    <Card
      className="overflow-hidden border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm card-hover group cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,247,255,0.2)]"
      onClick={handleCardClick}
    >
        <div className="relative h-48 overflow-hidden">
          <img
            src={resource.image}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {resource.featured && resource.new ? (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <Badge className="bg-[#00f7ff] text-primary-foreground">
                Featured
              </Badge>
              <Badge className="bg-pink-600 text-white">
                New
              </Badge>
            </div>
          ) : resource.featured ? (
            <Badge className="absolute top-2 left-2 bg-[#00f7ff] text-primary-foreground">
              Featured
            </Badge>
          ) : resource.new ? (
            <Badge className="absolute top-2 left-2 bg-pink-600 text-white">
              New
            </Badge>
          ) : null}

          {/* Wishlist button */}
          <Button
            variant="secondary"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full ${
              inWishlist
                ? 'bg-[#00f7ff]/80 hover:bg-[#00f7ff] text-primary-foreground'
                : 'bg-black/50 hover:bg-black/70 text-white hover:text-[#00f7ff]'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 ${inWishlist ? 'fill-primary-foreground' : ''}`}
            />
          </Button>

          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
        </div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <img src={resource.logo} alt={`${resource.title}logo`} className="w-10 h-10 rounded-lg shadow border border-[#00f7ff]/50 bg-background object-contain " />
              <h3 className="truncate max-w-[65vw] text-base sm:text-xl font-bold group-hover:text-[#00f7ff] transition-colors">{resource.title}</h3>
            </div>
            <div className="flex items-center">
              {resource.featured && (
                <span className="inline-block px-2 py-0.5 bg-[#00f7ff]/20 text-[#00f7ff] rounded-full text-xs font-semibold mr-2 animate-pulse shadow-[0_0_6px_#00f7ff99] ml-2">
                  Featured
                </span>
              )}
              <Badge variant="outline" className="text-xs border-[#00f7ff]/20">
                {resource.category}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>

          <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span>{resource.rating}/5</span>
            </div>
            <div>
              <Download className="h-4 w-4 inline mr-1" />
              <span>{resource.unlocks.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-2">

            <Button
              className="flex-1 btn-primary shine-effect"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDownloadClick();
              }}
            >
              <Download className="mr-1 h-4 w-4" />
              DOWNLOAD
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}
