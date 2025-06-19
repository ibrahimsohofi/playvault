import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ProgressStep = "initial" | "processing" | "success" | "failed";

interface ProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  title?: string;
  description?: string;
  duration?: number; // Duration in milliseconds
}

export function VerificationDialog({
  isOpen,
  onClose,
  onComplete,
  title = "Processing",
  description = "Please wait while we process your request...",
  duration = 3000
}: ProgressDialogProps) {
  const [step, setStep] = useState<ProgressStep>("initial");
  const [progress, setProgress] = useState(0);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("initial");
      setProgress(0);
      // Start processing immediately when dialog opens
      runProcess();
    }
  }, [isOpen]);

  const runProcess = async () => {
    console.log('Starting process');
    try {
      setStep("processing");

      // Simulate progress over the specified duration
      const interval = 100; // Update every 100ms
      const steps = duration / interval;
      const increment = 100 / steps;

      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, interval));
        setProgress(prev => Math.min(prev + increment, 100));
      }

      console.log('Process completed successfully');
      setStep("success");
      setProgress(100);

      // Auto-close after showing success
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Process failed:', error);
      setStep("failed");
    }
  };

  const handleManualClose = () => {
    if (step === "processing") {
      // Don't allow closing during processing
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleManualClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={step !== "processing"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "processing" && <Loader2 className="h-5 w-5 animate-spin" />}
            {step === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {title}
          </DialogTitle>
          <DialogDescription>
            {step === "success" ? "Process completed successfully!" : description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={progress} className="w-full" />

          <div className="text-center text-sm text-muted-foreground">
            {step === "processing" && `${Math.round(progress)}% complete`}
            {step === "success" && "Done!"}
            {step === "failed" && "Process failed"}
          </div>

          {step === "failed" && (
            <div className="flex justify-end">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
