import { useState } from 'react';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';

interface GameImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function GameImage({ src, alt, className = '', width = 300, height = 200 }: GameImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    setIsRetrying(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsRetrying(false);
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setIsRetrying(true);
      setHasError(false);
      setIsLoaded(false);
      setRetryCount(prev => prev + 1);

      // Force image reload by adding timestamp
      const img = new Image();
      img.onload = handleLoad;
      img.onerror = handleError;
      img.src = `${src}?retry=${retryCount + 1}&t=${Date.now()}`;
    }
  };

  if (hasError && !isRetrying) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg ${className}`}>
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
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <img
        src={retryCount > 0 ? `${src}?retry=${retryCount}&t=${Date.now()}` : src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        loading="lazy"
      />

      {/* Enhanced skeleton loader */}
      {(!isLoaded || isRetrying) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            {/* Pulsing game controller icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse" />
              <div className="absolute inset-0 bg-gray-400 rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Loading text with dots animation */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">Loading</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-20 h-1 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" />
            </div>

            {isRetrying && (
              <p className="text-xs text-blue-600 animate-pulse">Retrying...</p>
            )}
          </div>
        </div>
      )}

      {/* Subtle loading shimmer effect */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
      )}
    </div>
  );
}
