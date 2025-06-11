import type React from 'react';
import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { SEOMetadata } from '../components/shared/SEOMetadata';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GAME_RESOURCES } from '../data/games';
import { ChevronRight, Gamepad2 } from 'lucide-react';
import { GameCategoriesPageSkeleton } from '../components/shared/GameCategoriesPageSkeleton';

// Extract all unique categories from games data
const uniqueCategories = [...new Set(GAME_RESOURCES.map(game => game.category))];

// Create categories with descriptions and counts
const CATEGORIES = uniqueCategories.map(category => {
  const gamesInCategory = GAME_RESOURCES.filter(game => game.category === category);

  // Category descriptions
  const descriptions: Record<string, string> = {
    'action': 'High-energy games with intense gameplay and combat',
    'adventure': 'Explore vast worlds and engaging storylines',
    'strategy': 'Plan and execute winning strategies',
    'sports': 'Compete in virtual sports and athletic challenges',
    'racing': 'Feel the speed and adrenaline of racing games',
    'simulation': 'Experience realistic simulations of real-world activities',
    'puzzle': 'Challenge your mind with brain-teasing puzzles',
    'rpg': 'Role-playing games with character development',
    'casual': 'Easy-to-play games for quick entertainment',
    'arcade': 'Classic arcade-style games with simple controls'
  };

  return {
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    description: descriptions[category] || 'Exciting games in this category',
    count: gamesInCategory.length,
    games: gamesInCategory.slice(0, 3), // Show first 3 games as preview
    image: gamesInCategory[0]?.image || '/images/placeholder.jpg'
  };
});

// Content component
const GameCategoriesContent = () => (
  <>
    <SEOMetadata
      title="Game Categories - PlayVault"
      description="Browse games by categories on PlayVault. Find action, adventure, strategy, sports, and more games."
      url="/categories"
    />
    <div className="min-h-screen pt-16">
      <div className="container-custom py-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Game <span className="text-[#00f7ff]">Categories</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover games organized by categories. Find your favorite genre and explore amazing games.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm card-hover group cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,247,255,0.2)]"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-[#00f7ff] text-primary-foreground mb-2">
                    {category.count} Games
                  </Badge>
                  <h2 className="text-xl font-bold text-white">{category.name}</h2>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">{category.description}</p>

                {/* Preview games */}
                <div className="space-y-2 mb-4">
                  {category.games.map((game) => (
                    <div key={game.id} className="flex items-center gap-3 p-2 rounded hover:bg-card/80 transition-colors">
                      <img
                        src={game.logo}
                        alt={game.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm font-medium truncate">{game.title}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/games?category=${category.id}`}>
                  <Button className="w-full btn-primary">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Browse {category.name}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-16 text-center">
          <div className="bg-card/50 border border-[#00f7ff]/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Choose from <span className="text-[#00f7ff]">{GAME_RESOURCES.length}</span> Amazing Games
            </h3>
            <p className="text-muted-foreground mb-6">
              Across {CATEGORIES.length} different categories, we have something for every gaming preference.
            </p>
            <Link to="/games">
              <Button size="lg" className="btn-primary">
                Browse All Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
);

const GameCategoriesPage: React.FC = () => {
  return (
    <Suspense fallback={<GameCategoriesPageSkeleton />}>
      <GameCategoriesContent />
    </Suspense>
  );
};

export default GameCategoriesPage;
