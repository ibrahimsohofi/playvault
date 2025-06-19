import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  buttonText?: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  autoClose?: number; // Time in milliseconds to auto-close the dialog
  disableBackdropClose?: boolean; // Prevent closing when clicking outside
}

export function ErrorDialog({
  isOpen,
  onClose,
  message,
  title = "Error",
  buttonText = "Close",
  variant = 'error',
  secondaryAction,
  autoClose,
  disableBackdropClose = false
}: ErrorDialogProps) {
  // Auto-close functionality
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);
  // Icon selection based on variant
  const IconComponent = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    success: AlertCircle, // Could use CheckCircle if imported
  }[variant];

  // Color classes based on variant
  const iconColorClass = {
    error: 'text-destructive',
    warning: 'text-amber-500',
    info: 'text-blue-500',
    success: 'text-emerald-500',
  }[variant];

  // Button variant based on dialog variant
  const buttonVariant = {
    error: 'destructive',
    warning: 'outline',
    info: 'secondary',
    success: 'default',
  }[variant] as 'destructive' | 'outline' | 'secondary' | 'default';

  return (
    <>
    <Dialog
      open={isOpen}
      onOpenChange={disableBackdropClose ? undefined : onClose}
    >
      <DialogContent
        className={cn(
          "sm:max-w-md w-[95vw]",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
      >
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center text-xl font-bold mb-2">
            <IconComponent className={`h-6 w-6 ${iconColorClass}`} />
            {title}
          </DialogTitle>
          <DialogDescription className="text-center">{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex sm:justify-end gap-2 mt-4">
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="focus:ring-2 focus:ring-offset-2"
            >
              {secondaryAction.text}
            </Button>
          )}
          <Button
            onClick={onClose}
            variant={buttonVariant}
            aria-label={buttonText}
            className="focus:ring-2 focus:ring-offset-2"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
