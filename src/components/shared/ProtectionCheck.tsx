import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff } from "lucide-react";

export function ProtectionCheck() {
  const [showWarning, setShowWarning] = useState(false);
  const [detectedIssues, setDetectedIssues] = useState<{
    vpn: boolean;
    adblock: boolean;
  }>({
    vpn: false,
    adblock: false,
  });

  useEffect(() => {
    // Check for VPN using WebRTC leak detection
    const checkVPN = async () => {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            // Check if the IP address is from a known VPN range
            const ipAddress = e.candidate.address;
            const isVPN = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(
              ipAddress || ""
            );
            if (isVPN) {
              setDetectedIssues((prev) => ({ ...prev, vpn: true }));
              setShowWarning(true);
            }
          }
        };

        // Create offer to generate candidates
        await pc.createOffer();
        pc.close();
      } catch (error) {
        console.error("VPN check failed:", error);
      }
    };

    // Check for adblocker
    const checkAdBlocker = () => {
      const testAd = document.createElement("div");
      testAd.innerHTML = "&nbsp;";
      testAd.className = "adsbox";
      document.body.appendChild(testAd);

      window.setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setDetectedIssues((prev) => ({ ...prev, adblock: true }));
          setShowWarning(true);
        }
        testAd.remove();
      }, 100);
    };

    // Run checks
    checkVPN();
    checkAdBlocker();
  }, []);

  if (!showWarning) return null;

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-destructive" />
            Security Warning
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p className="font-semibold mb-2">We detected the following issues:</p>
            <ul className="list-disc list-inside space-y-1">
              {detectedIssues.vpn && (
                <li>VPN or proxy detected</li>
              )}
              {detectedIssues.adblock && (
                <li>Ad blocker detected</li>
              )}
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            For security reasons and to ensure proper functionality, please:
          </p>
          <ul className="text-sm space-y-2">
            {detectedIssues.vpn && (
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#00f7ff]" />
                Disable your VPN or proxy service
              </li>
            )}
            {detectedIssues.adblock && (
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#00f7ff]" />
                Disable your ad blocker for this site
              </li>
            )}
          </ul>

          <p className="text-sm">
            After making these changes, refresh the page to continue.
          </p>

          <Button
            className="w-full btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}