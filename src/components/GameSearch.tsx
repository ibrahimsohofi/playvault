import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import type { GameResource } from '../types/games';

interface GameSearchProps {
  games: GameResource[];
  onFilteredGamesChange: (filteredGames: GameResource[]) => void;
}

interface FilterOptions {
  categories: string[];
  minRating: number;
  sortBy: 'name' | 'rating' | 'downloads' | 'date';
  sortOrder: 'asc' | 'desc';
}

export const GameSearch: React.FC<GameSearchProps> = ({ games, onFilteredGamesChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    minRating: 0,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Extract unique categories from games
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    for (const game of games) {
      if (game.category) {
        categories.add(game.category);
      }
      if (game.features) {
        for (const feature of game.features) {
          categories.add(feature);
        }
      }
    }
    return Array.from(categories).sort();
  }, [games]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    const filtered = games.filter(game => {
      // Search query filter
      const matchesSearch = searchQuery === '' ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.features?.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
        game.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = filters.categories.length === 0 ||
        filters.categories.includes(game.category || '') ||
        game.features?.some(feature => filters.categories.includes(feature)) ||
        game.tags?.some(tag => filters.categories.includes(tag));

      // Rating filter
      const matchesRating = (game.rating || 0) >= filters.minRating;

      return matchesSearch && matchesCategory && matchesRating;
    });

    // Sort games
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'downloads':
          comparison = (a.unlocks || 0) - (b.unlocks || 0);
          break;
        case 'date':
          comparison = new Date(a.releaseDate || 0).getTime() - new Date(b.releaseDate || 0).getTime();
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [games, searchQuery, filters]);

  // Update parent component when filtered games change
  React.useEffect(() => {
    onFilteredGamesChange(filteredGames);
  }, [filteredGames, onFilteredGamesChange]);

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      categories: [],
      minRating: 0,
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = searchQuery !== '' || filters.categories.length > 0 || filters.minRating > 0;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search games by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="rating-asc">Lowest Rated</option>
          <option value="downloads-desc">Most Downloaded</option>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}

        {/* Results Count */}
        <span className="text-sm text-gray-600 ml-auto">
          {filteredGames.length} of {games.length} games
        </span>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          {/* Categories */}
          {availableCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      filters.categories.includes(category)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Minimum Rating */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Minimum Rating</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number.parseFloat(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                {filters.minRating.toFixed(1)}★
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.categories.map(category => (
            <span key={category} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {category}
              <button onClick={() => handleCategoryToggle(category)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Min Rating: {filters.minRating.toFixed(1)}★
              <button onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
