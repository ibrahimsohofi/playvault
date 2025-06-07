import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldOff, AlertCircle, X } from "lucide-react";
import { useDialogContext } from "@/context/DialogContext";

export function GlobalDialogManager() {
  const { currentDialog, closeDialog } = useDialogContext();
  if (!currentDialog) return null;

  // VPN Dialog: Priority 0
  if (currentDialog.type === "vpn") {
    return (
      <Dialog open={true} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldOff className="h-5 w-5 text-destructive" />
              Security Warning
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
              <p className="font-semibold mb-2">VPN or proxy detected</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Our service does not work with VPN or proxy connections enabled.</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Please disable your VPN or proxy and refresh the page to continue.
            </p>
            <Button
              className="w-full btn-primary"
              onClick={() => window.location.reload()}
              autoFocus
            >
              Refresh Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  // AdBlock Dialog: Priority 1
  if (currentDialog.type === "adblock") {
    const isDownload = currentDialog.props?.isDownload || false;
    return (
      <Dialog open={true} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                {isDownload ? 'AdBlocker Detected' : 'AdBlocker Notice'}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDialog}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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

            {isDownload && (
              <Button
                variant="outline"
                onClick={closeDialog}
                className="w-full mt-4"
              >
                I understand
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Rendering for future dialog types (offer, error, etc.) can be added here.
  return null;
}
