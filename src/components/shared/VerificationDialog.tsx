import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BadgeCheck, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VerificationDialogProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export function VerificationDialog({
  isOpen,
  onClose,
  onComplete,
}: VerificationDialogProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Simulate verification process
      setProgress(0);
      setVerificationError(null);
      setIsVerified(false);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsVerified(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isVerified) {
      onComplete();
      onClose();
    }
  }, [isVerified, onComplete, onClose]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400); // short delay for smoothness
          return 100;
        }
        return prev + 4;
      });
    }, 60); // ~1.5 seconds total
    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-xl font-bold mb-2">
            {isVerified ? (
              <BadgeCheck className="h-6 w-6 text-green-500" />
            ) : (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            )}
            {isVerified ? 'Verification Complete' : 'Verifying Request'}
          </DialogTitle>
          <DialogDescription>
            {isVerified ? (
              'Your request has been successfully verified. You can now proceed to download.'
            ) : verificationError ? (
              verificationError
            ) : (
              'Please wait while we verify your request...'
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Progress value={progress} className="w-full mt-4" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
