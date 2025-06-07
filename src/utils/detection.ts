import { useEffect, useState } from 'react';

// Main VPN detection function using multiple techniques
export const detectVPN = async (): Promise<{ isVPN: boolean; confidence: number; reason?: string }> => {
  const results = {
    isVPN: false,
    confidence: 0,
    reason: ''
  };

  try {
    // Method 1: WebRTC Leak
    const webrtcResults = await checkWebRTCLeak();
    if (webrtcResults.isSuspicious) {
      return {
        isVPN: true,
        confidence: webrtcResults.confidence,
        reason: webrtcResults.reason
      };
    }

    // Method 2: High Response Time
    const responseTime = await measureResponseTime();
    if (responseTime > 500) {
      return {
        isVPN: true,
        confidence: 60,
        reason: 'High network latency detected (common with VPNs)'
      };
    }

    // Method 3: VPN Extensions
    if (detectVPNExtensions()) {
      return {
        isVPN: true,
        confidence: 80,
        reason: 'VPN browser extension detected'
      };
    }

    // Method 4: IP Reputation via external API
    const response = await fetch('https://vpn-detection-api.playvault.com/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.REACT_APP_VPN_API_KEY || ''
      },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        webRTC: true
      })
    });

    if (!response.ok) {
      const fallback = await performLocalVPNChecks();
      return fallback ? {
        isVPN: true,
        confidence: 50,
        reason: 'Fallback checks indicate VPN usage'
      } : results;
    }

    const data = await response.json();
    return {
      isVPN: data.isVPN,
      confidence: data.confidence || 70,
      reason: data.reason || 'Flagged by VPN detection API'
    };
  } catch (error) {
    console.error('Error detecting VPN:', error);
    const fallback = await performLocalVPNChecks();
    return fallback ? {
      isVPN: true,
      confidence: 50,
      reason: 'Error in detection, fallback triggered'
    } : results;
  }
};

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

// Check for WebRTC IP leak
async function checkWebRTCLeak(): Promise<{ isSuspicious: boolean; confidence: number; reason?: string }> {
  try {
    const pc = new RTCPeerConnection({ iceServers: [] });
    const localIPs: string[] = [];

    pc.createDataChannel('');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const candidates = await new Promise<string[]>((resolve) => {
      const ips: string[] = [];
      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          resolve(ips);
          return;
        }
        const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate);
        if (match?.[1]) {
          ips.push(match[1]);
        }
      };
    });

    const response = await fetch('https://api.ipify.org?format=json');
    const { ip: publicIP } = await response.json();

    if (candidates.includes(publicIP)) {
      return {
        isSuspicious: true,
        confidence: 90,
        reason: 'WebRTC leak matches public IP (possible VPN)'
      };
    }

    return { isSuspicious: false, confidence: 0 };
  } catch (error) {
    console.error('WebRTC detection error:', error);
    return { isSuspicious: false, confidence: 0 };
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
export const detectAdBlocker = (): boolean => {
  const testDiv = document.createElement('div');
  testDiv.innerHTML = `
    <div class="adsbox"></div>
    <div class="advertising"></div>
    <div class="banner"></div>
    <div class="ad"></div>
    <div id="carbonads"></div>
    <div class="adsbygoogle"></div>
  `;
  testDiv.style.position = 'absolute';
  testDiv.style.opacity = '0';
  testDiv.style.pointerEvents = 'none';
  document.body.appendChild(testDiv);

  const elementsBlocked = !testDiv.querySelector('.adsbox') ||
    !testDiv.querySelector('.advertising') ||
    !testDiv.querySelector('.banner') ||
    !testDiv.querySelector('.ad') ||
    !testDiv.querySelector('#carbonads') ||
    !testDiv.querySelector('.adsbygoogle');

  testDiv.remove();

  const adScriptBlocked = checkAdScriptBlocking();
  const adBlockerExtensions = checkAdBlockerExtensions();

  return elementsBlocked || adScriptBlocked || adBlockerExtensions;
};

const checkAdScriptBlocking = (): boolean => {
  const script = document.createElement('script');
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.async = true;
  script.id = 'ad-test-script';

  let scriptBlocked = false;
  script.onerror = () => {
    scriptBlocked = true;
    script.remove();
  };

  document.head.appendChild(script);

  setTimeout(() => {
    document.getElementById('ad-test-script')?.remove();
  }, 1000);

  return scriptBlocked;
};

const checkAdBlockerExtensions = (): boolean => {
  const selectors = [
    '#adblock-notice',
    '#adblock-detector',
    '.adblock-warning',
    '#ab-detection',
    '.adblocker-message',
    'html.ublock',
    '#abp-detector'
  ];

  return selectors.some(selector => document.querySelector(selector)) ||
    ['adblockDetect', 'blockAdBlock', 'fuckAdBlock', 'abp'].some(key => (window as Record<string, unknown>)[key] !== undefined);
};

// Custom hook to use VPN detection
export const useVPNDetection = (): { isVPN: boolean, confidence: number, reason?: string } => {
  const [result, setResult] = useState<{ isVPN: boolean, confidence: number, reason?: string }>({ isVPN: false, confidence: 0, reason: '' });

  useEffect(() => {
    const checkVPN = async () => {
      const res = await detectVPN();
      setResult(res);
    };
    checkVPN();
  }, []);

  return result;
};

// Custom hook to use AdBlocker detection
export const useAdBlockerDetection = (): boolean => {
  const [isAdBlocker, setIsAdBlocker] = useState(false);

  useEffect(() => {
    const result = detectAdBlocker();
    setIsAdBlocker(result);
  }, []);

  return isAdBlocker;
};
