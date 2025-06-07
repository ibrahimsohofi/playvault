import { useEffect, useState } from 'react';
import { useAdBlockerDetection } from '@/utils/detection';
import { useDialogContext } from '@/context/DialogContext';

interface SecurityCheckProps {
  onDismiss?: () => void;
  isDownload?: boolean;
}

export function SecurityCheck({ onDismiss, isDownload = false }: SecurityCheckProps) {
  const isAdBlocker = useAdBlockerDetection();
  const { queueDialog, closeDialog } = useDialogContext();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isAdBlocker && !hasTriggered) {
      setHasTriggered(true);
      // Queue AdBlock dialog with priority 1 (after VPN priority 0)
      queueDialog({
        type: 'adblock',
        props: {
          isDownload,
          onClose: () => {
            closeDialog();
            onDismiss?.();
          }
        },
        priority: 1,
      });

      // Auto-dismiss after 5 seconds if not download
      if (!isDownload) {
        const timer = setTimeout(() => {
          closeDialog();
          onDismiss?.();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAdBlocker, isDownload, onDismiss, queueDialog, closeDialog, hasTriggered]);

  // This component no longer renders anything directly
  // All dialogs are handled by GlobalDialogManager
  return null;
}
