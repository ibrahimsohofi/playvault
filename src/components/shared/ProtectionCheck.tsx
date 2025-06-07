import { useEffect, useState } from "react";
import { useDialogContext } from "@/context/DialogContext";
import { detectAdBlocker } from "@/utils/detection";

export function ProtectionCheck() {
  const { queueDialog, closeDialog } = useDialogContext();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkProtection = async () => {
      if (hasChecked) return;

      try {
        console.log('Running initial protection check...');
        const adBlockerResult = await detectAdBlocker();
        console.log('Initial ad blocker check result:', adBlockerResult);
        
        if (adBlockerResult) {
          console.log('Ad blocker detected during initial check - showing dialog');
          // Queue adblock dialog with priority 1
          queueDialog({
            type: 'adblock',
            props: {
              onClose: () => {
                console.log('Ad blocker dialog closed');
                closeDialog();
                // Store that user has seen the warning with timestamp
                localStorage.setItem('adblock_warning_shown', Date.now().toString());
              }
            },
            priority: 1,
          });
        } else {
          console.log('No ad blocker detected during initial check');
          // Clear any existing warning timestamp since no ad blocker is detected
          localStorage.removeItem('adblock_warning_shown');
        }
      } catch (error) {
        console.error('Protection check failed:', error);
      } finally {
        setHasChecked(true);
      }
    };

    // Run the check immediately on mount
    checkProtection();

    // Set up an interval to periodically check for ad blocker
    const checkInterval = setInterval(() => {
      if (!hasChecked) {
        checkProtection();
      }
    }, 5000); // Check every 5 seconds until we get a result

    return () => {
      clearInterval(checkInterval);
    };
  }, [hasChecked, queueDialog, closeDialog]);

  // This component doesn't render anything
  return null;
}
