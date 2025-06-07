import { useCallback, useEffect, useRef, useState } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyLoading<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = '50px',
}: UseLazyLoadingOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<T>(null);

  const setRef = useCallback((node: T | null) => {
    if (elementRef.current && elementRef.current !== node) {
      // Clean up previous observer if element changes
      setIsIntersecting(false);
      setHasIntersected(false);
    }
    // Use a workaround for the readonly property
    (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If already intersected once, don't observe again
    if (hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);

        // Once intersected, mark as intersected and stop observing
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);

  return {
    ref: setRef,
    isIntersecting,
    hasIntersected,
    shouldLoad: isIntersecting || hasIntersected,
  };
}

export default useLazyLoading;
