import React, { useContext, useState, type ReactNode } from 'react';

// Types for dialogs
export type DialogType = 'none' | 'vpn' | 'adblock' | 'offer' | 'error' | 'other' | 'success' | 'warning';
interface DialogRequest {
  type: DialogType;
  props?: Record<string, unknown>;
  priority: number; // Lower number = higher priority
}

interface DialogContextValue {
  currentDialog: DialogRequest | null;
  queueDialog: (dialog: DialogRequest) => void;
  closeDialog: () => void;
}
const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialogContext must be used within DialogProvider');
  return context;
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [currentDialog, setCurrentDialog] = useState<DialogRequest | null>(null);
  const [queue, setQueue] = useState<DialogRequest[]>([]);

  // Priority: 0 = highest (VPN message); higher = lower priority
  const queueDialog = (dialog: DialogRequest) => {
    if (!currentDialog || dialog.priority < currentDialog.priority) {
      // Replace current dialog if higher priority (e.g., VPN message comes in)
      setQueue(prev => (currentDialog ? [currentDialog, ...prev] : prev));
      setCurrentDialog(dialog);
    } else {
      setQueue(prev => [...prev, dialog]);
    }
  };
  const closeDialog = () => {
    // Check if there’s another dialog in the queue
    if (queue.length > 0) {
      // Find the highest priority
      const nextDialog = queue.reduce((min, d) => (d.priority < min.priority ? d : min), queue[0]);
      setQueue(prev => prev.filter(d => d !== nextDialog));
      setCurrentDialog(nextDialog);
    } else {
      setCurrentDialog(null);
    }
  };
  return (
    <DialogContext.Provider value={{ currentDialog, queueDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};
