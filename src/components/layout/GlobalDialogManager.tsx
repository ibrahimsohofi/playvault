import React from "react";
import { useDialogContext } from "@/context/DialogContext";

export function GlobalDialogManager() {
  const { currentDialog } = useDialogContext();

  // Currently no dialogs are needed
  // Future dialog types (error, info, etc.) can be added here as needed
  if (!currentDialog) return null;

  // Placeholder for future dialog implementations
  return null;
}
