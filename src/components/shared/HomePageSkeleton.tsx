import { Skeleton } from '@/components/ui/skeleton';
import { GameCardSkeleton } from './GameCardSkeleton';
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

export function HomePageSkeleton() {
  // Generate unique keys for all skeleton elements
  const socialKeys = generateSkeletonKeys(4, 'social');
  const filterKeys = generateSkeletonKeys(5, 'filter');
  const gameKeys = generateSkeletonKeys(6, 'game');
  const stepKeys = generateSkeletonKeys(3, 'step');
  const testimonialKeys = generateSkeletonKeys(3, 'testimonial');
  const faqKeys = generateSkeletonKeys(5, 'faq');

  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton - matches actual flex layout */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background effects skeleton */}
        <div className="absolute inset-0">
          <ShimmerSkeleton
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
            delay={0}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left content - matches md:w-2/3 */}
            <div className="md:w-2/3 text-center md:text-left">
              {/* Hero Title Skeleton */}
              <div className="mb-6 space-y-3">
                <ShimmerSkeleton
                  className="h-12 md:h-16 w-full rounded-lg"
                  delay={0}
                />
                <ShimmerSkeleton
                  className="h-12 md:h-16 w-3/4 rounded-lg"
                  delay={0.2}
                />
              </div>

              {/* Hero Description Skeleton */}
              <div className="mb-8 space-y-3">
                <ShimmerSkeleton
                  className="h-6 w-full rounded"
                  delay={0.4}
                />
                <ShimmerSkeleton
                  className="h-6 w-4/5 rounded"
                  delay={0.6}
                />
              </div>

              {/* Social Share Skeleton */}
              <div className="mb-8 mt-4">
                <div className="flex justify-center md:justify-start gap-2">
                  {socialKeys.map((key, index) => (
                    <ShimmerSkeleton
                      key={key}
                      className="h-8 w-8 rounded"
                      delay={0.8 + (index * 0.1)}
                    />
                  ))}
                </div>
              </div>

              {/* Hero Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-10">
                <ShimmerSkeleton
                  className="h-14 w-48 rounded-md"
                  delay={1.0}
                />
                <ShimmerSkeleton
                  className="h-14 w-48 rounded-md"
                  delay={1.2}
                />
              </div>

              {/* Bottom text with indicators */}
              <div className="flex justify-center md:justify-start items-center gap-2">
                <ShimmerSkeleton
                  className="h-2 w-2 rounded-full"
                  delay={1.4}
                />
                <ShimmerSkeleton
                  className="h-4 w-64 rounded"
                  delay={1.6}
                />
                <ShimmerSkeleton
                  className="h-2 w-2 rounded-full"
                  delay={1.8}
                />
              </div>
            </div>

            {/* Right side gamepad skeleton - matches md:w-1/3 */}
            <div className="hidden md:block md:w-1/3 mt-12 md:mt-0">
              <div className="relative flex justify-center">
                {/* Glow effect skeleton */}
                <ShimmerSkeleton
                  className="absolute inset-0 w-64 h-64 rounded-full opacity-10"
                  delay={2.0}
                />
                {/* Gamepad icon skeleton */}
                <ShimmerSkeleton
                  className="w-32 h-32 rounded-lg relative z-10"
                  delay={2.2}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Library Section Skeleton */}
      <section className="py-20 relative">
        <div className="container-custom">
          {/* Section Header Skeleton */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <ShimmerSkeleton
              className="h-12 w-80 mx-auto mb-6 rounded-lg"
              delay={0.2}
            />
            <ShimmerSkeleton
              className="h-6 w-96 mx-auto rounded"
              delay={0.4}
            />
          </div>

          {/* Search and Filter Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
            <ShimmerSkeleton
              className="h-12 w-full md:w-1/2 rounded-md"
              delay={0.6}
            />
            <div className="hidden md:flex gap-2">
              {filterKeys.map((key, index) => (
                <ShimmerSkeleton
                  key={key}
                  className="h-8 w-20 rounded-full"
                  delay={0.8 + (index * 0.1)}
                />
              ))}
            </div>
          </div>

          {/* Game Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {gameKeys.map((key, index) => (
              <div
                key={key}
                style={{
                  animationDelay: `${1.0 + (index * 0.15)}s`,
                  animation: 'fadeInUp 0.8s ease-out both'
                }}
              >
                <GameCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section Skeleton */}
      <section className="py-20 bg-card/30">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <ShimmerSkeleton
              className="h-12 w-64 mx-auto mb-6 rounded-lg"
              delay={0.2}
            />
            <ShimmerSkeleton
              className="h-6 w-80 mx-auto rounded"
              delay={0.4}
            />
          </div>

          {/* Steps Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stepKeys.map((key, index) => (
              <div
                key={key}
                className="text-center"
                style={{
                  animationDelay: `${0.6 + (index * 0.2)}s`,
                  animation: 'fadeInUp 0.8s ease-out both'
                }}
              >
                <ShimmerSkeleton
                  className="h-16 w-16 mx-auto mb-4 rounded-full"
                  delay={0.8 + (index * 0.2)}
                />
                <ShimmerSkeleton
                  className="h-6 w-32 mx-auto mb-2 rounded"
                  delay={1.0 + (index * 0.2)}
                />
                <ShimmerSkeleton
                  className="h-4 w-40 mx-auto rounded"
                  delay={1.2 + (index * 0.2)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <ShimmerSkeleton
              className="h-12 w-48 mx-auto mb-6 rounded-lg"
              delay={0.2}
            />
            <ShimmerSkeleton
              className="h-6 w-72 mx-auto rounded"
              delay={0.4}
            />
          </div>

          {/* Testimonials Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialKeys.map((key, index) => (
              <div
                key={key}
                className="bg-card/70 p-6 rounded-lg border border-[#00f7ff]/20 relative overflow-hidden"
                style={{
                  animationDelay: `${0.6 + (index * 0.2)}s`,
                  animation: 'fadeInUp 0.8s ease-out both'
                }}
              >
                {/* Card shimmer background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"
                     style={{ animationDelay: `${1.5 + (index * 0.3)}s` }} />

                <div className="flex items-center mb-4 relative z-10">
                  <ShimmerSkeleton
                    className="h-12 w-12 rounded-full"
                    delay={0.8 + (index * 0.2)}
                  />
                  <div className="ml-4">
                    <ShimmerSkeleton
                      className="h-4 w-24 mb-2 rounded"
                      delay={1.0 + (index * 0.2)}
                    />
                    <ShimmerSkeleton
                      className="h-3 w-16 rounded"
                      delay={1.2 + (index * 0.2)}
                    />
                  </div>
                </div>
                <div className="space-y-2 relative z-10">
                  <ShimmerSkeleton
                    className="h-4 w-full rounded"
                    delay={1.4 + (index * 0.2)}
                  />
                  <ShimmerSkeleton
                    className="h-4 w-5/6 rounded"
                    delay={1.6 + (index * 0.2)}
                  />
                  <ShimmerSkeleton
                    className="h-4 w-4/6 rounded"
                    delay={1.8 + (index * 0.2)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="py-20 bg-card/30">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <ShimmerSkeleton
              className="h-12 w-72 mx-auto mb-6 rounded-lg"
              delay={0.2}
            />
            <ShimmerSkeleton
              className="h-6 w-96 mx-auto rounded"
              delay={0.4}
            />
          </div>

          {/* FAQ Items Skeleton */}
          <div className="max-w-3xl mx-auto space-y-4">
            {faqKeys.map((key, index) => (
              <div
                key={key}
                className="bg-card/70 border border-[#00f7ff]/20 rounded-lg p-6 relative overflow-hidden"
                style={{
                  animationDelay: `${0.6 + (index * 0.1)}s`,
                  animation: 'fadeInUp 0.8s ease-out both'
                }}
              >
                {/* Card shimmer background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"
                     style={{ animationDelay: `${1.2 + (index * 0.2)}s` }} />

                <div className="relative z-10">
                  <ShimmerSkeleton
                    className="h-6 w-4/5 mb-3 rounded"
                    delay={0.8 + (index * 0.1)}
                  />
                  <ShimmerSkeleton
                    className="h-4 w-full mb-2 rounded"
                    delay={1.0 + (index * 0.1)}
                  />
                  <ShimmerSkeleton
                    className="h-4 w-3/4 rounded"
                    delay={1.2 + (index * 0.1)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
