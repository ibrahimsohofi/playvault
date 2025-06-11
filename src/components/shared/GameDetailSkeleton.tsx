import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { generateSkeletonKeys } from '../../utils/uniqueId';

// Neutral Skeleton component without any theme colors
function NeutralSkeleton({
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
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200/40 to-gray-300/40 dark:from-gray-800/40 dark:to-gray-700/40 rounded-inherit" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/20 dark:via-gray-600/20 to-transparent -skew-x-12 animate-shimmer"
        style={{ animationDelay: `${delay}s` }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-gray-500/10 to-transparent -skew-x-12 animate-shimmer"
        style={{ animationDelay: `${delay + 0.5}s` }}
      />
      {children}
    </div>
  );
}

// Neutral Image skeleton for game screenshots
function GameImageSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="aspect-video bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-800/50 dark:to-gray-900/50 relative overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/30 dark:via-gray-600/30 to-transparent -skew-x-12 animate-shimmer opacity-70"
        style={{ animationDelay: `${delay}s` }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 dark:via-gray-500/15 to-transparent -skew-x-12 animate-shimmer"
        style={{ animationDelay: `${delay + 0.7}s` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-300/60 dark:bg-gray-700/60 rounded-lg border border-gray-400/30 dark:border-gray-600/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function GameDetailSkeleton() {
  // Generate unique IDs for skeleton elements
  const statIds = useMemo(() => generateSkeletonKeys(4, 'stat'), []);
  const thumbIds = useMemo(() => generateSkeletonKeys(4, 'thumb'), []);
  const infoIds = useMemo(() => generateSkeletonKeys(6, 'info'), []);
  const reviewIds = useMemo(() => generateSkeletonKeys(3, 'review'), []);
  const relatedIds = useMemo(() => generateSkeletonKeys(3, 'related'), []);

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumbs Skeleton */}
        <div className="mb-6">
          <NeutralSkeleton className="h-4 w-64 rounded" delay={0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game Header */}
            <div
              className="space-y-6"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '0.2s'
              }}
            >
              {/* Game Title and Rating */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-3">
                  <NeutralSkeleton className="h-10 w-80 rounded-lg" delay={0.2} />
                  <div className="flex items-center gap-4">
                    <NeutralSkeleton className="h-6 w-24 rounded" delay={0.4} />
                    <NeutralSkeleton className="h-6 w-32 rounded" delay={0.6} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <NeutralSkeleton className="h-10 w-32 rounded-md" delay={0.8} />
                  <NeutralSkeleton className="h-10 w-10 rounded-md" delay={1.0} />
                </div>
              </div>

              {/* Game Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statIds.map((id, index) => (
                  <Card key={id} className="bg-card/50 border-gray-200/50 dark:border-gray-700/50">
                    <CardContent className="p-4 text-center relative overflow-hidden">
                      {/* Card neutral shimmer background */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/10 dark:via-gray-600/10 to-transparent -skew-x-12 animate-shimmer"
                        style={{ animationDelay: `${1.4 + (index * 0.2)}s` }}
                      />

                      <div className="relative z-10">
                        <NeutralSkeleton
                          className="h-6 w-12 mx-auto mb-2 rounded"
                          delay={1.2 + (index * 0.1)}
                        />
                        <NeutralSkeleton
                          className="h-4 w-16 mx-auto rounded"
                          delay={1.4 + (index * 0.1)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Game Description */}
            <Card
              className="bg-card/50 border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '0.4s'
              }}
            >
              {/* Card neutral shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: '1.8s' }}
              />

              <CardContent className="p-6 relative z-10">
                <NeutralSkeleton className="h-6 w-32 mb-4 rounded" delay={0.6} />
                <div className="space-y-3">
                  <NeutralSkeleton className="h-4 w-full rounded" delay={0.8} />
                  <NeutralSkeleton className="h-4 w-5/6 rounded" delay={1.0} />
                  <NeutralSkeleton className="h-4 w-4/6 rounded" delay={1.2} />
                </div>
              </CardContent>
            </Card>

            {/* Screenshots Gallery */}
            <Card
              className="bg-card/50 border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '0.6s'
              }}
            >
              {/* Card neutral shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: '2.2s' }}
              />

              <CardContent className="p-6 relative z-10">
                <NeutralSkeleton className="h-6 w-40 mb-6 rounded" delay={0.8} />

                {/* Main Screenshot */}
                <div className="mb-4">
                  <GameImageSkeleton delay={1.0} />
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-3">
                  {thumbIds.map((id, index) => (
                    <div key={id} className="aspect-video">
                      <GameImageSkeleton delay={1.2 + (index * 0.1)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Information */}
            <Card
              className="bg-card/50 border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '0.8s'
              }}
            >
              {/* Card neutral shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: '2.6s' }}
              />

              <CardContent className="p-6 relative z-10">
                <NeutralSkeleton className="h-6 w-48 mb-6 rounded" delay={1.0} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {infoIds.map((id, index) => (
                    <div key={id} className="flex justify-between">
                      <NeutralSkeleton
                        className="h-4 w-24 rounded"
                        delay={1.2 + (index * 0.1)}
                      />
                      <NeutralSkeleton
                        className="h-4 w-32 rounded"
                        delay={1.4 + (index * 0.1)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card
              className="bg-card/50 border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '1.0s'
              }}
            >
              {/* Card neutral shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: '3.0s' }}
              />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <NeutralSkeleton className="h-6 w-32 rounded" delay={1.2} />
                  <NeutralSkeleton className="h-10 w-28 rounded-md" delay={1.4} />
                </div>

                {/* Review Items */}
                <div className="space-y-6">
                  {reviewIds.map((id, index) => (
                    <div key={id} className="border-b border-gray-200/50 dark:border-gray-700/50 pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <NeutralSkeleton
                          className="w-10 h-10 rounded-full flex-shrink-0"
                          delay={1.6 + (index * 0.2)}
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-4">
                            <NeutralSkeleton
                              className="h-4 w-24 rounded"
                              delay={1.8 + (index * 0.2)}
                            />
                            <NeutralSkeleton
                              className="h-4 w-20 rounded"
                              delay={2.0 + (index * 0.2)}
                            />
                          </div>
                          <div className="space-y-2">
                            <NeutralSkeleton
                              className="h-4 w-full rounded"
                              delay={2.2 + (index * 0.2)}
                            />
                            <NeutralSkeleton
                              className="h-4 w-3/4 rounded"
                              delay={2.4 + (index * 0.2)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <Card
              className="bg-card/50 border-gray-200/50 dark:border-gray-700/50 sticky top-8 relative overflow-hidden"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '0.3s'
              }}
            >
              {/* Card neutral shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: '1.6s' }}
              />

              <CardContent className="p-6 relative z-10">
                {/* Game Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-200/60 to-gray-300/60 dark:from-gray-800/60 dark:to-gray-900/60 relative overflow-hidden rounded-2xl">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 dark:via-gray-600/40 to-transparent -skew-x-12 animate-shimmer opacity-80"
                      style={{ animationDelay: '0.5s' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-300/60 dark:bg-gray-700/60 rounded-lg border border-gray-400/30 dark:border-gray-600/30" />
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <NeutralSkeleton className="h-12 w-full mb-4 rounded-md" delay={0.7} />

                {/* File Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <NeutralSkeleton className="h-4 w-16 rounded" delay={0.9} />
                    <NeutralSkeleton className="h-4 w-20 rounded" delay={1.1} />
                  </div>
                  <div className="flex justify-between">
                    <NeutralSkeleton className="h-4 w-20 rounded" delay={1.3} />
                    <NeutralSkeleton className="h-4 w-24 rounded" delay={1.5} />
                  </div>
                  <div className="flex justify-between">
                    <NeutralSkeleton className="h-4 w-18 rounded" delay={1.7} />
                    <NeutralSkeleton className="h-4 w-16 rounded" delay={1.9} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Games */}
            <Card
              className="bg-card/50 border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
              style={{
                animation: 'fadeInUp 0.8s ease-out both',
                animationDelay: '0.5s'
              }}
            >
              {/* Card neutral shimmer background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/5 dark:via-gray-600/5 to-transparent -skew-x-12 animate-shimmer"
                style={{ animationDelay: '2.0s' }}
              />

              <CardContent className="p-6 relative z-10">
                <NeutralSkeleton className="h-6 w-32 mb-6 rounded" delay={0.8} />
                <div className="space-y-4">
                  {relatedIds.map((id, index) => (
                    <div key={id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-200/60 to-gray-300/60 dark:from-gray-800/60 dark:to-gray-900/60 relative overflow-hidden rounded-lg flex-shrink-0">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 dark:via-gray-600/40 to-transparent -skew-x-12 animate-shimmer opacity-80"
                          style={{ animationDelay: `${1.0 + (index * 0.2)}s` }}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <NeutralSkeleton
                          className="h-4 w-full rounded"
                          delay={1.2 + (index * 0.2)}
                        />
                        <NeutralSkeleton
                          className="h-3 w-2/3 rounded"
                          delay={1.4 + (index * 0.2)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
