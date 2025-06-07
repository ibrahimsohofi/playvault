import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectAdBlocker, detectVPN } from './detection';

// Mock fetch for VPN detection tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Detection Utilities', () => {
  beforeEach(() => {
    // Clear all mocks instead of resetAllMocks
    vi.clearAllMocks();

    // Mock document methods
    document.createElement = vi.fn().mockImplementation((tag) => {
      const element: Partial<HTMLElement & HTMLScriptElement & HTMLIFrameElement> = {
        style: {} as CSSStyleDeclaration,
        innerHTML: '',
        appendChild: vi.fn() as <T extends Node>(node: T) => T,
        querySelector: vi.fn().mockReturnValue({}), // Default: elements exist (no adblock)
        querySelectorAll: vi.fn().mockReturnValue([]), // Default: no VPN extensions
        remove: vi.fn(),
        src: '',
        async: false,
        id: '',
        onerror: null,
      };
      return element;
    });

    document.body.appendChild = vi.fn();
    document.head.appendChild = vi.fn();
    document.getElementById = vi.fn().mockReturnValue(null);

    // Mock RTCPeerConnection for WebRTC tests
    const mockRTCPeerConnection = vi.fn() as unknown as typeof RTCPeerConnection & {
      prototype: RTCPeerConnection;
      generateCertificate: (keygenAlgorithm: AlgorithmIdentifier) => Promise<RTCCertificate>;
    };

    mockRTCPeerConnection.prototype = {
      createDataChannel: vi.fn(),
      onicecandidate: null,
      createOffer: vi.fn().mockResolvedValue({}),
      setLocalDescription: vi.fn(),
      close: vi.fn()
    } as unknown as RTCPeerConnection;

    // Add static generateCertificate method to RTCPeerConnection
    mockRTCPeerConnection.generateCertificate = vi.fn().mockResolvedValue({} as RTCCertificate);

    global.RTCPeerConnection = mockRTCPeerConnection;

    // Mock setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('detectAdBlocker', () => {
    it('should return false when no ad blocker is detected', () => {
      // Setup: Elements exist (no adblock)
      document.createElement = vi.fn().mockImplementation(() => ({
        style: {},
        innerHTML: '',
        querySelector: vi.fn().mockReturnValue({}), // Elements exist
        remove: vi.fn()
      }));

      // Mock script loading success (no blocking)
      const mockScript = {
        src: '',
        async: false,
        id: '',
        onerror: null,
        remove: vi.fn()
      };
      document.createElement = vi.fn().mockImplementation((tag) => {
        if (tag === 'script') return mockScript;
        return {
          style: {},
          innerHTML: '',
          querySelector: vi.fn().mockReturnValue({}),
          querySelectorAll: vi.fn().mockReturnValue([]),
          remove: vi.fn()
        };
      });

      expect(detectAdBlocker()).toBe(false);
    });

    it('should return true when ad elements are blocked', () => {
      // Setup: Elements don't exist (adblock active)
      document.createElement = vi.fn().mockImplementation(() => ({
        style: {},
        innerHTML: '',
        querySelector: vi.fn().mockReturnValue(null), // Elements don't exist
        remove: vi.fn()
      }));

      expect(detectAdBlocker()).toBe(true);
    });

    it('should detect ad blocker through script blocking', () => {
      // Setup: Elements exist but extensions are detected
      const testDiv = {
        style: {},
        innerHTML: '',
        querySelector: vi.fn().mockReturnValue({}), // Elements exist, no element-based blocking
        remove: vi.fn()
      };

      // Mock checkAdBlockerExtensions to return true (extension detected)
      document.querySelector = vi.fn()
        .mockReturnValueOnce(null) // First selector check
        .mockReturnValueOnce({});   // Second selector check - extension detected

      document.createElement = vi.fn().mockImplementation((tag) => {
        if (tag === 'div') return testDiv;
        if (tag === 'script') return { src: '', async: false, id: '', onerror: null, remove: vi.fn() };
        return testDiv;
      });

      const result = detectAdBlocker();
      expect(result).toBe(true);
    });
  });

  describe('detectVPN', () => {
    it('should return VPN detection result', async () => {
      // Mock all external API calls to fail, triggering fallback
      vi.mocked(global.fetch).mockRejectedValue(new Error('API not available'));

      // Mock WebRTC to resolve quickly
      const mockConnection = {
        createDataChannel: vi.fn().mockReturnValue({}),
        set onicecandidate(handler: ((event: { candidate: RTCIceCandidate | null }) => void) | null) {
          // Immediately call with null to end gathering
          if (handler) handler({ candidate: null });
        },
        createOffer: vi.fn().mockResolvedValue({}),
        setLocalDescription: vi.fn().mockResolvedValue(undefined),
        close: vi.fn()
      };

      global.RTCPeerConnection = vi.fn().mockImplementation(() => mockConnection) as unknown as typeof RTCPeerConnection;

      const result = await detectVPN();

      expect(result).toEqual(expect.objectContaining({
        isVPN: expect.any(Boolean),
        confidence: expect.any(Number)
      }));
    });

    it('should handle API success', async () => {
      // Mock successful external API calls
      vi.mocked(global.fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ip: '1.2.3.4' })
        } as Response) // Mock ipify response
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ isVPN: false, confidence: 30 })
        } as Response); // Mock VPN detection API

      // Mock WebRTC
      const mockConnection = {
        createDataChannel: vi.fn().mockReturnValue({}),
        set onicecandidate(handler: ((event: { candidate: RTCIceCandidate | null }) => void) | null) {
          if (handler) handler({ candidate: null });
        },
        createOffer: vi.fn().mockResolvedValue({}),
        setLocalDescription: vi.fn().mockResolvedValue(undefined),
        close: vi.fn()
      };

      global.RTCPeerConnection = vi.fn().mockImplementation(() => mockConnection) as unknown as typeof RTCPeerConnection;

      const result = await detectVPN();

      expect(result).toEqual(expect.objectContaining({
        isVPN: false,
        confidence: 30
      }));
    });
  });
});
