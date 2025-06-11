import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { detectVPN } from "@/utils/detection";
import { detectAdBlocker } from "@/utils/detection";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type VerificationStep = "initial" | "checking" | "success" | "failed";

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (hasVPN: boolean, hasAdBlocker: boolean) => void;
}

export function VerificationDialog({
  isOpen,
  onClose,
  onComplete,
}: VerificationDialogProps) {
  const [step, setStep] = useState<VerificationStep>("initial");
  const [error, setError] = useState<string>("");
  const [hasVPN, setHasVPN] = useState(false);
  const [hasAdBlocker, setHasAdBlocker] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("initial");
      setError("");
      setHasVPN(false);
      setHasAdBlocker(false);
      setShowSuccessMessage(false);
      // Start verification immediately when dialog opens
      runVerification();
    }
  }, [isOpen]);

  const runVerification = async () => {
    console.log('Starting verification process');
    try {
      setStep("checking");
      
      // Check for ad blocker first
      console.log('Checking for ad blocker...');
      const adBlockerResult = await detectAdBlocker();
      console.log('Ad blocker check result:', adBlockerResult);
      setHasAdBlocker(adBlockerResult);

      if (adBlockerResult) {
        console.log('Ad blocker detected - stopping verification');
        setStep("failed");
        setError("Ad blocker detected");
        onComplete(false, true); // Signal ad blocker detected
        return; // Stop here if ad blocker is detected
      }

      // Only check for VPN if no ad blocker is detected
      console.log('Checking for VPN...');
      const vpnResult = await detectVPN();
      console.log('VPN check result:', vpnResult);
      setHasVPN(vpnResult.isVPN);

      if (vpnResult.isVPN) {
        console.log('VPN detected - verification failed');
        setStep("failed");
        setError("VPN detected");
        onComplete(true, false);
      } else {
        console.log('Security check passed');
        setStep("success");
        setShowSuccessMessage(true);
        onComplete(false, false);
      }

      // Close dialog after a longer delay if successful
      if (!vpnResult.isVPN && !adBlockerResult) {
        console.log('Scheduling dialog close');
        // Show success message for 2 seconds before closing
        setTimeout(() => {
          console.log('Closing verification dialog');
          setShowSuccessMessage(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStep("failed");
      setError("Verification failed. Please try again.");
      onComplete(false, false); // Assume no issues on error
    }
  };

  const getDialogDescription = () => {
    if (step === "success") {
      if (hasVPN && hasAdBlocker) {
        return 'VPN and ad blocker detected. Please disable both to continue.';
      }
      if (hasVPN) {
        return 'VPN detected. Please disable your VPN to continue.';
      }
      if (hasAdBlocker) {
        return 'Ad blocker detected. Please disable your ad blocker to continue.';
      }
      if (showSuccessMessage) {
        return (
          <>
            <span className="block text-green-600 font-medium mb-1">✓ Security check passed successfully!</span>
            <span className="block text-sm text-muted-foreground">Preparing to open the offer...</span>
          </>
        );
      }
      return 'Your request has been successfully verified. You can now proceed to download.';
    }
    if (step === "failed") {
      return error;
    }
    return 'Please wait while we verify your request...';
  };

  const dialogDescription = getDialogDescription();
  const dialogTitle = step === "success" 
    ? (hasVPN || hasAdBlocker ? 'Verification Failed' : 'Verification Complete')
    : step === "failed" 
    ? 'Verification Failed' 
    : 'Verifying Request';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        console.log('Dialog open state changed:', open);
        if (!open) {
          console.log('Dialog close requested');
          onClose();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md w-[95vw]"
        aria-describedby="verification-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-xl font-bold mb-2">
            {step === "checking" && <Loader2 className="h-5 w-5 animate-spin" />}
            {step === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {step === "failed" && <AlertCircle className="h-5 w-5 text-destructive" />}
            {step === "initial" && "Security Check"}
            {step === "checking" && "Checking Security..."}
            {step === "success" && "Verification Complete"}
            {step === "failed" && "Verification Failed"}
          </DialogTitle>
          <DialogDescription 
            id="verification-dialog-description"
            className="text-center"
          >
            {step === "initial" && "Please wait while we verify your connection..."}
            {step === "checking" && "Checking for VPN and ad blockers..."}
            {step === "success" && (
              <>
                <span className="block text-green-500 font-medium mb-2">✓ Security check passed successfully!</span>
                <span className="block text-sm text-muted-foreground">Preparing to open the offer...</span>
              </>
            )}
            {step === "failed" && (
              <span className="text-destructive">
                {error === "Ad blocker detected" && (
                  "Please disable your ad blocker to continue. This helps us maintain our services."
                )}
                {error === "VPN detected" && (
                  "Please disable your VPN to continue. VPNs can interfere with the download process."
                )}
                {error === "Verification failed" && (
                  "An error occurred during verification. Please try again."
                )}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Progress 
            value={
              step === "checking" ? 50 : 
              step === "success" ? 100 : 
              step === "failed" ? 100 : 0
            } 
            className={`w-full mt-4 ${
              step === "failed" ? "bg-red-100" : 
              step === "success" ? "bg-green-100" : ""
            }`}
            aria-label="Verification progress"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
