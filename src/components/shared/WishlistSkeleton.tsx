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

export function WishlistSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div
          className="mb-8"
          style={{
            animation: 'fadeInUp 0.8s ease-out both',
            animationDelay: '0.1s'
          }}
        >
          <ShimmerSkeleton className="h-12 w-64 mb-4 rounded-lg" delay={0} />
          <ShimmerSkeleton className="h-6 w-96 rounded" delay={0.2} />
        </div>

        {/* Wishlist Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          style={{
            animation: 'fadeInUp 0.8s ease-out both',
            animationDelay: '0.2s'
          }}
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={generateSkeletonId('stat')}
              className="bg-card/70 border border-[#00f7ff]/20 rounded-lg p-6 text-center relative overflow-hidden"
            >
              {/* Card shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}
              />

              <div className="relative z-10">
                <ShimmerSkeleton
                  className="h-8 w-16 mx-auto mb-2 rounded"
                  delay={0.4 + (index * 0.1)}
                />
                <ShimmerSkeleton
                  className="h-4 w-24 mx-auto rounded"
                  delay={0.6 + (index * 0.1)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filter and Sort Options */}
        <div
          className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center"
          style={{
            animation: 'fadeInUp 0.8s ease-out both',
            animationDelay: '0.3s'
          }}
        >
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <ShimmerSkeleton className="h-12 w-full sm:w-80 rounded-md" delay={0.4} />
            <div className="flex gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <ShimmerSkeleton
                  key={generateSkeletonId('filter')}
                  className="h-10 w-24 rounded-full"
                  delay={0.6 + (index * 0.1)}
                />
              ))}
            </div>
          </div>

          {/* Sort and View Options */}
          <div className="flex gap-2">
            <ShimmerSkeleton className="h-10 w-32 rounded-md" delay={0.8} />
            <ShimmerSkeleton className="h-10 w-20 rounded-md" delay={1.0} />
          </div>
        </div>

        {/* Wishlist Content */}
        <div
          className="space-y-8"
          style={{
            animation: 'fadeInUp 0.8s ease-out both',
            animationDelay: '0.4s'
          }}
        >
          {/* Recently Added Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <ShimmerSkeleton className="h-8 w-48 rounded-lg" delay={0.5} />
              <ShimmerSkeleton className="h-6 w-20 rounded" delay={0.7} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={generateSkeletonId('recent')}
                  style={{
                    animationDelay: `${0.8 + (index * 0.15)}s`,
                    animation: 'fadeInUp 0.8s ease-out both'
                  }}
                >
                  <GameCardSkeleton />
                </div>
              ))}
            </div>
          </div>

          {/* All Wishlist Items */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-t border-[#00f7ff]/20 pt-8">
              <ShimmerSkeleton className="h-8 w-40 rounded-lg" delay={0.6} />
              <div className="flex items-center gap-4">
                <ShimmerSkeleton className="h-6 w-24 rounded" delay={0.8} />
                <ShimmerSkeleton className="h-8 w-32 rounded-md" delay={1.0} />
              </div>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }, (_, index) => (
                <div
                  key={generateSkeletonId('wishlist')}
                  style={{
                    animationDelay: `${1.2 + (index * 0.1)}s`,
                    animation: 'fadeInUp 0.8s ease-out both'
                  }}
                >
                  <GameCardSkeleton />
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div
              className="flex justify-center mt-12"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '1.5s'
              }}
            >
              <div className="flex items-center gap-2">
                <ShimmerSkeleton className="h-10 w-10 rounded-md" delay={1.6} />
                {Array.from({ length: 5 }, (_, index) => (
                  <ShimmerSkeleton
                    key={generateSkeletonId('page')}
                    className="h-10 w-10 rounded-md"
                    delay={1.8 + (index * 0.1)}
                  />
                ))}
                <ShimmerSkeleton className="h-10 w-10 rounded-md" delay={2.3} />
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Placeholder (for variety) */}
        <div
          className="text-center mt-16 space-y-6"
          style={{
            animation: 'fadeInUp 0.8s ease-out both',
            animationDelay: '0.8s'
          }}
        >
          {/* Large icon placeholder */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-800/30 to-gray-900/50 relative overflow-hidden rounded-2xl">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 animate-shimmer opacity-80"
                style={{ animationDelay: '1.0s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-700/40 rounded-lg border border-[#00f7ff]/20" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ShimmerSkeleton className="h-8 w-64 mx-auto rounded-lg" delay={1.2} />
            <ShimmerSkeleton className="h-6 w-96 mx-auto rounded" delay={1.4} />
            <ShimmerSkeleton className="h-12 w-48 mx-auto rounded-md" delay={1.6} />
          </div>
        </div>
      </div>
    </div>
  );
}
