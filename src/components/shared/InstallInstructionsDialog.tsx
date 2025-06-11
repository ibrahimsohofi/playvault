import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Smartphone, Info } from "lucide-react";

type InstallInstructionsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  fileType?: 'apk' | 'xapk';
};

export function InstallInstructionsDialog({
  isOpen,
  onClose,
  fileName = "",
  fileType = 'apk'
}: InstallInstructionsDialogProps) {
  const installerUrl = "https://play.google.com/store/apps/details?id=com.wuliang.xapkinstaller";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw]" showCloseButton={false}>
        <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
          <Smartphone className="w-5 h-5 text-blue-500" />
          Installation Instructions
        </DialogTitle>

        <DialogDescription className="text-gray-600 dark:text-gray-300">
          {fileName && (
            <span className="block mb-2 font-medium text-foreground">
              File: {fileName}
            </span>
          )}
          Follow these steps to install your {fileType.toUpperCase()} file
        </DialogDescription>

        <div className="space-y-4">
          {/* Installation Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Installation Steps:
                </h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  <li>Download and install the XAPK Installer (recommended)</li>
                  <li>Open the installer app</li>
                  <li>Locate your downloaded {fileType.toUpperCase()} file</li>
                  <li>Tap the file to install</li>
                  <li>Follow the on-screen instructions</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Recommended Installer */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                  Recommended Installer:
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  XAPK Installer by WuLiang - The best tool for installing APK and XAPK files safely.
                </p>
                <Button
                  onClick={() => window.open(installerUrl, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get XAPK Installer
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Tips */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="text-sm text-orange-700 dark:text-orange-300">
              <h4 className="font-semibold mb-2">⚠️ Important Tips:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Enable "Install from Unknown Sources" in your device settings</li>
                <li>Make sure you have enough storage space</li>
                <li>Scan files with antivirus if you're concerned about security</li>
                <li>Some apps may require additional permissions</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => window.open(installerUrl, '_blank')}
              className="w-full"
              variant="default"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Download XAPK Installer
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Got it, thanks!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
