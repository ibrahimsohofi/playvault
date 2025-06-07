import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden border-[#00f7ff]/20 bg-card/70 backdrop-blur-sm">
      <div className="relative h-48 overflow-hidden">
        {/* Main shimmer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/30 dark:from-gray-800/40 dark:to-gray-900/60">
          {/* Primary shimmer wave */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />

          {/* Secondary shimmer wave with delay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f7ff]/10 to-transparent -skew-x-12 animate-shimmer"
            style={{ animationDelay: '0.5s' }}
          />

          {/* Game icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-700/20 rounded-xl animate-pulse border border-gray-600/10" />
          </div>
        </div>

        {/* Skeleton badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <Skeleton className="h-5 w-16 bg-gray-700/30" />
        </div>

        {/* Skeleton wishlist button */}
        <div className="absolute top-2 right-2 z-10">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-700/30" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-lg bg-gray-700/30" />
            <Skeleton className="h-6 w-40 bg-gray-700/30" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 bg-gray-700/30" />
            <Skeleton className="h-5 w-12 bg-gray-700/30" />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full bg-gray-700/30" />
          <Skeleton className="h-4 w-3/4 bg-gray-700/30" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-16 bg-gray-700/30" />
          <Skeleton className="h-4 w-20 bg-gray-700/30" />
        </div>

        <Skeleton className="h-10 w-full bg-gray-700/30 rounded-md" />
      </CardContent>
    </Card>
  );
}
