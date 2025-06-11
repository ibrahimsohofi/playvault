import { useMemo } from 'react';
import { generateSkeletonKeys } from '../../utils/uniqueId';

// Enhanced Skeleton component with shimmer effect
function ShimmerSkeleton({
  className,
  delay = 0,
  children
}: {
  className: string;
  delay?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${className} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-inherit" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 animate-shimmer"
        style={{ animationDelay: `${delay}s` }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f7ff]/8 to-transparent -skew-x-12 animate-shimmer"
        style={{ animationDelay: `${delay + 0.4}s` }}
      />
      {children}
    </div>
  );
}

export function GameCategoriesPageSkeleton() {
  // Generate unique IDs for skeleton elements
  const categoryIds = useMemo(() => generateSkeletonKeys(9, 'category'), []);
  const gameIds = useMemo(() => generateSkeletonKeys(3, 'game'), []);

  return (
    <div className="min-h-screen pt-16">
      <div className="container-custom py-8">
        {/* Header Section Skeleton */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="mb-6">
            <ShimmerSkeleton
              className="h-12 md:h-16 w-80 mx-auto rounded-lg"
              delay={0}
            />
          </div>
          <ShimmerSkeleton
            className="h-6 w-96 mx-auto rounded"
            delay={0.2}
          />
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryIds.map((id, index) => (
            <div
              key={id}
              className="overflow-hidden border border-gray-300/10 bg-card/20 backdrop-blur-sm rounded-lg relative"
              style={{
                animationDelay: `${0.4 + (index * 0.1)}s`,
                animation: 'fadeInUp 0.8s ease-out both'
              }}
            >
              {/* Card shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: `${1.0 + (index * 0.2)}s` }}
              />

              {/* Category Image Skeleton */}
              <div className="relative h-48 overflow-hidden">
                <ShimmerSkeleton
                  className="w-full h-full"
                  delay={0.6 + (index * 0.1)}
                />
                {/* Gradient overlay skeleton */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Bottom content overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <ShimmerSkeleton
                    className="h-6 w-20 rounded mb-2"
                    delay={0.8 + (index * 0.1)}
                  />
                  <ShimmerSkeleton
                    className="h-6 w-32 rounded"
                    delay={1.0 + (index * 0.1)}
                  />
                </div>
              </div>

              {/* Card Content Skeleton */}
              <div className="p-6 relative z-10">
                {/* Description */}
                <div className="mb-4 space-y-2">
                  <ShimmerSkeleton
                    className="h-4 w-full rounded"
                    delay={1.2 + (index * 0.1)}
                  />
                  <ShimmerSkeleton
                    className="h-4 w-3/4 rounded"
                    delay={1.4 + (index * 0.1)}
                  />
                </div>

                {/* Preview Games List */}
                <div className="space-y-2 mb-4">
                  {gameIds.map((gameId, gameIndex) => (
                    <div
                      key={`${id}-${gameId}`}
                      className="flex items-center gap-3 p-2 rounded"
                    >
                      <ShimmerSkeleton
                        className="w-8 h-8 rounded"
                        delay={1.6 + (index * 0.1) + (gameIndex * 0.05)}
                      />
                      <ShimmerSkeleton
                        className="h-4 w-24 rounded"
                        delay={1.8 + (index * 0.1) + (gameIndex * 0.05)}
                      />
                    </div>
                  ))}
                </div>

                {/* Browse Button */}
                <ShimmerSkeleton
                  className="h-10 w-full rounded-md"
                  delay={2.0 + (index * 0.1)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section Skeleton */}
        <div className="mt-16 text-center">
          <div
            className="bg-card/20 border border-gray-300/10 rounded-lg p-8 relative overflow-hidden"
            style={{
              animationDelay: '1.5s',
              animation: 'fadeInUp 0.8s ease-out both'
            }}
          >
            {/* Card shimmer background */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
              style={{ animationDelay: '2.5s' }}
            />

            <div className="relative z-10">
              <ShimmerSkeleton
                className="h-8 w-96 mx-auto mb-4 rounded-lg"
                delay={1.7}
              />
              <div className="mb-6 space-y-2">
                <ShimmerSkeleton
                  className="h-5 w-full max-w-md mx-auto rounded"
                  delay={1.9}
                />
                <ShimmerSkeleton
                  className="h-5 w-3/4 max-w-md mx-auto rounded"
                  delay={2.1}
                />
              </div>
              <ShimmerSkeleton
                className="h-12 w-48 mx-auto rounded-md"
                delay={2.3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
