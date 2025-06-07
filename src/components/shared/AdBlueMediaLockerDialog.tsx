import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Unlock, X, AlertCircle, Loader2, Play } from "lucide-react";
import { getAdBlueMediaConfig } from "@/data/lockerConfig";

type AdBlueMediaLockerDialogProps = {
  isOpen: boolean;
  onClose: (adBlockerActive?: boolean) => void;
  title: string;
  description: string;
  contentId: string;
  redirectUrl: string; // URL for AdBlueMedia to redirect to after completion
};

export function AdBlueMediaLockerDialog({
  isOpen,
  onClose,
  title,
  description,
  contentId,
  redirectUrl,
}: AdBlueMediaLockerDialogProps) {
  console.log('AdBlueMediaLockerDialog props:', { isOpen, contentUnlocked: localStorage.getItem(`unlocked_${contentId}`) === 'true' });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showTestBypass, setShowTestBypass] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Maximum retry attempts
  const MAX_RETRIES = 3;

  // Check if content is already unlocked in localStorage
  const contentUnlocked = localStorage.getItem(`unlocked_${contentId}`) === 'true';

  // Testing bypass - check for dev environment or testing mode
  const isTestingMode = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1' ||
                       localStorage.getItem('adblue_testing_mode') === 'true';

  // Reset states when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRetryCount(0);
      setLoadError(null);
      setShowTestBypass(false);
    }
  }, [isOpen]);

  // If content is already unlocked, redirect directly to the download URL
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      onClose();
      window.location.href = redirectUrl;
    }
  }, [isOpen, contentUnlocked, redirectUrl, onClose]);

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

  // Testing bypass function
  const handleTestBypass = useCallback(() => {
    console.log('Test bypass activated for demo purposes');
    localStorage.setItem(`unlocked_${contentId}`, 'true');
    localStorage.setItem('adblue_testing_mode', 'true');
    onClose();
    window.location.href = redirectUrl;
  }, [contentId, onClose, redirectUrl]);

  // Initialize the AdBlueMedia locker
  const initializeLocker = useCallback(() => {
    if (!containerRef.current) return;

    console.log('Initializing AdBlueMedia locker for:', contentId);

    // Clear previous content
    containerRef.current.innerHTML = '';
    setIsLoading(true);
    setLoadError(null);

    // Get the configuration for this game
    const config = getAdBlueMediaConfig(contentId);

    try {
      // For demo purposes, we'll simulate the locker loading process
      // In a real implementation, you would load the actual AdBlueMedia script

      // Create a demo locker interface
      const lockerContainer = document.createElement('div');
      lockerContainer.className = 'adblue-locker-demo';
      lockerContainer.innerHTML = `
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
              Complete a quick task below to access your download
            </p>
          </div>

          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          ">
            <div style="margin-bottom: 1rem;">
              <div style="
                background: rgba(255,255,255,0.2);
                height: 8px;
                border-radius: 4px;
                overflow: hidden;
              ">
                <div id="progress-bar" style="
                  background: #4ade80;
                  height: 100%;
                  width: 0%;
                  border-radius: 4px;
                  transition: width 0.3s ease;
                "></div>
              </div>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.8rem; opacity: 0.8;">
                Loading offers...
              </p>
            </div>
          </div>

          ${isTestingMode ? `
          <div style="
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 1rem;
            margin-top: 1rem;
          ">
            <p style="margin: 0 0 1rem 0; font-size: 0.8rem; opacity: 0.7;">
              Demo Mode - Testing Environment
            </p>
            <button id="test-bypass" style="
              background: #10b981;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 6px;
              font-size: 0.9rem;
              cursor: pointer;
              transition: background 0.2s;
            " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
              Skip for Demo
            </button>
          </div>
          ` : ''}
        </div>
      `;

      containerRef.current.appendChild(lockerContainer);

      // Simulate loading progress
      let progress = 0;
      const progressBar = lockerContainer.querySelector('#progress-bar') as HTMLElement;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);

          // After loading, show either the offers or test bypass
          setTimeout(() => {
            if (isTestingMode) {
              setShowTestBypass(true);
            } else {
              // In a real implementation, this would show actual AdBlueMedia offers
              setLoadError('Demo Mode: In production, real CPA offers would appear here. Use the demo bypass button for testing.');
            }
            setIsLoading(false);
          }, 500);
        }
        if (progressBar) {
          progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
      }, 200);

      // Add event listener for test bypass button
      if (isTestingMode) {
        const bypassButton = lockerContainer.querySelector('#test-bypass');
        if (bypassButton) {
          bypassButton.addEventListener('click', handleTestBypass);
        }
      }

      // Set timeout for loading
      timerRef.current = window.setTimeout(() => {
        clearInterval(progressInterval);
        setIsLoading(false);
        if (!isTestingMode) {
          setLoadError('Offers took too long to load. This might be due to network issues or ad blockers.');
        }
        setShowTestBypass(true);
      }, 10000);

    } catch (error) {
      console.error('Error initializing locker:', error);
      setLoadError('Failed to initialize content locker. Please try again.');
      setIsLoading(false);
    }
  }, [contentId, title, isTestingMode, handleTestBypass]);

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
      setShowTestBypass(true);
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
      setShowTestBypass(true);
      return;
    }

    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setLoadError(null);
    setShowTestBypass(false);

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
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

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Retry Button */}
            {loadError && retryCount < MAX_RETRIES && (
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Retry ({MAX_RETRIES - retryCount} attempts left)
              </Button>
            )}

            {/* Test Bypass Button for Demo */}
            {(showTestBypass || isTestingMode) && (
              <Button
                onClick={handleTestBypass}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isTestingMode ? 'Demo Download' : 'Test Access'}
              </Button>
            )}

            {/* Close Button */}
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

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
