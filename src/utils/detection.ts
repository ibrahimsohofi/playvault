// Helper function to check WebRTC leaks
async function checkWebRTCLeak(): Promise<boolean> {
  try {
    const pc = new RTCPeerConnection();
    const dataChannel = pc.createDataChannel("");
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Check if we have any private IPs in the ICE candidates
    const sdp = pc.localDescription?.sdp || "";
    const hasPrivateIP = sdp.includes("192.168.") ||
                        sdp.includes("10.") ||
                        sdp.includes("172.16.") ||
                        sdp.includes("172.17.") ||
                        sdp.includes("172.18.") ||
                        sdp.includes("172.19.") ||
                        sdp.includes("172.20.") ||
                        sdp.includes("172.21.") ||
                        sdp.includes("172.22.") ||
                        sdp.includes("172.23.") ||
                        sdp.includes("172.24.") ||
                        sdp.includes("172.25.") ||
                        sdp.includes("172.26.") ||
                        sdp.includes("172.27.") ||
                        sdp.includes("172.28.") ||
                        sdp.includes("172.29.") ||
                        sdp.includes("172.30.") ||
                        sdp.includes("172.31.");

    pc.close();
    return hasPrivateIP;
  } catch (err) {
    console.error("Error checking WebRTC leak:", err);
    return false;
  }
}

// Check for common VPN extensions
function checkVPNExtensions(): boolean {
  const extensions = [
    "chrome-extension://jpnepfccgohjnfjfkmjfdljfkjfmkjf",
    "chrome-extension://jpnepfccgohjnfjfkmjfdljfkjfmkjf",
    "chrome-extension://jpnepfccgohjnfjfkmjfdljfkjfmkjf",
    "chrome-extension://jpnepfccgohjnfjfkmjfdljfkjfmkjf",
    "chrome-extension://jpnepfccgohjnfjfkmjfdljfkjfmkjf",
  ];

  return extensions.some(ext => {
    try {
      const img = new Image();
      img.src = `${ext}/icon.png`;
      return img.complete;
    } catch {
      return false;
    }
  });
}

// Main VPN detection function
export async function detectVPN(): Promise<{ isVPN: boolean; confidence: number; reason?: string }> {
  try {
    console.log("Starting VPN detection...");
    const results: { method: string; detected: boolean; reason?: string }[] = [];

    // Check WebRTC leaks
    const hasWebRTCLeak = await checkWebRTCLeak();
    results.push({
      method: "WebRTC",
      detected: hasWebRTCLeak,
      reason: hasWebRTCLeak ? "WebRTC leak detected" : undefined
    });

    // Check for VPN extensions
    const hasVPNExtension = checkVPNExtensions();
    results.push({
      method: "Extensions",
      detected: hasVPNExtension,
      reason: hasVPNExtension ? "VPN extension detected" : undefined
    });

    // Calculate confidence based on number of detection methods
    const detectedMethods = results.filter(r => r.detected);
    const confidence = detectedMethods.length / results.length;
    const isVPN = confidence > 0.5;

    // Get the first detection reason if any
    const reason = detectedMethods[0]?.reason;

    console.log("VPN detection results:", {
      results,
      confidence,
      isVPN,
      reason
    });

    return {
      isVPN,
      confidence,
      reason
    };
  } catch (err) {
    console.error("Error detecting VPN:", err);
    return {
      isVPN: false,
      confidence: 0,
      reason: "Error during detection"
    };
  }
}

// Fallback local VPN checks
async function performLocalVPNChecks(): Promise<boolean> {
  try {
    const responseTime = await measureResponseTime();
    if (responseTime > 300) return true;

    const webRTCInfo = await getWebRTCIPAddresses();
    if (webRTCInfo.mismatch) return true;

    if (detectVPNExtensions()) return true;

    return false;
  } catch (error) {
    console.error('Error in local VPN checks:', error);
    return false;
  }
}

// Check WebRTC for multiple IPs
async function getWebRTCIPAddresses(): Promise<{ mismatch: boolean; addresses: string[] }> {
  return new Promise((resolve) => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      const addresses: string[] = [];

      pc.createDataChannel('');

      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          pc.close();
          const uniqueAddresses = [...new Set(addresses)];
          resolve({
            mismatch: uniqueAddresses.length > 1,
            addresses: uniqueAddresses
          });
        } else if (e.candidate.candidate) {
          const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate);
          if (match?.[1]) addresses.push(match[1]);
        }
      };

      pc.createOffer().then(offer => pc.setLocalDescription(offer));

      setTimeout(() => {
        pc.close();
        resolve({ mismatch: false, addresses });
      }, 5000);
    } catch (error) {
      console.error('WebRTC detection error:', error);
      resolve({ mismatch: false, addresses: [] });
    }
  });
}

