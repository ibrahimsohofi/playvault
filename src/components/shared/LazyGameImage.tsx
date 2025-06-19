import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Enhanced Skeleton component with shimmer effect for images
function ImageSkeleton({
  className,
  delay = 0,
  aspectRatio = 'aspect-video'
}: {
  className?: string;
  delay?: number;
  aspectRatio?: string;
}) {
  return (
    <div className={cn(`${aspectRatio} bg-gradient-to-br from-gray-800/30 to-gray-900/50 relative overflow-hidden rounded-lg`, className)}>
      {/* Primary shimmer wave */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 animate-shimmer opacity-80"
        style={{ animationDelay: `${delay}s` }}
      />

      {/* Secondary shimmer wave with cyan theme accent */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f7ff]/8 to-transparent -skew-x-12 animate-shimmer"
        style={{ animationDelay: `${delay + 0.6}s` }}
      />

      {/* Game icon placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-gray-700/40 rounded-lg border border-[#00f7ff]/20 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-2 left-2">
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-[#00f7ff]/60 rounded-full animate-pulse" style={{ animationDelay: `${delay}s` }} />
          <div className="w-1 h-1 bg-[#00f7ff]/60 rounded-full animate-pulse" style={{ animationDelay: `${delay + 0.2}s` }} />
          <div className="w-1 h-1 bg-[#00f7ff]/60 rounded-full animate-pulse" style={{ animationDelay: `${delay + 0.4}s` }} />
        </div>
      </div>
    </div>
  );
}

interface LazyGameImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  skeletonDelay?: number;
}

export function LazyGameImage({
  src,
  alt,
  className,
  aspectRatio = 'aspect-video',
  fallbackSrc,
  onLoad,
  onError,
  priority = false,
  skeletonDelay = 0
}: LazyGameImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Handle image loading
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();

    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);

      if (fallbackSrc && src !== fallbackSrc) {
        // Try fallback image
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setIsLoading(false);
          setHasError(false);
          if (imgRef.current) {
            imgRef.current.src = fallbackSrc;
          }
        };
        fallbackImg.onerror = () => {
          setIsLoading(false);
          setHasError(true);
          onError?.();
        };
        fallbackImg.src = fallbackSrc;
      } else {
        setIsLoading(false);
        onError?.();
      }
    };

    img.src = src;
  }, [isInView, src, fallbackSrc, onLoad, onError]);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      {(isLoading || !isInView) && (
        <ImageSkeleton
          className="absolute inset-0"
          delay={skeletonDelay}
          aspectRatio={aspectRatio}
        />
      )}

      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? (fallbackSrc || '/images/games/placeholder.jpg') : src}
          alt={alt}
          className={cn(
            aspectRatio,
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            onError?.();
          }}
        />
      )}

      {hasError && !fallbackSrc && (
        <div className={cn(
          aspectRatio,
          'absolute inset-0 bg-gray-800/50 flex items-center justify-center text-gray-400'
        )}>
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}
