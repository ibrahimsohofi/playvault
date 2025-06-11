import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Unlock, X, AlertCircle, Loader2, Play, Bug, ExternalLink } from "lucide-react";
import { getAdBlueMediaConfig, getDownloadUrl, getRedirectUrl, type AdBlueMediaConfig } from "@/data/lockerConfig";

type AdBlueMediaLockerDialogProps = {
  isOpen: boolean;
  onClose: (adBlockerActive?: boolean) => void;
  title: string;
  description: string;
  gameId: string;
};

export function AdBlueMediaLockerDialog({
  isOpen,
  onClose,
  title,
  description,
  gameId,
}: AdBlueMediaLockerDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebugMode, setShowDebugMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const configRef = useRef<AdBlueMediaConfig | null>(null);

  // Maximum retry attempts
  const MAX_RETRIES = 3;

  // Add debug log function
  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log('🐛 DEBUG:', logMessage);
    setDebugInfo(prev => [...prev.slice(-10), logMessage]); // Keep last 10 logs
  }, []);

  // Check if content is already unlocked
  const contentUnlocked = localStorage.getItem(`unlocked_${gameId}`) === 'true';

  // Get download URL for this game
  const redirectUrl = getDownloadUrl(gameId);

  // Testing mode (moved up to avoid declaration order issues)
  const isTestingMode = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1' ||
                       localStorage.getItem('adblue_testing_mode') === 'true';

  // Testing bypass function (moved up to avoid declaration order issues)
  const handleTestBypass = useCallback(() => {
    addDebugLog('Test bypass activated for demo purposes');
    localStorage.setItem(`unlocked_${gameId}`, 'true');
    localStorage.setItem('adblue_testing_mode', 'true');
    onClose();
    window.location.href = redirectUrl;
  }, [gameId, onClose, redirectUrl, addDebugLog]);

  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRetryCount(0);
      setLoadError(null);
      setScriptsLoaded(false);
    }
  }, [isOpen]);

  // If content is already unlocked, redirect directly to the download URL
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      onClose();
      window.location.href = redirectUrl;
    }
  }, [isOpen, contentUnlocked, onClose, redirectUrl]);

  // Check for ad blocker
  const checkAdBlocker = useCallback((): boolean => {
    let testDiv: HTMLElement | null = null;
    try {
      // Try to create a common ad element that would be blocked by ad blockers
      testDiv = document.createElement('div');
      testDiv.innerHTML = '&nbsp;';
      testDiv.className = 'adsbox ad-unit';
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-10000px';
      testDiv.style.top = '-10000px';
      testDiv.style.width = '1px';
      testDiv.style.height = '1px';

      document.body.appendChild(testDiv);

      // Small delay to let ad blockers potentially block the element
      const adBlockerDetected = testDiv.offsetHeight === 0 || testDiv.offsetWidth === 0 || testDiv.offsetParent === null;

      return adBlockerDetected;
    } catch (error) {
      console.warn('Ad blocker check failed:', error);
      return false;
    } finally {
      // Safely remove the test element with multiple fallback methods
      if (testDiv) {
        try {
          // First try the standard method
          if (testDiv.parentNode) {
            testDiv.parentNode.removeChild(testDiv);
          }
        } catch (removeError) {
          console.warn('Failed to remove ad blocker test element with removeChild:', removeError);
          // Try alternative removal method
          try {
            if (testDiv.remove) {
              testDiv.remove();
            }
          } catch (altRemoveError) {
            console.warn('Failed to remove ad blocker test element with remove():', altRemoveError);
            // Last resort: just set it to null and let garbage collection handle it
            testDiv = null;
          }
        }
      }
    }
  }, []);

  // Initialize the AdBlueMedia locker
  const initializeLocker = useCallback(() => {
    if (!containerRef.current) return;

    addDebugLog(`🚀 Initializing AdBlueMedia locker for: ${gameId}`);

    // Clear previous content
    containerRef.current.innerHTML = '';
    setIsLoading(true);
    setLoadError(null);
    setDebugInfo([]); // Clear previous debug logs

    // Get the configuration for this game
    const config = getAdBlueMediaConfig(gameId);
    configRef.current = config;

    addDebugLog(`📋 AdBlue config loaded: ${JSON.stringify(config, null, 2)}`);

    if (!config) {
      addDebugLog(`❌ No AdBlueMedia configuration found for game: ${gameId}`);
      setLoadError('No AdBlueMedia configuration found for this game.');
      setIsLoading(false);
      return;
    }

    try {
      addDebugLog(`🔗 Loading AdBlueMedia script: ${config.scriptSrc}`);

      // Test script accessibility first
      fetch(config.scriptSrc, { method: 'HEAD' })
        .then(response => {
          addDebugLog(`📡 Script accessibility test: ${response.status} ${response.statusText}`);
        })
        .catch(error => {
          addDebugLog(`❌ Script accessibility test failed: ${error.message}`);
        });

      // Remove existing script if any
      const existingScript = document.querySelector(`script[src="${config.scriptSrc}"]`);
      if (existingScript) {
        addDebugLog('🗑️ Removing existing script');
        existingScript.remove();
      }

      // Create and load the AdBlueMedia script
      const script = document.createElement('script');
      script.src = config.scriptSrc;
      script.type = 'text/javascript';

      addDebugLog('📡 Script element created, starting load...');

      // TIMING FIX: Set up the global configuration variable BEFORE loading the script
      addDebugLog(`🔧 Setting up global variable BEFORE script load: ${config.variable}`);
      addDebugLog(`🔧 Global variable data: ${JSON.stringify({ it: config.it, key: config.key })}`);

      (window as any)[config.variable] = {
        it: config.it,
        key: config.key
      };

      script.onload = () => {
        addDebugLog('✅ AdBlueMedia script loaded successfully');

        // Wait a bit for the script to initialize
        setTimeout(() => {
          try {
            addDebugLog(`🔍 Checking for function: ${config.functionName}`);
            const windowFunctions = Object.keys(window).filter(key => key.startsWith('_'));
            addDebugLog(`🪟 Available window functions: ${windowFunctions.join(', ')}`);

            // Check if the required function is available
            if (window[config.functionName as keyof Window]) {
              addDebugLog(`✅ AdBlueMedia function found: ${config.functionName}`);

              // Create the locker container with proper ID
              const lockerDiv = document.createElement('div');
              lockerDiv.id = 'adblue-locker-container';
              lockerDiv.style.minHeight = '300px';
              lockerDiv.style.width = '100%';
              containerRef.current?.appendChild(lockerDiv);

              addDebugLog('📦 Locker container created');

              // Initialize the AdBlueMedia locker
              try {
                addDebugLog('🚀 Calling AdBlue function...');
                (window as any)[config.functionName]();
                addDebugLog('✅ AdBlueMedia locker constructed successfully');
                setIsLoading(false);
                setScriptsLoaded(true);
              } catch (initError) {
                addDebugLog(`❌ Error initializing AdBlueMedia locker: ${initError}`);
                setLoadError('Failed to initialize the offer system. Please try again.');
                setIsLoading(false);
              }
            } else {
              addDebugLog(`❌ AdBlueMedia function not found: ${config.functionName}`);
              addDebugLog(`🔍 All window properties starting with _: ${windowFunctions.join(', ')}`);
              setLoadError('AdBlueMedia script loaded but function not available. Please try again.');
              setIsLoading(false);
            }
          } catch (error) {
            addDebugLog(`❌ Error setting up AdBlueMedia: ${error}`);
            setLoadError('Error setting up the offer system. Please try again.');
            setIsLoading(false);
          }
        }, 1000);
      };

      script.onerror = (error) => {
        addDebugLog(`❌ Failed to load AdBlueMedia script: ${error}`);

        // Fallback to demo mode if script fails to load
        addDebugLog('🎭 Falling back to demo mode due to script load failure');
        showDemoLocker();
      };

      // Add script to document
      document.head.appendChild(script);

      // Set timeout for loading
      timerRef.current = window.setTimeout(() => {
        addDebugLog('⏰ AdBlueMedia loading timeout (15s), falling back to demo');
        showDemoLocker();
      }, 15000); // Increased timeout for real scripts

    } catch (error) {
      console.error('Error initializing locker:', error);
      setLoadError('Failed to initialize content locker. Please try again.');
      setIsLoading(false);
    }
  }, [gameId, title, handleTestBypass, isTestingMode, addDebugLog]);

  // Check ad blocker and initialize locker when dialog opens
  useEffect(() => {
    if (!isOpen || contentUnlocked) {
      // Cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check for ad blocker first
    const isBlocking = checkAdBlocker();
    if (isBlocking && !isTestingMode) {
      setLoadError(
        'Ad blocker detected. To access this content, please:\n' +
        '1. Disable your ad blocker for this site\n' +
        '2. Refresh the page\n' +
        '3. Try again\n\n' +
        'Need help? Check our FAQ for detailed instructions on disabling common ad blockers.'
      );
      setIsLoading(false);
      setScriptsLoaded(true);
    } else {
      // Initialize the locker
      setTimeout(initializeLocker, 100);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, contentUnlocked, checkAdBlocker, initializeLocker, isTestingMode]);

  // Handle manual retry
  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      setLoadError('Maximum retry attempts reached. Please try again later or contact support.');
      setScriptsLoaded(true);
      return;
    }

    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setLoadError(null);
    setScriptsLoaded(false);

    setTimeout(initializeLocker, 500);
  };

  // Handle dialog close
  const handleClose = () => {
    // Cleanup
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    onClose(checkAdBlocker());
  };

  // Function to open locker manually (for fallback)
  const openLocker = useCallback(() => {
    const config = configRef.current;
    if (!config) {
      addDebugLog('❌ No config available for openLocker');
      return;
    }

    addDebugLog(`🚀 Attempting to open locker with function: ${config.functionName}`);

    // Try to trigger the AdBlueMedia function directly
    try {
      if (window[config.functionName as keyof Window]) {
        addDebugLog(`✅ Function ${config.functionName} found, calling it...`);
        (window as any)[config.functionName]();
        addDebugLog(`✅ Successfully called ${config.functionName}()`);
      } else {
        addDebugLog(`❌ Function ${config.functionName} not found, using fallback URL`);
        // Fallback: open direct URL
        const fallbackUrl = `https://trafasn.com/cpa/adb-media-form?campaign=${config.key}&redirect=${encodeURIComponent(getRedirectUrl(gameId))}`;
        addDebugLog(`🔗 Opening fallback URL: ${fallbackUrl}`);
        window.open(fallbackUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      }
    } catch (error) {
      addDebugLog(`❌ Error opening locker: ${error}`);
      setLoadError('Failed to open offer. Please try the alternative method.');
    }
  }, [gameId, addDebugLog]);

  // Fallback demo locker function
  const showDemoLocker = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const demoContainer = document.createElement('div');
    demoContainer.className = 'demo-locker-container';
    demoContainer.innerHTML = `
      <div style="
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        text-align: center;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="margin-bottom: 1.5rem;">
          <div style="
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          ">🎮</div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 600;">
            Complete an offer to unlock ${title}
          </h3>
          <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">
            Demo Mode: AdBlueMedia scripts couldn't load. Using fallback interface.
          </p>
        </div>

        <div style="
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        ">
          <p style="margin: 0 0 1rem 0; font-size: 0.9rem;">
            In production, real CPA offers from AdBlueMedia would appear here.
          </p>
          <button id="demo-unlock" style="
            background: #10b981;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background 0.2s;
            font-weight: 600;
          " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
            Simulate Offer Completion (Demo)
          </button>
        </div>

        <div style="
          font-size: 0.8rem;
          opacity: 0.7;
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 1rem;
        ">
          <p style="margin: 0;">
            • This is a demo/fallback interface<br>
            • Real AdBlueMedia offers require proper CORS setup<br>
            • Contact support for production configuration
          </p>
        </div>
      </div>
    `;

    containerRef.current.appendChild(demoContainer);

    // Add click handler for demo unlock
    const demoButton = demoContainer.querySelector('#demo-unlock');
    if (demoButton) {
      demoButton.addEventListener('click', () => {
        localStorage.setItem(`unlocked_${gameId}`, 'true');
        onClose();
        window.location.href = getDownloadUrl(gameId);
      });
    }

    setIsLoading(false);
    setScriptsLoaded(true);
  }, [gameId, title, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw]" showCloseButton={false}>
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
          <Unlock className="w-5 h-5 text-cyan-400" />
          Unlock {title}
        </DialogTitle>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            {description}
          </p>

          {/* Locker Container */}
          <div
            ref={containerRef}
            className="min-h-[300px] flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center gap-3 p-8">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Loading content locker...
                </p>
              </div>
            )}
          </div>

          {/* Error State */}
          {loadError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                    Loading Error
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">
                    {loadError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !loadError && scriptsLoaded && (
            <div className="flex flex-col items-center justify-center h-full p-6 min-h-[200px]">
              <div className="text-center mb-6">
                <div className="mb-4">
                  <Unlock className="h-16 w-16 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to Unlock</h3>
                <p className="text-muted-foreground mb-4">
                  Click the button below to open the offer and unlock this game.
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Complete the offer in the new window to get access to the download.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-md">
                <Button
                  variant="default"
                  onClick={openLocker}
                  className="w-full text-lg py-6"
                  disabled={isLoading || !scriptsLoaded}
                >
                  <Unlock className="h-5 w-5 mr-2" />
                  {isLoading ? 'Loading...' : 'Open Offer'}
                </Button>

                {/* Add status indicator */}
                <div className="text-xs text-muted-foreground text-center">
                  {isLoading && "Loading offer system..."}
                  {!isLoading && !scriptsLoaded && "Offer system not ready"}
                  {!isLoading && scriptsLoaded && "Ready to open offer"}
                  {loadError && <span className="text-red-400">Error: {loadError}</span>}
                </div>

                {/* Fallback option if offer system fails */}
                {loadError && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Try to open the offer manually using direct URL approach
                      const config = configRef.current;
                      if (config) {
                        const fallbackUrl = `https://trafasn.com/cpa/adb-media-form?campaign=${config.key}&redirect=${encodeURIComponent(`${window.location.origin}/games/${gameId}`)}`;
                        window.open(fallbackUrl, '_blank', 'width=800,height=600');
                      } else {
                        // Final fallback - go to game detail page
                        window.location.href = `/games/${gameId}`;
                      }
                    }}
                    className="w-full text-sm"
                  >
                    Try Alternative Method
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="w-full text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Debug Panel */}
          {(isTestingMode || showDebugMode) && debugInfo.length > 0 && (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <Bug className="h-4 w-4 mr-1" />
                  Debug Information
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDebugMode(!showDebugMode)}
                  className="text-xs"
                >
                  {showDebugMode ? 'Hide' : 'Show'}
                </Button>
              </div>
              <div className="max-h-40 overflow-y-auto text-xs text-gray-600 dark:text-gray-400 space-y-1 font-mono">
                {debugInfo.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap break-words">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manual Testing Controls */}
          {isTestingMode && (
            <div className="border border-blue-300 dark:border-blue-600 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20 mb-4">
              <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Manual Testing Controls
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const config = configRef.current;
                    if (config) {
                      addDebugLog(`🧪 Testing script URL: ${config.scriptSrc}`);
                      window.open(config.scriptSrc, '_blank');
                    }
                  }}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Test Script URL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const config = configRef.current;
                    if (config) {
                      const fallbackUrl = `https://trafasn.com/cpa/adb-media-form?campaign=${config.key}&redirect=${encodeURIComponent(getRedirectUrl(gameId))}`;
                      addDebugLog(`🧪 Testing fallback URL: ${fallbackUrl}`);
                      window.open(fallbackUrl, '_blank');
                    }
                  }}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Test Fallback URL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDebugMode(!showDebugMode)}
                  className="text-xs"
                >
                  <Bug className="h-3 w-3 mr-1" />
                  Toggle Debug
                </Button>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• Complete offers to unlock your download</p>
            <p>• Disable ad blockers for best experience</p>
            {isTestingMode && (
              <p>• Demo mode active - bypass available for testing</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
