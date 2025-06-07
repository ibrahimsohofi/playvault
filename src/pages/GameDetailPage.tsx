import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load the actual GameDetailPage component
const LazyGameDetailPageContent = lazy(() => import('../components/GameDetailPageContent').then(module => ({ default: module.GameDetailPageContent })));

// Loading component
const GameDetailPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300/20 rounded mb-6 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-300/20 rounded-lg" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-300/20 rounded w-3/4" />
            <div className="h-6 bg-gray-300/20 rounded w-1/2" />
            <div className="h-32 bg-gray-300/20 rounded" />
            <div className="h-12 bg-gray-300/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
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
