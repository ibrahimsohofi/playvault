import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Unlock, X, AlertCircle, Loader2 } from "lucide-react";
import { ADBLUE_CAMPAIGN_ID } from "@/data/lockerConfig";

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
  console.log('Dialog open state:', isOpen);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Maximum retry attempts
  const MAX_RETRIES = 3;

  // Reset retry count when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRetryCount(0);
    }
  }, [isOpen]);

  // Check if content is already unlocked in localStorage
  const contentUnlocked = localStorage.getItem(`unlocked_${contentId}`) === 'true';

  // Enhanced ad blocker detection with multiple methods
  const checkAdBlocker = () => {
    try {
      // Method 1: Test div with ad-related class names
      const testDiv = document.createElement('div');
      testDiv.className = 'ad-unit adsbox ad-placement';
      testDiv.innerHTML = '&nbsp;';
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-999px';
      document.body.appendChild(testDiv);
      
      // Method 2: Create a bait element with ad-related ID
      const baitElement = document.createElement('div');
      baitElement.setAttribute('id', 'ad-banner-test');
      baitElement.style.height = '10px';
      baitElement.style.width = '100%';
      document.body.appendChild(baitElement);
      
      // Check if elements are hidden or removed
      const isBlocking = testDiv.offsetHeight === 0 || 
                         testDiv.offsetParent === null ||
                         baitElement.offsetHeight === 0 ||
                         baitElement.offsetParent === null;
      
      // Clean up test elements
      document.body.removeChild(testDiv);
      document.body.removeChild(baitElement);
      
      return isBlocking;
    } catch (error) {
      console.error('Error during ad blocker detection:', error);
      return false;
    }
  };

  // Check ad blocker and show detailed error guidance if active
  useEffect(() => {
    if (isOpen) {
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
        // We don't auto-close anymore to give users a chance to read instructions
        // Instead we'll show helpful guidance in the UI
      } else {
        setIsLoading(true);
        setLoadError(null);
      }
    }
  }, [isOpen]);

  // If content is already unlocked, redirect directly to the download URL
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      onClose();
      window.location.href = redirectUrl;
    }
  }, [isOpen, contentUnlocked, redirectUrl, onClose]);

  // Handle manual retry
  const handleRetry = () => {
    cleanupResources();
    setIsLoading(true);
    setLoadError(null);
    setRetryCount(prev => prev + 1);

    if (containerRef.current && !checkAdBlocker()) {
      containerRef.current.innerHTML = '';

      try {
        // Create a new iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://cpa-locker.adbluemedia.com/locker.js?campaignId=${ADBLUE_CAMPAIGN_ID}`;
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.style.scrollBehavior = 'smooth';
        iframe.style.touchAction = 'pan-y';
        iframe.style.scrollbarWidth = 'none';
        iframe.allow = 'clipboard-write';
        iframe.style.minWidth = "320px";
        iframe.style.width = "100%";
        iframe.style.minHeight = "400px";
        iframe.style.height = "auto";
        iframe.style.display = "block";
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('frameborder', '0');

        iframe.onload = () => {
          console.log('Retry: Iframe loaded successfully');
          setIsLoading(false);
        };

        iframe.onerror = () => {
          console.error('Retry: Failed to load iframe');
          setLoadError('Failed to load offers even after retry. Please try again later.');
          setIsLoading(false);
        };

        // Add message event handler for resizing
        window.addEventListener('message', function(e) {
          if (e.data && typeof e.data === 'object' && e.data.height) {
            iframe.style.height = `${e.data.height}px`;
          }
        });

        containerRef.current.appendChild(iframe);
      } catch (error) {
        console.error('Error during retry:', error);
        setLoadError('An error occurred while retrying. Please try again later.');
        setIsLoading(false);
      }
    }
  };

  // Clean up function for event listeners and timers
  const cleanupResources = () => {
    // Remove all event listeners
    window.removeEventListener('message', handleMessage);
    window.removeEventListener('message', handleResize);
    
    // Remove any existing iframe
    if (containerRef.current) {
      const iframe = containerRef.current.querySelector('iframe');
      if (iframe) {
        iframe.remove();
      }
      containerRef.current.innerHTML = '';
    }

    // Clear timeouts
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Reset loading state
    setIsLoading(false);
    setLoadError(null);
  };

  // Handler for messages from the iframe
  const handleMessage = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object') {
      if (event.data.status === 'completed') {
        console.log('Received completion message:', event.data);
        localStorage.setItem(`unlocked_${contentId}`, 'true');
        window.location.href = redirectUrl;
      } else if (event.data.error) {
        console.error('Locker error:', event.data.error);
        setLoadError(event.data.error);
        setIsLoading(false);
      }
    }
  };

  // Handler for iframe resize messages
  const handleResize = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object' && event.data.height) {
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe) {
        iframe.style.height = `${event.data.height}px`;
      }
    }
  };

  // Initialize the iframe when the dialog opens
  useEffect(() => {
    // If dialog is closed or content is unlocked, clean up and return
    if (!isOpen || contentUnlocked) {
      cleanupResources();
      return;
    }
    
    // Store the open state in localStorage to prevent reopening
    localStorage.setItem(`locker_shown_${contentId}`, 'true');

    // Remove existing event listeners
    window.removeEventListener('message', handleMessage);
    window.removeEventListener('message', handleResize);

    // Reset loading state
    setIsLoading(true);
    setLoadError(null);

    // Clear any existing iframe
    if (containerRef.current) {
      const existingIframe = containerRef.current.querySelector('iframe');
      if (existingIframe) {
        existingIframe.remove();
      }
      containerRef.current.innerHTML = '';
    }

    // Add new event listeners
    window.addEventListener('message', handleMessage);
    window.addEventListener('message', handleResize);

    // Set timeout for loading
    timerRef.current = window.setTimeout(() => {
      if (isLoading) {
        setLoadError('');
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    // Create and append iframe
    const iframe = document.createElement('iframe');
    try {
      // Configure iframe
      iframe.src = `https://cpa-locker.adbluemedia.com/locker.js?campaignId=${ADBLUE_CAMPAIGN_ID}`;
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.scrollBehavior = 'smooth';
      iframe.style.touchAction = 'pan-y';
      iframe.style.scrollbarWidth = 'none';
      iframe.allow = 'clipboard-write';
      iframe.style.minWidth = "320px";
      iframe.style.width = "100%";
      iframe.style.minHeight = "400px";
      iframe.style.height = "auto";
      iframe.style.display = "block";
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('frameborder', '0');

      // Set up event handlers
      iframe.onload = () => {
        console.log('Iframe loaded successfully');
        setIsLoading(false);
      };

      iframe.onerror = () => {
        console.error('Failed to load iframe');
        setLoadError('Failed to load offers. Please try again later.');
        setIsLoading(false);
      };

      // Add resize handler
      window.addEventListener('message', function(e) {
        if (e.data && typeof e.data === 'object' && e.data.height) {
          iframe.style.height = `${e.data.height}px`;
        }
      });

      // Append to container if it exists
      if (containerRef.current) {
        containerRef.current.appendChild(iframe);
      }
    } catch (error) {
      console.error('Error creating iframe:', error);
      setLoadError('An error occurred while loading offers. Please try again later.');
      setIsLoading(false);
    }
  });
  
  // Handle dialog close
  const handleClose = () => {
    cleanupResources();
    // Check if ad blocker is active
    const isAdBlockerActive = checkAdBlocker();
    // Call onClose with ad blocker status
    onClose(isAdBlockerActive);
  };

  if (contentUnlocked) {
    return null;
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] md:w-[80vw] lg:w-[70vw] max-w-[800px] mx-auto my-[10px] flex flex-col p-0 rounded-xl">
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </div>
        <div className="flex-1 w-full flex flex-col">
          {isLoading && (
            <div className="flex items-center justify-center h-full p-6 min-h-[300px]">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground text-center">Loading offers...</p>
                <p className="text-xs text-muted-foreground/70 text-center max-w-md">
                  Complete a quick offer to unlock this content. This helps support our site and keep all games free.
                </p>
              </div>
            </div>
          )}
          {loadError && (
            <div className="flex flex-col items-center justify-center h-full p-6 min-h-[300px]">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-bold mb-2">We've Detected an Issue</h3>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4 max-w-md">
                <p className="text-center whitespace-pre-line">
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
          {!isLoading && !loadError && (
            <div
              ref={containerRef}
              id="adblue-locker-container"
              className="w-full flex flex-col items-center justify-center py-4"
            >
              {/* Container for the iframe - empty by default, filled by the useEffect */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )

}
