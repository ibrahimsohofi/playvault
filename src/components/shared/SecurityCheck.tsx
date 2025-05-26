import { useEffect, useState } from 'react';
import { AlertCircle, ShieldOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVPNDetection, useAdBlockerDetection } from '@/utils/detection';

interface SecurityCheckProps {
  onDismiss?: () => void;
  isDownload?: boolean;
}

export function SecurityCheck({ onDismiss, isDownload = false }: SecurityCheckProps) {
  const isVPN = useVPNDetection();
  const isAdBlocker = useAdBlockerDetection();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isVPN || isAdBlocker) {
      setShowMessage(true);
      // Auto-dismiss after 5 seconds if not download
      if (!isDownload) {
        const timer = setTimeout(() => {
          setShowMessage(false);
          onDismiss?.();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isVPN, isAdBlocker, isDownload, onDismiss]);

  if (!showMessage) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-[90%] max-w-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            {isDownload ? 'Security Check Required' : 'Important Notice'}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowMessage(false);
              onDismiss?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {isVPN && (
            <div className="flex items-start gap-3">
              <ShieldOff className="h-6 w-6 text-destructive" />
              <div>
                <h4 className="font-medium text-destructive">
                  VPN Detected
                </h4>
                <p className="text-sm text-muted-foreground">
                  For security reasons, please turn off your VPN or use a different browser.
                </p>
              </div>
            </div>
          )}

          {isAdBlocker && (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div>
                <h4 className="font-medium text-destructive">
                  AdBlocker Detected
                </h4>
                <p className="text-sm text-muted-foreground">
                  Please disable your ad blocker to continue. This helps us maintain our services.
                </p>
              </div>
            </div>
          )}

          {isDownload && (
            <Button
              variant="outline"
              onClick={() => {
                setShowMessage(false);
                onDismiss?.();
              }}
              className="w-full mt-4"
            >
              I understand
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
