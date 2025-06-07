import { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useLazyLoading } from '@/hooks/useLazyLoading';

interface LazyGameImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
  webpSrc?: string; // WebP format for better compression
  avifSrc?: string; // AVIF format for even better compression
  srcSet?: string; // Responsive image set
  sizes?: string; // Responsive image sizes
}

// Check if browser supports WebP
const supportsWebP = (() => {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
})();

// Check if browser supports AVIF
const supportsAVIF = (() => {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('image/avif') === 5;
})();

export function LazyGameImage({
  src,
  alt,
  className = '',
  width = 300,
  height = 200,
  placeholderSrc,
  webpSrc,
  avifSrc,
  srcSet,
  sizes
}: LazyGameImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<'avif' | 'webp' | 'original'>('original');

  const { ref, shouldLoad } = useLazyLoading<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Determine the best image format to use
  useEffect(() => {
    if (supportsAVIF && avifSrc) {
      setCurrentFormat('avif');
    } else if (supportsWebP && webpSrc) {
      setCurrentFormat('webp');
    } else {
      setCurrentFormat('original');
    }
  }, [avifSrc, webpSrc]);

  const getCurrentSrc = () => {
    const timestamp = retryCount > 0 ? `?retry=${retryCount}&t=${Date.now()}` : '';

    switch (currentFormat) {
      case 'avif':
        return `${avifSrc}${timestamp}`;
      case 'webp':
        return `${webpSrc}${timestamp}`;
      default:
        return `${src}${timestamp}`;
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    setIsRetrying(false);
  };

  const handleError = () => {
    // Try fallback formats before giving up
    if (currentFormat === 'avif' && webpSrc) {
      setCurrentFormat('webp');
      setHasError(false);
      return;
    }
    if (currentFormat === 'webp') {
      setCurrentFormat('original');
      setHasError(false);
      return;
    }

    setHasError(true);
    setIsRetrying(false);
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setIsRetrying(true);
      setHasError(false);
      setIsLoaded(false);
      setRetryCount(prev => prev + 1);
      // Reset to best format on retry
      if (supportsAVIF && avifSrc) {
        setCurrentFormat('avif');
      } else if (supportsWebP && webpSrc) {
        setCurrentFormat('webp');
      }
    }
  };

  if (hasError && !isRetrying && shouldLoad) {
    return (
      <div
        ref={ref}
        className={`w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-xs text-gray-500 text-center mb-2">Failed to load image</p>
        {retryCount < 3 && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry ({3 - retryCount} left)
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width, height }}
    >
      {/* Modern shimmer skeleton while not in view */}
      {!shouldLoad && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/30 dark:from-gray-800/40 dark:to-gray-900/60">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-700/30 rounded-lg animate-pulse" />
          </div>
        </div>
      )}

      {/* Low-quality placeholder image */}
      {shouldLoad && placeholderSrc && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-50"
          loading="lazy"
        />
      )}

      {/* Main image with modern formats support */}
      {shouldLoad && (
        <picture>
          {avifSrc && supportsAVIF && (
            <source srcSet={avifSrc} type="image/avif" />
          )}
          {webpSrc && supportsWebP && (
            <source srcSet={webpSrc} type="image/webp" />
          )}
          <img
            src={getCurrentSrc()}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            style={{
              imageRendering: 'crisp-edges',
              // Enable hardware acceleration
              transform: 'translateZ(0)',
              willChange: isLoaded ? 'auto' : 'opacity, transform'
            }}
          />
        </picture>
      )}

      {/* Clean shimmer skeleton while loading */}
      {shouldLoad && (!isLoaded || isRetrying) && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/30 dark:from-gray-800/40 dark:to-gray-900/60">
          {/* Primary shimmer wave */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />

          {/* Secondary shimmer wave with delay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f7ff]/10 to-transparent -skew-x-12 animate-shimmer"
            style={{ animationDelay: '0.5s' }}
          />

          {/* Subtle pulsing center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-700/20 rounded-lg animate-pulse border border-gray-600/10" />
          </div>
        </div>
      )}
    </div>
  );
}
