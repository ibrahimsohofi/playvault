import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Unlock, X, AlertCircle, Loader2 } from "lucide-react";
import { getAdBlueMediaConfig, getDownloadUrl, type AdBlueMediaConfig } from "@/data/lockerConfig";

// Extend window to include dynamic AdBlueMedia functions
declare global {
  interface Window {
    [key: string]: unknown; // Allow dynamic function names like _iH, _VR, etc.
  }
}

type DynamicAdBlueMediaLockerProps = {
  isOpen: boolean;
  onClose: (adBlockerActive?: boolean) => void;
  title: string;
  description: string;
  gameId: string;
};

export function DynamicAdBlueMediaLocker({
  isOpen,
  onClose,
  title,
  description,
  gameId,
}: DynamicAdBlueMediaLockerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const configRef = useRef<AdBlueMediaConfig | null>(null);

  // Maximum retry attempts
  const MAX_RETRIES = 3;

  // Check if content is already unlocked
  const contentUnlocked = localStorage.getItem(`unlocked_${gameId}`) === 'true';

  // Demo mode for testing (can be enabled via localStorage)
  const demoMode = localStorage.getItem('demo_mode') === 'true';

  // Improved ad blocker detection that's less likely to conflict with AdBlueMedia
  const checkAdBlocker = useCallback((): boolean => {
    try {
      // Use a more subtle test that's less likely to interfere with legitimate scripts
      const testElement = document.createElement('div');
      testElement.className = 'ads advertisement';
      testElement.style.cssText = `
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 1px !important;
        height: 1px !important;
        visibility: hidden !important;
      `;
      document.body.appendChild(testElement);

      // Small delay to let ad blockers process
      setTimeout(() => {
        try {
          if (testElement.parentNode) {
            testElement.parentNode.removeChild(testElement);
          }
        } catch (e) {
          // Silent cleanup failure
        }
      }, 100);

      const isBlocked = testElement.offsetHeight === 0 ||
                       testElement.offsetParent === null ||
                       testElement.style.display === 'none';

      // Quick cleanup
      try {
        if (testElement.parentNode) {
          testElement.parentNode.removeChild(testElement);
        }
      } catch (e) {
        // Silent cleanup failure
      }

      return isBlocked;
    } catch (error) {
      console.warn('Ad blocker detection failed:', error);
      // Return false to allow the process to continue
      return false;
    }
  }, []);

  // Function to load AdBlueMedia scripts dynamically, wrapped in useCallback
  const loadAdBlueMediaScripts = useCallback((config: AdBlueMediaConfig): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Check if already loaded
        if (window[config.functionName] && typeof window[config.functionName] === 'function') {
          console.log(`AdBlueMedia function ${config.functionName} already loaded`);
          resolve();
          return;
        }

        // Remove any existing scripts for this game first
        cleanupScripts();

        // Create the configuration variable with error handling
        try {
          const configScript = document.createElement('script');
          configScript.type = 'text/javascript';

          // Validate configuration values
          if (!config.variable || !config.key || typeof config.it !== 'number') {
            throw new Error('Invalid AdBlueMedia configuration');
          }

          // Create the script content safely with proper escaping
          const scriptContent = `var ${config.variable.replace(/[^a-zA-Z0-9_]/g, '')}={"it":${Number(config.it)},"key":"${config.key.replace(/"/g, '\\"')}"};`;
          configScript.innerHTML = scriptContent;
          configScript.setAttribute('data-game-id', gameId);

          // Test the script content by trying to parse it
          try {
            new Function(scriptContent);
          } catch (syntaxError) {
            console.warn(`Script syntax validation failed: ${syntaxError}, but continuing anyway`);
          }

          document.head.appendChild(configScript);
        } catch (error) {
          console.error('Error creating AdBlueMedia config script:', error);
          reject(new Error(`Failed to create config script: ${error instanceof Error ? error.message : 'Unknown error'}`));
          return;
        }
      } catch (outerError) {
        console.error('Outer error in loadAdBlueMediaScripts:', outerError);
        reject(new Error(`General script loading error: ${outerError instanceof Error ? outerError.message : 'Unknown error'}`));
        return;
      }

      // Load the main script with enhanced error handling
      try {
        const mainScript = document.createElement('script');
        mainScript.src = config.scriptSrc;
        mainScript.setAttribute('data-game-id', gameId);

        mainScript.onload = () => {
          console.log(`AdBlueMedia script loaded for ${gameId}: ${config.functionName}`);
          // Give the script a moment to initialize
          setTimeout(() => {
            try {
              if (window[config.functionName] && typeof window[config.functionName] === 'function') {
                resolve();
              } else {
                console.warn(`Function ${config.functionName} not available, but continuing...`);
                resolve(); // Continue anyway to prevent blocking
              }
            } catch (checkError) {
              console.error('Error checking script function:', checkError);
              resolve(); // Continue anyway
            }
          }, 500);
        };

        mainScript.onerror = (errorEvent) => {
          console.error('Script loading error:', errorEvent);
          reject(new Error(`Failed to load AdBlueMedia script: ${config.scriptSrc}`));
        };

        // Add timeout for script loading
        setTimeout(() => {
          if (mainScript.readyState !== 'complete') {
            console.warn('Script loading timeout, continuing anyway');
            resolve();
          }
        }, 10000);

        document.head.appendChild(mainScript);
      } catch (scriptError) {
        console.error('Error creating main script:', scriptError);
        reject(new Error(`Failed to create main script: ${scriptError instanceof Error ? scriptError.message : 'Unknown error'}`));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Function to cleanup scripts
  const cleanupScripts = () => {
    // Remove scripts for this specific game
    const scripts = document.querySelectorAll(`script[data-game-id="${gameId}"]`);
    for (const script of scripts) {
      script.remove();
    }
  };

  // If content is already unlocked, redirect directly
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      onClose();
      const downloadUrl = getDownloadUrl(gameId);
      if (downloadUrl) {
        window.location.href = downloadUrl;
      }
    }
  }, [isOpen, contentUnlocked, gameId, onClose]);

  // Initialize locker when dialog opens
  useEffect(() => {
    if (!isOpen || contentUnlocked) {
      return;
    }

    // Reset states
    setIsLoading(true);
    setLoadError(null);
    setRetryCount(0);
    setScriptsLoaded(false);

    // Get configuration for this game
    const config = getAdBlueMediaConfig(gameId);
    configRef.current = config;

    console.log(`Loading AdBlueMedia config for ${gameId}:`, config);

    // Check for ad blocker but be less aggressive
    const isBlocking = checkAdBlocker();
    if (isBlocking) {
      console.warn('Potential ad blocker detected, but continuing with offer loading...');
      // Don't immediately fail - try to load the offer anyway
      // Some "ad blockers" might not actually block AdBlueMedia scripts
    }

    // Load the AdBlueMedia scripts for this game
    loadAdBlueMediaScripts(config)
      .then(() => {
        setScriptsLoaded(true);
        setIsLoading(false);
        console.log(`Scripts loaded successfully for ${gameId}`);
      })
      .catch((error) => {
        console.error(`Failed to load scripts for ${gameId}:`, error);

        // If we detected ad blocker earlier, provide specific guidance
        if (isBlocking) {
          setLoadError(
            'Unable to load the offer system. This appears to be caused by an ad blocker.\n\n' +
            'To access this content:\n' +
            '1. Disable your ad blocker for this site\n' +
            '2. Refresh the page\n' +
            '3. Try downloading again\n\n' +
            'Need help? Check our FAQ for step-by-step instructions.'
          );
        } else {
          setLoadError(
            `Failed to load offer system: ${error.message}\n\nThis might be a temporary issue. Please try:\n1. Refresh the page\n2. Check your internet connection\n3. Try again in a few moments`
          );
        }
        setIsLoading(false);
      });

    // Set timeout for loading
    timerRef.current = window.setTimeout(() => {
      if (isLoading) {
        setLoadError('Loading timeout. Please try again.');
        setIsLoading(false);
      }
    }, 10000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, contentUnlocked, gameId, isLoading, checkAdBlocker, loadAdBlueMediaScripts]);

  // Function to open the locker
  const openLocker = () => {
    console.log('🔍 OpenLocker clicked for game:', gameId);
    console.log('🔍 Current config ref:', configRef.current);
    console.log('🔍 Scripts loaded:', scriptsLoaded);
    console.log('🔍 Is loading:', isLoading);
    console.log('🔍 Load error:', loadError);

    if (!configRef.current) {
      console.error('❌ Configuration not loaded for game:', gameId);
      setLoadError('Configuration not loaded');
      return;
    }

    const config = configRef.current;
    console.log('🔍 Using config:', config);

    // First, let's check what's actually available in window
    const allWindowProps = Object.getOwnPropertyNames(window);
    const functionsStartingWithUnderscore = allWindowProps.filter(prop =>
      prop.startsWith('_') && typeof window[prop] === 'function'
    );
    console.log('🔍 All window properties starting with _:', functionsStartingWithUnderscore);

    const lockerFunction = window[config.functionName];
    console.log(`🔍 Looking for function: ${config.functionName}`, lockerFunction);
    console.log(`🔍 Function type: ${typeof lockerFunction}`);

    // Check if the AdBlueMedia variable exists
    const adBlueVariable = window[config.variable];
    console.log(`🔍 AdBlue variable ${config.variable}:`, adBlueVariable);

    // Try to call the function
    if (typeof lockerFunction === 'function') {
      try {
        console.log(`✅ Opening locker with function: ${config.functionName}`);
        console.log('🔍 Function will be called now...');

        // Add a small delay to see the console message
        setTimeout(() => {
          lockerFunction();
          console.log('✅ Function called - checking for new window/popup...');

          // Check if a new window was opened (this is tricky to detect)
          setTimeout(() => {
            console.log('🔍 Checking if offer window opened...');
            // Most CPA offers open in new windows, so we can't directly detect this
            // But we can assume success if no error was thrown
          }, 1000);
        }, 100);

        // Set up completion detection
        setupCompletionDetection();

        // Show user feedback that offer is opening
        setLoadError(null); // Clear any previous errors
        console.log('📢 User should see offer opening in new window...');

      } catch (error) {
        console.error(`❌ Error calling ${config.functionName}:`, error);
        console.error('❌ Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        setLoadError(`Failed to open offer: ${error.message}. Please try refreshing the page.`);
      }
    } else {
      console.error(`❌ Locker function ${config.functionName} not available. Type: ${typeof lockerFunction}`);
      console.error('❌ Available functions:', functionsStartingWithUnderscore);

      // Check if the script is loaded by looking for common AdBlueMedia indicators
      const scriptElements = document.querySelectorAll('script[src*="cloudfront.net"]');
      console.log('🔍 AdBlueMedia scripts found:', scriptElements.length);
      scriptElements.forEach((script, index) => {
        console.log(`Script ${index + 1}:`, script.src);
      });

      setLoadError(
        `Offer system not ready. Function '${config.functionName}' not found.\n\n` +
        `This could be due to:\n` +
        `1. Script still loading (wait a moment and try again)\n` +
        `2. Ad blocker interference\n` +
        `3. Network connectivity issues\n\n` +
        `Available functions: ${functionsStartingWithUnderscore.join(', ') || 'none'}`
      );

      // Try to reload the script
      if (retryCount < MAX_RETRIES) {
        console.log(`🔄 Attempting to reload script (retry ${retryCount + 1}/${MAX_RETRIES})`);
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
        setLoadError(null);

        // Retry loading the script
        setTimeout(() => {
          loadAdBlueMediaScripts(config)
            .then(() => {
              setScriptsLoaded(true);
              setIsLoading(false);
              console.log(`✅ Script reloaded successfully on retry ${retryCount + 1}`);
            })
            .catch((retryError) => {
              console.error(`❌ Script reload failed on retry ${retryCount + 1}:`, retryError);
              setIsLoading(false);
              setLoadError(`Failed to reload script: ${retryError.message}`);
            });
        }, 1000);
      }
    }
  };

  // Set up completion detection
  const setupCompletionDetection = () => {
    const handleCompletion = () => {
      console.log('AdBlueMedia offer completed for game:', gameId);
      localStorage.setItem(`unlocked_${gameId}`, 'true');

      const downloadUrl = getDownloadUrl(gameId);
      if (downloadUrl) {
        window.location.href = downloadUrl;
      } else {
        console.error('No download URL found for game:', gameId);
        setLoadError('Download URL not configured for this game.');
      }
    };

    // Listen for completion messages
    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'adblue_completion') {
        handleCompletion();
      }
    };

    window.addEventListener('message', messageHandler);

    // Cleanup after 30 minutes
    setTimeout(() => {
      window.removeEventListener('message', messageHandler);
    }, 30 * 60 * 1000);
  };

  // Handle manual retry
  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      setLoadError('Maximum retry attempts reached. Please refresh the page and try again.');
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    setScriptsLoaded(false);
    setRetryCount(prev => prev + 1);

    if (configRef.current) {
      // Always try to load, regardless of ad blocker detection
      const adBlockerDetected = checkAdBlocker();
      if (adBlockerDetected) {
        console.warn('Ad blocker detected during retry, but attempting to load anyway...');
      }

      loadAdBlueMediaScripts(configRef.current)
        .then(() => {
          setScriptsLoaded(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error during retry:', error);
          if (adBlockerDetected) {
            setLoadError(
              `Unable to load offers. This might be due to an ad blocker.\n\nPlease try:\n1. Disable your ad blocker for this site\n2. Refresh the page and try again\n3. Use a different browser\n\nTechnical error: ${error.message}`
            );
          } else {
            setLoadError(`Retry failed: ${error.message}`);
          }
          setIsLoading(false);
        });
    } else {
      setLoadError('Configuration not available. Please refresh the page.');
      setIsLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Clean up scripts when closing
    cleanupScripts();

    const isAdBlockerActive = checkAdBlocker();
    onClose(isAdBlockerActive);
  };

  if (contentUnlocked) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] md:w-[80vw] lg:w-[70vw] max-w-[600px] mx-auto my-[10px] flex flex-col p-6 rounded-xl">
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </div>

        <div className="flex-1 w-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Unlock className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-full p-6 min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground text-center">Loading offer system...</p>
                <p className="text-xs text-muted-foreground/70 text-center">
                  Setting up the offer for this specific game. This may take a moment.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {loadError && (
            <div className="flex flex-col items-center justify-center h-full p-6 min-h-[200px]">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-bold mb-2">We've Detected an Issue</h3>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4 max-w-md">
                <p className="text-center whitespace-pre-line text-sm">
                  {loadError}
                </p>
              </div>

              {loadError.includes('Ad blocker') && (
                <div className="flex flex-col gap-3 w-full max-w-md">
                  <Button
                    variant="outline"
                    onClick={() => window.open('/faq#disable-adblocker', '_blank')}
                    className="w-full"
                  >
                    View Ad Blocker Disable Guide
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleRetry}
                    className="w-full"
                  >
                    I've Disabled My Ad Blocker
                  </Button>
                </div>
              )}

              {!loadError.includes('Ad blocker') && retryCount < MAX_RETRIES && (
                <Button
                  variant="default"
                  onClick={handleRetry}
                  className="mt-4"
                >
                  Retry ({MAX_RETRIES - retryCount} attempts left)
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={handleClose}
                className="mt-4 text-muted-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          )}

          {/* Ready State - Scripts Loaded */}
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

                {/* Demo mode for testing */}
                {(demoMode || process.env.NODE_ENV === 'development') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.setItem(`unlocked_${gameId}`, 'true');
                      onClose();
                      const downloadUrl = getDownloadUrl(gameId);
                      if (downloadUrl) {
                        window.location.href = downloadUrl;
                      }
                    }}
                    className="w-full text-sm"
                  >
                    Demo: Skip Offer (Dev Mode)
                  </Button>
                )}

                {/* Fallback option if offer system fails */}
                {loadError && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Try to open the offer manually using direct URL approach
                      const config = configRef.current;
                      if (config) {
                        const fallbackUrl = `https://trafasn.com/cpa/adb-media-form?campaign=${config.key}&redirect=${encodeURIComponent(window.location.origin + '/download-handler?game=' + gameId)}`;
                        window.open(fallbackUrl, '_blank', 'width=800,height=600');
                      } else {
                        // Final fallback - direct download
                        const downloadUrl = getDownloadUrl(gameId);
                        if (downloadUrl) {
                          window.open(downloadUrl, '_blank');
                        }
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

          {/* Container for locker (if needed) */}
          <div
            ref={containerRef}
            id="adblue-locker-container"
            className="w-full hidden"
          >
            {/* This container is hidden since we're using dynamic functions */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
