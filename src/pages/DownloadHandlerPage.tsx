import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft, ShieldAlert, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { getDownloadUrl } from "@/data/lockerConfig";
import { SecurityCheck } from "@/components/shared/SecurityCheck";
import { ErrorDialog } from "@/components/shared/ErrorDialog";
import { Progress } from "@/components/ui/progress";

/**
 * This page acts as a download handler/redirector after a user completes the AdBlueMedia locker.
 * It extracts the gameId from the URL query parameters and redirects to the appropriate download URL.
 */
export function DownloadHandlerPage() {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [redirected, setRedirected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityCheckPassed, setSecurityCheckPassed] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'pending' | 'starting' | 'failed' | 'complete'>('pending');
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Get the gameId from the URL - check both "gameId" and "game" parameters to support both formats
  // "gameId" is used in local development, "game" is used in the Vercel deployment
  const gameId = searchParams.get("gameId") || searchParams.get("game") || "";

  // Get the download URL for this game
  const downloadUrl = getDownloadUrl(gameId);

  // Track if this is a valid AdBlueMedia redirect
  const isValidRedirect = Boolean(gameId && downloadUrl);

  // Log this activity to help with debugging and tracking
  useEffect(() => {
    console.log(`Download handler accessed: GameID: ${gameId}, Valid: ${isValidRedirect}`);

    // For analytics or tracking purposes
    if (gameId) {
      // You could add analytics tracking here
      const unlocked = localStorage.getItem(`unlocked_${gameId}`) === 'true';
      console.log(`Game ${gameId} unlock status: ${unlocked ? 'Unlocked' : 'Not unlocked'}`);
    }
  }, [gameId, isValidRedirect]);

  // Function to handle download initiation
  const initiateDownload = useCallback(() => {
    if (!downloadUrl) {
      setError(`No download URL found for game: ${gameId}`);
      setShowErrorDialog(true);
      return;
    }
    
    setDownloadStatus('starting');
    
    // Simulate download progress (in a real app, you might track actual download progress)
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = prev + (Math.random() * 10);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setDownloadStatus('complete');
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    // Redirect after a short delay to allow progress animation
    setTimeout(() => {
      try {
        window.location.href = downloadUrl;
        setRedirected(true);
      } catch (err) {
        console.error('Error redirecting:', err);
        setError('Failed to redirect to download. Please try again.');
        setShowErrorDialog(true);
        setDownloadStatus('failed');
        clearInterval(progressInterval);
      }
    }, 2500);
    
    return () => clearInterval(progressInterval);
  }, [downloadUrl, gameId]);

  // Countdown effect
  useEffect(() => {
    // Only proceed if we have a valid download URL, haven't redirected yet, and security check passed
    if (downloadUrl && !redirected && securityCheckPassed) {
      // Set up countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          // When countdown reaches 0, start download
          if (prev <= 1) {
            clearInterval(timer);
            initiateDownload();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (!downloadUrl && securityCheckPassed) {
      // Set error if no download URL is found
      setError(`No download URL found for game: ${gameId}`);
      setShowErrorDialog(true);
    }
  }, [downloadUrl, redirected, gameId, securityCheckPassed, initiateDownload]);

  // Close error dialog handler
  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  };

  // Manual download handler
  const handleManualDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  // If no valid game ID or download URL, show error page
  if (!isValidRedirect) {
    return (
      <>
        <div className="container-custom flex flex-col items-center justify-center py-20">
          <div className="bg-card/70 backdrop-blur-sm border border-[#00f7ff]/20 rounded-lg p-8 max-w-md w-full text-center animate-in fade-in-50 duration-300">
            <div className="text-red-500 flex justify-center mb-4">
              <ShieldAlert className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Invalid Download Request</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the game you're looking for. Please try downloading from the game details page.
            </p>
            <Link to="/">
              <Button className="btn-primary w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
        
        <ErrorDialog
          isOpen={showErrorDialog}
          onClose={handleCloseErrorDialog}
          title="Download Error"
          message={error || "An unknown error occurred while processing your download."}
          variant="error"
          buttonText="Close"
        />
      </>
    );
  }

  return (
    <>
      <SecurityCheck onDismiss={() => setSecurityCheckPassed(true)} isDownload={true} />
      <div className="container-custom flex flex-col items-center justify-center py-20">
        <div className="bg-card/70 backdrop-blur-sm border border-[#00f7ff]/20 rounded-lg p-8 max-w-md w-full text-center animate-in fade-in-50 duration-300">
          {downloadStatus === 'pending' && (
            <>
              <h1 className="text-2xl font-bold mb-4">Download Starting Soon</h1>
              <div className="rounded-full bg-[#00f7ff]/10 border border-[#00f7ff]/30 h-24 w-24 flex items-center justify-center text-3xl font-bold mx-auto mb-6 animate-pulse">
                {countdown}
              </div>
              <p className="text-muted-foreground mb-6">
                Your download will begin automatically in {countdown} second{countdown !== 1 ? 's' : ''}.
                {countdown <= 3 && " Almost ready..."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={initiateDownload} 
                  className="w-full sm:w-auto btn-primary"
                >
                  <FileDown className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
                <Link to={`/games/${gameId}`}>
                  <Button variant="outline" className="w-full sm:w-auto border-[#00f7ff]/30 hover:bg-[#00f7ff]/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Game
                  </Button>
                </Link>
              </div>
            </>
          )}
          
          {downloadStatus === 'starting' && (
            <>
              <div className="flex justify-center mb-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Preparing Your Download</h1>
              <div className="mb-6">
                <Progress value={downloadProgress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {downloadProgress < 100 ? 'Initializing download...' : 'Ready to download!'}
                </p>
              </div>
              <p className="text-muted-foreground mb-6">
                Your file is being prepared. This will only take a moment.
              </p>
            </>
          )}
          
          {downloadStatus === 'complete' && (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Download Started!</h1>
              <p className="text-muted-foreground mb-6">
                Your download has started. If it doesn't begin automatically, use the button below.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleManualDownload} 
                  className="w-full sm:w-auto btn-primary"
                >
                  <FileDown className="mr-2 h-5 w-5" />
                  Download Again
                </Button>
                <Link to={`/games/${gameId}`}>
                  <Button variant="outline" className="w-full sm:w-auto border-[#00f7ff]/30 hover:bg-[#00f7ff]/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Game
                  </Button>
                </Link>
              </div>
            </>
          )}
          
          {downloadStatus === 'failed' && (
            <>
              <div className="flex justify-center mb-6">
                <AlertTriangle className="h-12 w-12 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Download Issue</h1>
              <div className="bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-md p-4 mb-6">
                <p>We encountered an issue starting your download. Please try the manual download button below.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleManualDownload} 
                  className="w-full sm:w-auto btn-primary"
                >
                  <FileDown className="mr-2 h-5 w-5" />
                  Manual Download
                </Button>
                <Link to={`/games/${gameId}`}>
                  <Button variant="outline" className="w-full sm:w-auto border-[#00f7ff]/30 hover:bg-[#00f7ff]/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Game
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={handleCloseErrorDialog}
        title="Download Error"
        message={error || "An unknown error occurred while processing your download."}
        variant="error"
        buttonText="Close"
        secondaryAction={{
          text: "Return to Game",
          onClick: () => window.location.href = `/games/${gameId}`
        }}
      />
    </>
  );
}
