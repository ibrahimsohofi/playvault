import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff } from "lucide-react";
import { useDialogContext } from "@/context/DialogContext";

export function ProtectionCheck() {
  const [showWarning, setShowWarning] = useState(false);
  const [detectedIssues, setDetectedIssues] = useState<{
    vpn: boolean;
    adblock: boolean;
  }>({
    vpn: false,
    adblock: false,
  });
  const { queueDialog, currentDialog, closeDialog } = useDialogContext();

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
              // Show VPN dialog at top priority (0)
              queueDialog({
                type: 'vpn',
                props: {
                  onClose: closeDialog
                },
                priority: 0,
              });
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
          // Optionally, queue (lower-priority) adblock dialog here
          // queueDialog({ type: 'adblock', priority: 2 });
        }
        testAd.remove();
      }, 100);
    };

    checkVPN();
    checkAdBlocker();
  }, [queueDialog, closeDialog]);

  // The VPN dialog will now be rendered by a top-level Dialog manager.

  return null;
}
