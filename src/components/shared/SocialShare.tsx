import { Facebook, Twitter, Linkedin, Share2, Copy, Check, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  compact?: boolean;
  vertical?: boolean;
  className?: string;
}

export function SocialShare({
  url = window.location.href,
  title,
  description = '',
  image = '',
  compact = false,
  vertical = false,
  className = '',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  // Platform-specific share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this game: ${url}`)}`;

  // Open share dialog in new window
  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Native share API for mobile devices
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url,
      })
        .catch((error) => console.error('Error sharing:', error));
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error('Error copying URL:', error));
  };

  // Container styles based on orientation
  const containerClass = `flex ${vertical ? 'flex-col space-y-2' : 'flex-row flex-wrap gap-2 sm:space-x-2'} ${className}`;

  // Button styles based on compact mode and screen size
  const buttonClass = compact
    ? 'w-8 h-8 p-0'
    : 'min-w-[36px] h-9 px-2.5 py-2 text-sm sm:text-base';

  const buttonTextClass = compact ? 'hidden' : 'ml-2';

  return (
    <div className={containerClass}>
      <TooltipProvider>
        {/* Facebook */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleShare(facebookShareUrl)}
              variant="outline"
              className={`${buttonClass} border-[#00f7ff]/20 text-blue-500 hover:text-blue-600 hover:bg-blue-50/10`}
              aria-label="Share on Facebook"
            >
              <Facebook className="h-4 w-4" />
              <span className={buttonTextClass}>Facebook</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>

        {/* Twitter / X */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleShare(twitterShareUrl)}
              variant="outline"
              className={`${buttonClass} border-[#00f7ff]/20 text-sky-400 hover:text-sky-500 hover:bg-sky-50/10`}
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
              <span className={buttonTextClass}>Twitter</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>

        {/* LinkedIn */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleShare(linkedinShareUrl)}
              variant="outline"
              className={`${buttonClass} border-[#00f7ff]/20 text-blue-600 hover:text-blue-700 hover:bg-blue-50/10`}
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              <span className={buttonTextClass}>LinkedIn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on LinkedIn</p>
          </TooltipContent>
        </Tooltip>

        {/* Email */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => window.location.href = emailShareUrl}
              variant="outline"
              className={`${buttonClass} border-[#00f7ff]/20 text-orange-500 hover:text-orange-600 hover:bg-orange-50/10`}
              aria-label="Share via Email"
            >
              <Mail className="h-4 w-4" />
              <span className={buttonTextClass}>Email</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share via Email</p>
          </TooltipContent>
        </Tooltip>

        {/* Native Share (mobile devices) */}
        {navigator.share && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleNativeShare}
                variant="outline"
                className={`${buttonClass} border-[#00f7ff]/20 text-[#00f7ff] hover:text-[#00f7ff] hover:bg-[#00f7ff]/10`}
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
                <span className={buttonTextClass}>Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Copy URL */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className={`${buttonClass} border-[#00f7ff]/20 text-[#00f7ff] hover:text-[#00f7ff] hover:bg-[#00f7ff]/10`}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className={buttonTextClass}>{copied ? 'Copied!' : 'Copy Link'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? 'Copied!' : 'Copy link'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
