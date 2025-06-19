import { GameCardSkeleton } from './GameCardSkeleton';

// Generate unique IDs for skeleton elements
let skeletonIdCounter = 0;
const generateSkeletonId = (prefix: string) => `${prefix}-${++skeletonIdCounter}`;

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

// Search Results Skeleton
export function SearchResultsSkeleton({
  isFiltering = false,
  resultCount = 12
}: {
  isFiltering?: boolean;
  resultCount?: number;
}) {
  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div
        className="space-y-4"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '0.1s'
        }}
      >
        {/* Search Query Display */}
        <div className="flex items-center gap-4">
          <ShimmerSkeleton className="h-8 w-32 rounded" delay={0} />
          <ShimmerSkeleton className="h-6 w-48 rounded" delay={0.2} />
        </div>

        {/* Results Count */}
        <ShimmerSkeleton className="h-5 w-40 rounded" delay={0.4} />
      </div>

      {/* Active Filters */}
      {isFiltering && (
        <div
          className="flex flex-wrap gap-2"
          style={{
            animation: 'fadeInUp 0.8s ease-out both',
            animationDelay: '0.2s'
          }}
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div key={generateSkeletonId('search-filter-tag')} className="flex items-center gap-2">
              <ShimmerSkeleton
                className="h-8 w-24 rounded-full"
                delay={0.3 + (index * 0.1)}
              />
            </div>
          ))}
          <ShimmerSkeleton className="h-8 w-20 rounded-full" delay={0.7} />
        </div>
      )}

      {/* Sort and View Options */}
      <div
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '0.3s'
        }}
      >
        <div className="flex gap-4">
          <ShimmerSkeleton className="h-10 w-32 rounded-md" delay={0.4} />
          <ShimmerSkeleton className="h-10 w-28 rounded-md" delay={0.6} />
        </div>
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-10 w-10 rounded-md" delay={0.8} />
          <ShimmerSkeleton className="h-10 w-10 rounded-md" delay={1.0} />
        </div>
      </div>

      {/* Search Results Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '0.4s'
        }}
      >
        {Array.from({ length: resultCount }, (_, index) => (
          <div
            key={generateSkeletonId('search-result')}
            style={{
              animationDelay: `${0.5 + (index * 0.05)}s`,
              animation: 'fadeInUp 0.8s ease-out both'
            }}
          >
            <GameCardSkeleton />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div
        className="flex justify-center mt-8"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '1.0s'
        }}
      >
        <ShimmerSkeleton className="h-12 w-40 rounded-md" delay={1.2} />
      </div>
    </div>
  );
}

// Filter Loading Skeleton (for when filters are being applied)
export function FilterLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={generateSkeletonId('filter-category')}
            className="space-y-3"
            style={{
              animation: 'fadeInUp 0.6s ease-out both',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <ShimmerSkeleton className="h-5 w-20 rounded" delay={index * 0.1} />
            <div className="space-y-2">
              {Array.from({ length: 3 }, (_, subIndex) => (
                <div key={generateSkeletonId('filter-option')} className="flex items-center gap-3">
                  <ShimmerSkeleton className="h-4 w-4 rounded" delay={0.2 + (index * 0.1) + (subIndex * 0.05)} />
                  <ShimmerSkeleton className="h-4 w-16 rounded" delay={0.3 + (index * 0.1) + (subIndex * 0.05)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Apply Filters Button */}
      <div
        className="flex justify-end"
        style={{
          animation: 'fadeInUp 0.6s ease-out both',
          animationDelay: '0.5s'
        }}
      >
        <ShimmerSkeleton className="h-10 w-32 rounded-md" delay={0.6} />
      </div>
    </div>
  );
}

// Category Skeleton (for category pages)
export function CategorySkeleton({ categoryName }: { categoryName?: string }) {
  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div
        className="text-center space-y-4"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '0.1s'
        }}
      >
        {categoryName ? (
          <ShimmerSkeleton className="h-12 w-64 mx-auto rounded-lg" delay={0} />
        ) : (
          <ShimmerSkeleton className="h-12 w-48 mx-auto rounded-lg" delay={0} />
        )}
        <ShimmerSkeleton className="h-6 w-96 mx-auto rounded" delay={0.2} />
      </div>

      {/* Category Stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '0.2s'
        }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={generateSkeletonId('category-stat')}
            className="text-center bg-card/70 border border-[#00f7ff]/20 rounded-lg p-4 relative overflow-hidden"
          >
            {/* Card shimmer background */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"
              style={{ animationDelay: `${0.4 + (index * 0.2)}s` }}
            />

            <div className="relative z-10">
              <ShimmerSkeleton
                className="h-8 w-12 mx-auto mb-2 rounded"
                delay={0.3 + (index * 0.1)}
              />
              <ShimmerSkeleton
                className="h-4 w-16 mx-auto rounded"
                delay={0.5 + (index * 0.1)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Featured Games in Category */}
      <div
        className="space-y-6"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '0.3s'
        }}
      >
        <div className="flex items-center justify-between">
          <ShimmerSkeleton className="h-8 w-40 rounded-lg" delay={0.4} />
          <ShimmerSkeleton className="h-6 w-24 rounded" delay={0.6} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={generateSkeletonId('featured')}
              style={{
                animationDelay: `${0.7 + (index * 0.1)}s`,
                animation: 'fadeInUp 0.8s ease-out both'
              }}
            >
              <GameCardSkeleton />
            </div>
          ))}
        </div>
      </div>

      {/* All Games in Category */}
      <div
        className="space-y-6"
        style={{
          animation: 'fadeInUp 0.8s ease-out both',
          animationDelay: '0.5s'
        }}
      >
        <div className="flex items-center justify-between border-t border-[#00f7ff]/20 pt-8">
          <ShimmerSkeleton className="h-8 w-48 rounded-lg" delay={0.6} />
          <div className="flex gap-4">
            <ShimmerSkeleton className="h-10 w-32 rounded-md" delay={0.8} />
            <ShimmerSkeleton className="h-10 w-24 rounded-md" delay={1.0} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={generateSkeletonId('category-game')}
              style={{
                animationDelay: `${1.2 + (index * 0.05)}s`,
                animation: 'fadeInUp 0.8s ease-out both'
              }}
            >
              <GameCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
