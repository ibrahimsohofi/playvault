import type React from 'react';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import type { GameRating } from '@/types/games';

interface GameRatingDisplayProps {
  gameId: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const GameRatingDisplay: React.FC<GameRatingDisplayProps> = ({
  gameId,
  size = 'md',
  showCount = true,
  className = ''
}) => {
  const [rating, setRating] = useState<GameRating | null>(null);

  useEffect(() => {
    const loadRating = () => {
      const storedRating = localStorage.getItem(`rating_${gameId}`);
      if (storedRating) {
        setRating(JSON.parse(storedRating));
      }
    };

    loadRating();

    // Listen for rating updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `rating_${gameId}`) {
        loadRating();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [gameId]);

  if (!rating || rating.totalRatings === 0) {
    return (
      <div className={`flex items-center gap-1 text-gray-400 ${className}`}>
        <Star className={`${getSizeClasses(size)} text-gray-300`} />
        <span className={`text-gray-500 ${getTextSizeClasses(size)}`}>
          No ratings
        </span>
      </div>
    );
  }

  const renderStars = () => {
    const fullStars = Math.floor(rating.averageRating);
    const hasHalfStar = rating.averageRating % 1 >= 0.5;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`${getSizeClasses(size)} fill-yellow-400 text-yellow-400`}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${getSizeClasses(size)} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${getSizeClasses(size)} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`${getSizeClasses(size)} text-gray-300`}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      <span className={`font-medium text-gray-700 ${getTextSizeClasses(size)}`}>
        {rating.averageRating.toFixed(1)}
      </span>
      {showCount && (
        <span className={`text-gray-500 ${getTextSizeClasses(size)}`}>
          ({rating.totalRatings})
        </span>
      )}
    </div>
  );
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'h-3 w-3';
    case 'md':
      return 'h-4 w-4';
    case 'lg':
      return 'h-5 w-5';
    default:
      return 'h-4 w-4';
  }
};

const getTextSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    default:
      return 'text-sm';
  }
};

export default GameRatingDisplay;
