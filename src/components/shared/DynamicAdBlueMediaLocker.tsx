import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Unlock } from "lucide-react";
import { getAdBlueMediaConfig, AdBlueMediaConfig } from "@/data/lockerConfig";
import { detectAdBlocker } from "@/utils/detection";

// Extend window to include dynamic AdBlueMedia functions
declare global {
  interface Window {
    [key: string]: unknown; // Allow dynamic function names like _iH, _VR, etc.
    AdBlueMedia?: {
      init: (config: AdBlueMediaConfig) => void;
      show: (config: AdBlueMediaConfig) => void;
      hide: () => void;
      onComplete: (callback: () => void) => void;
      onClose: (callback: () => void) => void;
      onError: (callback: (error: Error) => void) => void;
    };
  }
}

// Helper type for dynamic function access
type DynamicFunction = (...args: unknown[]) => unknown;

interface DynamicAdBlueMediaLockerProps {
  isOpen: boolean;
  onClose: (adBlockerActive?: boolean) => void;
  title: string;
  description: string;
  gameId: string;
}

export function DynamicAdBlueMediaLocker({
  isOpen,
  onClose,
  title,
  description,
  gameId,
}: DynamicAdBlueMediaLockerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);
  const [adBlockerDetected, setAdBlockerDetected] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const configRef = useRef<AdBlueMediaConfig | null>(null);
  const initializedRef = useRef<boolean>(false);

  // Maximum retry attempts
  const MAX_RETRIES = 3;

  // Check if content is already unlocked
  const contentUnlocked = localStorage.getItem(`unlocked_${gameId}`) === 'true';

  // Check for ad blocker
  const checkAdBlocker = useCallback(async () => {
    try {
      const result = await detectAdBlocker();
      console.log('Ad blocker check in locker:', result);
      setAdBlockerDetected(result);
      return result;
    } catch (error) {
      console.error('Error checking ad blocker in locker:', error);
      return false;
    }
  }, []);

  // Function to load AdBlueMedia scripts dynamically, wrapped in useCallback
  const loadAdBlueMediaScripts = useCallback((config: AdBlueMediaConfig): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Check if already loaded
        const existingFn = window[config.functionName] as DynamicFunction | undefined;
        if (existingFn && typeof existingFn === 'function') {
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
                const loadedFn = window[config.functionName] as DynamicFunction | undefined;
                if (loadedFn && typeof loadedFn === 'function') {
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

          mainScript.onerror = (errorEvent: Event) => {
            console.error('Script loading error:', errorEvent);
            reject(new Error(`Failed to load AdBlueMedia script: ${config.scriptSrc}`));
          };

          // Add timeout for script loading
          const timeoutId = setTimeout(() => {
            if (mainScript instanceof HTMLScriptElement) {
              const state = mainScript.getAttribute('data-state') || 'loading';
              if (state !== 'complete') {
                console.warn('Script loading timeout, continuing anyway');
                resolve();
              }
            }
          }, 10000);

          document.head.appendChild(mainScript);
          return () => clearTimeout(timeoutId);
        } catch (scriptError) {
          console.error('Error creating main script:', scriptError);
          reject(new Error(`Failed to create main script: ${scriptError instanceof Error ? scriptError.message : 'Unknown error'}`));
        }
      } catch (outerError) {
        console.error('Outer error in loadAdBlueMediaScripts:', outerError);
        reject(new Error(`General script loading error: ${outerError instanceof Error ? outerError.message : 'Unknown error'}`));
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

  // Initialize locker when dialog opens
  useEffect(() => {
    if (!isOpen || contentUnlocked || initializedRef.current) {
      return;
    }

    console.log('Initializing locker...');
    initializedRef.current = true;
    
    const initializeLocker = async () => {
      // Reset states
      setIsLoading(true);
      setLoadError(null);
      setRetryCount(0);
      setScriptsLoaded(false);

      // Check for ad blocker first
      console.log('Checking for ad blocker before initializing locker...');
      const isBlocking = await detectAdBlocker();
      console.log('Ad blocker check result in locker:', isBlocking);

      if (isBlocking) {
        console.log('Ad blocker detected - not proceeding with locker initialization');
        setLoadError(
          'Ad blocker detected. To access this content, please:\n' +
          '1. Disable your ad blocker for this site\n' +
          '2. Refresh the page\n' +
          '3. Try again\n\n' +
          'Need help? Check our FAQ for detailed instructions on disabling common ad blockers.'
        );
        setIsLoading(false);
        onClose(true); // Signal that ad blocker is active
        return;
      }

      // Get configuration for this game
      const config = getAdBlueMediaConfig(gameId);
      if (!config) {
        setLoadError('Offer configuration not found for this game.');
        setIsLoading(false);
        return;
      }
      configRef.current = config;

      console.log(`Loading AdBlueMedia config for ${gameId}:`, config);

      try {
        // Load the AdBlueMedia scripts
        await loadAdBlueMediaScripts(config);
        setScriptsLoaded(true);
        setIsLoading(false);
        console.log(`Scripts loaded successfully for ${gameId}`);
      } catch (error) {
        console.error(`Failed to load scripts for ${gameId}:`, error);
        setLoadError(
          `Failed to load offer system: ${error.message}\n\nThis might be a temporary issue. Please try:\n1. Refresh the page\n2. Check your internet connection\n3. Try again in a few moments`
        );
        setIsLoading(false);
      }
    };

    initializeLocker();

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
      initializedRef.current = false;
    };
  }, [isOpen, contentUnlocked, gameId, isLoading, onClose]);

  // Handle retry
  const handleRetry = async () => {
    if (retryCount >= MAX_RETRIES) {
      setLoadError('Maximum retry attempts reached. Please try again later or contact support.');
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    setRetryCount(prev => prev + 1);

    // Check for ad blocker again
    const isBlocking = await checkAdBlocker();
    if (isBlocking) {
      setLoadError(
        'Ad blocker still detected. Please disable your ad blocker and refresh the page.'
      );
      setIsLoading(false);
      onClose(true);
      return;
    }

    if (configRef.current) {
      try {
        await loadAdBlueMediaScripts(configRef.current);
        setScriptsLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error during retry:', error);
        setLoadError(`Retry failed: ${error.message}`);
        setIsLoading(false);
      }
    } else {
      setLoadError('Configuration not available. Please refresh the page.');
      setIsLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = async () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Clean up scripts
    cleanupScripts();

    // Check ad blocker status one last time
    const isBlocking = await checkAdBlocker();
    onClose(isBlocking);
  };

  if (contentUnlocked) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : loadError ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Unlock className="h-5 w-5" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {loadError ? (
              <div className="space-y-4">
                <p className="text-destructive whitespace-pre-line">{loadError}</p>
                {retryCount < MAX_RETRIES && (
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="mb-4">{description}</p>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading offer system...</p>
                ) : scriptsLoaded ? (
                  <Button
                    onClick={() => {
                      if (configRef.current && typeof window[configRef.current.functionName] === 'function') {
                        window[configRef.current.functionName]();
                      }
                    }}
                    className="w-full"
                  >
                    Open Offer
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Ready to open offer</p>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
