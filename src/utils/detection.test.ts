import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectAdBlocker, detectVPN } from './detection';

// Mock fetch for VPN detection tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Detection Utilities', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock document methods
    document.createElement = vi.fn().mockImplementation((tag) => {
      const element: any = {
        style: {},
        innerHTML: '',
        appendChild: vi.fn(),
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
    
    it('should return true when ad scripts are blocked', () => {
      // Setup: Script error (adblock active)
      const mockScript = {
        src: '',
        async: false,
        id: '',
        onerror: vi.fn(),
        remove: vi.fn()
      };
      document.createElement = vi.fn().mockImplementation((tag) => {
        if (tag === 'script') {
          // Trigger onerror immediately
          setTimeout(() => {
            mockScript.onerror(new Event('error'));
          }, 0);
          return mockScript;
        }
        return {
          style: {},
          innerHTML: '',
          querySelector: vi.fn().mockReturnValue({}),
          remove: vi.fn()
        };
      });
      
      const result = detectAdBlocker();
      vi.runAllTimers(); // Run the setTimeout
      
      expect(result).toBe(true);
    });
  });
  
  describe('detectVPN', () => {
    it('should use the VPN detection service when available', async () => {
      // Mock successful API response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ isVPN: false })
      } as Response);
      
      const result = await detectVPN();
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://vpn-detection-api.playvault.com/check',
        expect.any(Object)
      );
      expect(result).toBe(false);
    });
    
    it('should fall back to local checks when API fails', async () => {
      // Mock failed API response
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('API error'));
      
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
      
      // Mock WebRTC check (no mismatch)
      let onIceCandidate: ((event: { candidate: any }) => void) | undefined;
      const mockRTCPeerConnection = {
        createDataChannel: vi.fn().mockReturnValue({}),
        onicecandidate: vi.fn().mockImplementation((cb: (event: { candidate: any }) => void) => {
          onIceCandidate = cb;
        }),
        createOffer: vi.fn().mockResolvedValue({}),
        setLocalDescription: vi.fn(),
        close: vi.fn()
      };
      
      // Mock the RTCPeerConnection constructor and static methods
      global.RTCPeerConnection = vi.fn().mockImplementation(() => mockRTCPeerConnection) as any;
      vi.spyOn(RTCPeerConnection, 'generateCertificate' as any).mockResolvedValue({});
      
      // Start the VPN detection
      const resultPromise = detectVPN();
      
      // Simulate the WebRTC flow
      await Promise.resolve(); // Allow the promise chain to start
      
      // Trigger the ice candidate event with null to signal the end of gathering
      if (onIceCandidate) {
        onIceCandidate({ candidate: null });
      }
      
      // Wait for the result
      const result = await resultPromise;
      expect(result).toBe(false);
    });
  });
});
