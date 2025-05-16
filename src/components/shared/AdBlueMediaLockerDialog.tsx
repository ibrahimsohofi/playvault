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
  onClose: () => void;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Check if content is already unlocked in localStorage
  const contentUnlocked = localStorage.getItem(`unlocked_${contentId}`) === 'true';

  // If content is already unlocked, redirect directly to the download URL
  useEffect(() => {
    if (isOpen && contentUnlocked) {
      onClose();
      window.location.href = redirectUrl;
    }
  }, [isOpen, contentUnlocked, redirectUrl, onClose]);

  // Clean up function for event listeners and timers
  const cleanupResources = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    window.removeEventListener('message', handleMessage);
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  // Handler for messages from the iframe
  const handleMessage = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object' && event.data.status === 'completed') {
      console.log('Received completion message:', event.data);
      localStorage.setItem(`unlocked_${contentId}`, 'true');
      window.location.href = redirectUrl;
    }
  };

  // Initialize the iframe when the dialog opens
  useEffect(() => {
    if (!isOpen || contentUnlocked) return;

    window.addEventListener('message', handleMessage);

    setIsLoading(true);
    setLoadError(null);

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    timerRef.current = window.setTimeout(() => {
      if (isLoading) {
        setLoadError('');
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    timerRef.current = window.setTimeout(() => {
      if (!containerRef.current) return;

      try {
        const iframe = document.createElement('iframe');
        iframe.src = `https://locked-content.com/?${ADBLUE_CAMPAIGN_ID}`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.style.scrollbar = 'none';
        iframe.style.msOverflowStyle = 'none';
        iframe.style.scrollbarWidth = 'none';
        iframe.allow = 'clipboard-write';
        iframe.style.height = "100%";
        iframe.style.width = "100%";
        iframe.style.display = "block";

        iframe.onload = () => {
          console.log('Iframe loaded successfully');
          setIsLoading(false);
        };

        iframe.onerror = () => {
          console.error('Failed to load iframe');
          setLoadError('Failed to load offers. Please try again later.');
          setIsLoading(false);
        };

        containerRef.current.appendChild(iframe);
      } catch (error) {
        console.error('Error creating iframe:', error);
        setLoadError('An error occurred while loading offers. Please try again later.');
        setIsLoading(false);
      }
    }, 300);

    return cleanupResources;
  }, [isOpen, contentUnlocked, contentId, redirectUrl]);

  // Handle manual retry
  const handleRetry = () => {
    cleanupResources();
    setIsLoading(true);
    setLoadError(null);

    if (containerRef.current) {
      containerRef.current.innerHTML = '';

      const iframe = document.createElement('iframe');
      iframe.src = `https://locked-content.com/?${ADBLUE_CAMPAIGN_ID}`;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.scrollbar = 'none';
      iframe.style.msOverflowStyle = 'none';
      iframe.style.scrollbarWidth = 'none';
      iframe.allow = 'clipboard-write';
      iframe.style.height = "100%";
      iframe.style.width = "100%";
      iframe.style.display = "block";

      iframe.onload = () => {
        console.log('Retry: Iframe loaded successfully');
        setIsLoading(false);
      };

      iframe.onerror = () => {
        console.error('Retry: Failed to load iframe');
        setLoadError('Failed to load offers even after retry. Please try again later.');
        setIsLoading(false);
      };

      containerRef.current.appendChild(iframe);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    cleanupResources();
    onClose();
  };

  if (contentUnlocked) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[70vw] max-w-none mx-auto my-[10px] h-[calc(100vh-20px)] flex flex-col p-0">
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </div>
        <div className="flex-1 w-full flex flex-col">
          <div
            ref={containerRef}
            id="adblue-locker-container"
            className="w-full h-full flex-1 flex flex-col items-center justify-center"
          >
            {isLoading && (
              <div className="text-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#00f7ff] mx-auto mb-2" />
                <p>Loading...</p>
              </div>
            )}

            {loadError && (
              <div className="text-center p-4">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                <p className="text-red-500 font-semibold mb-2">Error</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
