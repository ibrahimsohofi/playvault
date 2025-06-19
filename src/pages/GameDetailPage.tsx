import { Suspense, lazy, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { generateSkeletonKeys } from '../utils/uniqueId';

// Lazy load the actual GameDetailPage component
const LazyGameDetailPageContent = lazy(() => import('../components/GameDetailPageContent'));

// Loading component that matches the actual GameDetailPageContent layout
const GameDetailPageSkeleton = () => {
  // Generate unique IDs for skeleton elements
  const statIds = useMemo(() => generateSkeletonKeys(4, 'stat'), []);
  const tabIds = useMemo(() => generateSkeletonKeys(3, 'tab'), []);
  const screenshotIds = useMemo(() => generateSkeletonKeys(4, 'screenshot'), []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900">
    <div className="container-custom py-12 pt-24">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="flex items-center my-6 mb-8">
          <div className="h-4 w-4 bg-gray-300/20 rounded mr-2" />
          <div className="h-4 bg-gray-300/20 rounded w-32" />
        </div>

        {/* Game header - matches the actual flex layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-6 md:mb-10">
          {/* Game image - matches lg:w-1/3 */}
          <div className="w-full lg:w-1/3">
            <div className="relative overflow-hidden rounded-lg border border-gray-300/10">
              <div className="w-full h-80 bg-gray-300/20 rounded" />
              {/* Badge placeholder */}
              <div className="absolute top-3 left-3">
                <div className="h-6 w-16 bg-gray-300/30 rounded" />
              </div>
            </div>
          </div>

          {/* Game details - matches lg:w-2/3 */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Title and rating */}
            <div className="space-y-4">
              <div className="h-10 bg-gray-300/20 rounded w-3/4" />
              <div className="flex items-center gap-4">
                <div className="h-6 w-24 bg-gray-300/20 rounded" />
                <div className="h-6 w-32 bg-gray-300/20 rounded" />
              </div>
            </div>

            {/* Game stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statIds.map((id) => (
                <div key={id} className="bg-card/20 border border-gray-300/10 rounded-lg p-4 text-center">
                  <div className="h-6 w-12 bg-gray-300/20 rounded mx-auto mb-2" />
                  <div className="h-4 w-16 bg-gray-300/20 rounded mx-auto" />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="h-6 w-32 bg-gray-300/20 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-300/20 rounded" />
                <div className="h-4 w-5/6 bg-gray-300/20 rounded" />
                <div className="h-4 w-4/6 bg-gray-300/20 rounded" />
              </div>
            </div>

            {/* Download button and wishlist */}
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-gray-300/20 rounded" />
              <div className="h-12 w-12 bg-gray-300/20 rounded" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="mb-8">
          <div className="flex gap-6 border-b border-gray-300/10 mb-6">
            {tabIds.map((id) => (
              <div key={id} className="h-8 w-20 bg-gray-300/20 rounded" />
            ))}
          </div>

          {/* Tab content skeleton */}
          <div className="space-y-6">
            {/* Screenshots section */}
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-300/20 rounded" />
              <div className="aspect-video bg-gray-300/20 rounded-lg" />
              <div className="grid grid-cols-4 gap-3">
                {screenshotIds.map((id) => (
                  <div key={id} className="aspect-video bg-gray-300/20 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-900 flex items-center justify-center">
    <div className="text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-slate-300 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

export default function GameDetailPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<GameDetailPageSkeleton />}>
        <LazyGameDetailPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
