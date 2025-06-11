import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Unlock, X, AlertCircle, Loader2 } from "lucide-react";
import { getCampaignId, getDownloadUrl, getAdBlueMediaConfig } from "@/data/lockerConfig";

// Extend window to include AdBlueMedia functions
declare global {
  interface Window {
    [key: string]: unknown; // Allow dynamic function names
  }
}

type NewAdBlueMediaLockerProps = {
  isOpen: boolean;
  onClose: (adBlockerActive?: boolean) => void;
  title: string;
  description: string;
  gameId: string;
};

export function NewAdBlueMediaLocker({
  isOpen,
  onClose,
  title,
  description,
  gameId,
}: NewAdBlueMediaLockerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Maximum retry attempts
  const MAX_RETRIES = 3;

  // Check if content is already unlocked
  const contentUnlocked = localStorage.getItem(`unlocked_${gameId}`) === 'true';

  // Enhanced ad blocker detection wrapped in useCallback
  const checkAdBlocker = useCallback((): boolean => {
    let testDiv: HTMLElement | null = null;
    try {
      // Test div with ad-related class names
      testDiv = document.createElement('div');
      testDiv.className = 'ad-unit adsbox ad-placement';
      testDiv.innerHTML = '&nbsp;';
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-999px';
      testDiv.style.top = '-999px';
      testDiv.style.width = '1px';
      testDiv.style.height = '1px';
      document.body.appendChild(testDiv);

      // Small delay to let ad blockers potentially block the element
      const isBlocking = testDiv.offsetHeight === 0 || testDiv.offsetWidth === 0 || testDiv.offsetParent === null;

      return isBlocking;
    } catch (error) {
      console.error('Error during ad blocker detection:', error);
      return false;
    } finally {
      // Safely remove the test element
      if (testDiv && testDiv.parentNode) {
        try {
          testDiv.parentNode.removeChild(testDiv);
        } catch (removeError) {
          console.warn('Failed to remove ad blocker test element:', removeError);
          // Try alternative removal method
          try {
            testDiv.remove();
          } catch (altRemoveError) {
            console.warn('Alternative removal method also failed:', altRemoveError);
          }
        }
      }
    }
  }, []);

  // If content is already unlocked, redirect directly
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      onClose();
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

    // Check for ad blocker
    const isBlocking = checkAdBlocker();
    if (isBlocking) {
      setLoadError(
        'Ad blocker detected. To access this content, please:\n' +
        '1. Disable your ad blocker for this site\n' +
        '2. Refresh the page\n' +
        '3. Try again\n\n' +
        'Need help? Check our FAQ for detailed instructions on disabling common ad blockers.'
      );
      setIsLoading(false);
      return;
    }

    // Get configuration for this game
    const config = getAdBlueMediaConfig(gameId);
    if (!config) {
      setLoadError('Locker configuration not found for this game.');
      setIsLoading(false);
      return;
    }

    // TIMING FIX: Set up the global configuration variable BEFORE any script execution
    console.log('🔧 Setting up global variable BEFORE script execution:', config.variable, {
      it: config.it,
      key: config.key
    });

    (window as any)[config.variable] = {
      it: config.it,
      key: config.key
    };

    // Check if AdBlueMedia scripts are loaded
    if (typeof window[config.functionName] !== 'function') {
      setLoadError('Locker system is loading. Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }

    // Create custom callback to handle completion
    const handleCompletion = () => {
      console.log('AdBlueMedia offer completed for game:', gameId);
      localStorage.setItem(`unlocked_${gameId}`, 'true');

      // Get download URL and redirect
      const downloadUrl = getDownloadUrl(gameId);
      if (downloadUrl) {
        window.location.href = downloadUrl;
      } else {
        console.error('No download URL found for game:', gameId);
        setLoadError('Download URL not configured for this game.');
      }
    };

    // Override the callback to detect completion
    // Note: This is a simplified approach - you may need to adjust based on
    // how AdBlueMedia sends completion events
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'adblue_completion') {
        handleCompletion();
      }
    });

    // Set timeout for loading
    timerRef.current = window.setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 3000);

    try {
      // Initialize the locker
      console.log('Opening AdBlueMedia locker for game:', gameId);
      (window as any)[config.functionName]();
      console.log('✅ AdBlueMedia locker constructed successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('Error opening AdBlueMedia locker:', error);
      setLoadError('Failed to open locker. Please try again.');
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, contentUnlocked, gameId, isLoading, checkAdBlocker]);

  // Handle manual retry
  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(null);
    setRetryCount(prev => prev + 1);

    const config = getAdBlueMediaConfig(gameId);
    if (!config) {
      setLoadError('Configuration not found for this game.');
      setIsLoading(false);
      return;
    }

    if (!checkAdBlocker() && typeof window[config.functionName] === 'function') {
      try {
        (window as any)[config.functionName]();
        setIsLoading(false);
      } catch (error) {
        console.error('Error during retry:', error);
        setLoadError('Failed to open locker during retry. Please try again.');
        setIsLoading(false);
      }
    } else {
      setLoadError('Please disable your ad blocker and refresh the page.');
      setIsLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

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
                <p className="text-muted-foreground text-center">Opening offer...</p>
                <p className="text-xs text-muted-foreground/70 text-center max-w-md">
                  Complete a quick offer to unlock this game. This helps support our site and keep all games free.
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

          {/* Success State - Locker Opened */}
          {!isLoading && !loadError && (
            <div className="flex flex-col items-center justify-center h-full p-6 min-h-[200px]">
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <Unlock className="h-16 w-16 text-primary mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">Offer Window Opened</h3>
                <p className="text-muted-foreground mb-4">
                  Please complete the offer in the new window/tab to unlock this game.
                </p>
                <p className="text-xs text-muted-foreground/70">
                  After completing the offer, you'll be automatically redirected to download the game.
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-6 w-full max-w-md">
                <Button
                  variant="outline"
                  onClick={() => {
                    const config = getAdBlueMediaConfig(gameId);
                    if (config && typeof window[config.functionName] === 'function') {
                      (window as any)[config.functionName]();
                    }
                  }}
                  className="w-full"
                >
                  Open Offer Again
                </Button>
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
            {/* This container is hidden since we're using _iH() which opens in new window/popup */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
