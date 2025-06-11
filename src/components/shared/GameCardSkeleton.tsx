import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Enhanced Skeleton component with shimmer effect
function ShimmerSkeleton({
  className,
  delay = 0
}: {
  className: string;
  delay?: number;
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
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm">
      <div className="relative h-48 overflow-hidden">
        {/* Main shimmer background with improved gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-900/50">
          {/* Primary shimmer wave - improved for smoother animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 animate-shimmer opacity-80" />

          {/* Secondary shimmer wave with delay - cyan theme accent */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f7ff]/8 to-transparent -skew-x-12 animate-shimmer"
            style={{ animationDelay: '0.8s' }}
          />

          {/* Game icon placeholder with better styling */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-700/30 rounded-xl animate-pulse border border-[#00f7ff]/10 shadow-sm" />
          </div>
        </div>

        {/* Skeleton badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <ShimmerSkeleton className="h-5 w-16 rounded" delay={0.2} />
        </div>

        {/* Skeleton wishlist button */}
        <div className="absolute top-2 right-2 z-10">
          <ShimmerSkeleton className="h-8 w-8 rounded-full" delay={0.4} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
      </div>

      <CardContent className="p-6 relative">
        {/* Card content shimmer background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 animate-shimmer"
             style={{ animationDelay: '1.2s' }} />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <ShimmerSkeleton className="w-10 h-10 rounded-lg" delay={0.6} />
              <ShimmerSkeleton className="h-6 w-40 rounded" delay={0.8} />
            </div>
            <div className="flex items-center gap-2">
              <ShimmerSkeleton className="h-5 w-16 rounded" delay={1.0} />
              <ShimmerSkeleton className="h-5 w-12 rounded" delay={1.2} />
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <ShimmerSkeleton className="h-4 w-full rounded" delay={1.4} />
            <ShimmerSkeleton className="h-4 w-3/4 rounded" delay={1.6} />
          </div>

          <div className="flex justify-between items-center mb-4">
            <ShimmerSkeleton className="h-4 w-16 rounded" delay={1.8} />
            <ShimmerSkeleton className="h-4 w-20 rounded" delay={2.0} />
          </div>

          <ShimmerSkeleton className="h-10 w-full rounded-md" delay={2.2} />
        </div>
      </CardContent>
    </Card>
  );
}
