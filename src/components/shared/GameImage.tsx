import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

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

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse bg-gray-300 rounded-full w-6 h-6"></div>
        </div>
      )}
    </div>
  );
}
