import { generateUniqueId, generateSkeletonKey, generateSkeletonKeys } from './uniqueId';

describe('uniqueId utilities', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique identifier', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    it('should generate IDs in the expected format', () => {
      const id = generateUniqueId();

      // Should be in format: number-number
      expect(id).toMatch(/^\d+-\d+$/);
    });
  });

  describe('generateSkeletonKey', () => {
    it('should generate a skeleton key with default prefix', () => {
      const key = generateSkeletonKey();

      expect(key).toBeDefined();
      expect(key).toMatch(/^skeleton-\d+-\d+-\d+$/);
    });

    it('should generate a skeleton key with custom prefix', () => {
      const key = generateSkeletonKey('test');

      expect(key).toBeDefined();
      expect(key).toMatch(/^test-\d+-\d+-\d+$/);
    });

    it('should generate unique keys', () => {
      const key1 = generateSkeletonKey('test');
      const key2 = generateSkeletonKey('test');

      expect(key1).not.toBe(key2);
    });
  });

  describe('generateSkeletonKeys', () => {
    it('should generate an array of unique skeleton keys', () => {
      const keys = generateSkeletonKeys(5);

      expect(keys).toHaveLength(5);
      expect(keys.every(key => typeof key === 'string')).toBe(true);

      // Check that all keys are unique
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(5);
    });

    it('should generate keys with custom prefix', () => {
      const keys = generateSkeletonKeys(3, 'card');

      expect(keys).toHaveLength(3);
      expect(keys.every(key => key.startsWith('card-'))).toBe(true);
    });

    it('should handle zero count', () => {
      const keys = generateSkeletonKeys(0);

      expect(keys).toHaveLength(0);
      expect(Array.isArray(keys)).toBe(true);
    });
  });
});
