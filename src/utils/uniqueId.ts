/**
 * Utility functions for generating unique IDs for React keys
 * to replace array indices and avoid linting warnings
 */

/**
 * Generates a unique identifier using crypto.getRandomValues() for better performance
 * and true uniqueness compared to Math.random()
 */
export const generateUniqueId = (prefix = ''): string => {
  // Use crypto.getRandomValues for better randomness and performance
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  const id = `${array[0]}-${array[1]}`;
  return prefix ? `${prefix}-${id}` : id;
};

/**
 * Generates a unique key for skeleton items by combining timestamp and random values
 * This ensures uniqueness even when called rapidly in succession
 */
export const generateSkeletonKey = (prefix = 'skeleton'): string => {
  const timestamp = Date.now();
  const random = generateUniqueId();
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Creates an array of unique keys for skeleton components
 * @param count Number of keys to generate
 * @param prefix Optional prefix for the keys
 * @returns Array of unique key strings
 */
export const generateSkeletonKeys = (count: number, prefix = 'skeleton'): string[] => {
  return Array.from({ length: count }, () => generateSkeletonKey(prefix));
};

/**
 * Creates a memoized unique ID generator that returns the same ID for the same index
 * within a single component render cycle. Useful for skeleton loaders.
 */
export function createUniqueIdGenerator(prefix = '') {
  const cache = new Map<number, string>();

  return (index: number): string => {
    if (!cache.has(index)) {
      cache.set(index, generateUniqueId(`${prefix}-${index}`));
    }
    const cachedId = cache.get(index);
    return cachedId || generateUniqueId(`${prefix}-${index}`);
  };
}