// Measure average response time to detect latency
const measureResponseTime = async (): Promise<number> => {
  const endpoints = [
    'https://www.google.com',
    'https://www.cloudflare.com',
    'https://www.amazon.com'
  ];

  const times: number[] = [];

  for (const endpoint of endpoints) {
    const start = Date.now();
    try {
      await fetch(endpoint, { method: 'HEAD', cache: 'no-store' });
      times.push(Date.now() - start);
    } catch (error) {
      console.error(`Error measuring response time to ${endpoint}:`, error);
    }
  }

  return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
};

// Detect common VPN browser extensions
const detectVPNExtensions = (): boolean => {
  const selectors = [
    '[class*="vpn"]',
    '[id*="vpn"]',
    '[class*="proxy"]',
    '[id*="proxy"]',
    '[class*="nord"]',
    '[id*="nord"]',
    '[class*="express"]',
    '[id*="express"]'
  ];

  return selectors.some(selector => document.querySelector(selector));
};

// AdBlocker detection
export const detectAdBlocker = async (): Promise<boolean> => {
  console.log('Starting ad blocker detection...');

  // Check for bypass flag (for debugging)
  if (localStorage.getItem('bypass_adblocker') === 'true') {
    console.log('AdBlocker detection bypassed for debugging');
    return false;
  }

  // Method 1: Test ad element creation and modification
  const testAdElement = () => {
    const testDiv = document.createElement('div');
    testDiv.innerHTML = '&nbsp;';
    testDiv.className = 'adsbox ad-unit advertisement';
    testDiv.style.cssText = `
      position: absolute !important;
      left: -9999px !important;
      top: -9999px !important;
      width: 1px !important;
      height: 1px !important;
      visibility: hidden !important;
      display: block !important;
    `;
    document.body.appendChild(testDiv);

    // Wait a short moment for ad blockers to potentially act
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Check if element was modified or removed
        const isBlocked = testDiv.offsetHeight === 0 ||
                         testDiv.offsetWidth === 0 ||
                         testDiv.offsetParent === null ||
                         testDiv.style.display === 'none' ||
                         testDiv.style.visibility === 'hidden' ||
                         !document.body.contains(testDiv);

        // Cleanup
        try {
          if (testDiv.parentNode) {
            testDiv.parentNode.removeChild(testDiv);
          }
        } catch (e) {
          console.warn('Failed to remove test element:', e);
        }

        resolve(isBlocked);
      }, 100); // Short delay to let ad blockers process
    });
  };

  // Method 2: Test ad script loading
  const testAdScript = async () => {
    try {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;

      const loadPromise = new Promise<boolean>((resolve) => {
        script.onload = () => {
          console.log('Ad script loaded successfully');
          resolve(false); // Script loaded successfully
        };
        script.onerror = () => {
          console.log('Ad script failed to load');
          resolve(true); // Script failed to load
        };
        // Timeout after 2 seconds
        setTimeout(() => {
          console.log('Ad script load timed out');
          resolve(true);
        }, 2000);
      });

      document.head.appendChild(script);
      const isBlocked = await loadPromise;

      // Cleanup
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        console.warn('Failed to remove test script:', e);
      }

      return isBlocked;
    } catch (e) {
      console.warn('Ad script test failed:', e);
      return false;
    }
  };

  // Method 3: Check for common ad blocker extensions
  const checkAdBlockerExtensions = () => {
    // Only check for actual ad blocker extensions, not just any selectors
    const extensionKeys = [
      'adblockDetect',
      'blockAdBlock',
      'fuckAdBlock',
      'abp',
      'uBlock',
      'adblock',
      'adBlocker',
      'adblockEnabled'
    ];

    // Check if any ad blocker extension is present
    const hasExtension = extensionKeys.some(key => {
      const value = (window as Record<string, unknown>)[key];
      return value !== undefined && value !== null;
    });

    return hasExtension;
  };

  try {
    // Run all detection methods
    const [elementBlocked, scriptBlocked, hasExtension] = await Promise.all([
      testAdElement(),
      testAdScript(),
      Promise.resolve(checkAdBlockerExtensions())
    ]);

    // Log results for debugging
    console.log('Ad blocker detection results:', {
      elementBlocked,
      scriptBlocked,
      hasExtension
    });

    // Require at least two positive results to confirm ad blocker
    // This reduces false positives
    const positiveResults = [elementBlocked, scriptBlocked, hasExtension].filter(Boolean).length;
    const isAdBlockerDetected = positiveResults >= 2;

    console.log('Final ad blocker detection result:', isAdBlockerDetected, 'with', positiveResults, 'positive results');

    return isAdBlockerDetected;
  } catch (error) {
    console.error('Error during ad blocker detection:', error);
    // If detection fails, assume no ad blocker to avoid false positives
    return false;
  }
};

// Note: Custom hooks moved to separate file to avoid React import issues in utility files
// See src/hooks/useDetection.ts for useVPNDetection and useAdBlockerDetection hooks
