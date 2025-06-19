import { LazyGameImage } from './LazyGameImage';

interface GameImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  skeletonDelay?: number;
}

export function GameImage({
  src,
  alt,
  className = '',
  width,
  height,
  aspectRatio = 'aspect-video',
  fallbackSrc,
  onLoad,
  onError,
  priority = false,
  skeletonDelay = 0
}: GameImageProps) {
  // For backward compatibility with width/height props
  const containerStyle = width && height ? { width: `${width}px`, height: `${height}px` } : {};

  return (
    <LazyGameImage
      src={src}
      alt={alt}
      className={className}
      aspectRatio={aspectRatio}
      fallbackSrc={fallbackSrc}
      onLoad={onLoad}
      onError={onError}
      priority={priority}
      skeletonDelay={skeletonDelay}
      {...(Object.keys(containerStyle).length > 0 ? { style: containerStyle } : {})}
    />
  );
}
