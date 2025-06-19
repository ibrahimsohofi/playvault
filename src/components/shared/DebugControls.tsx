import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Unlock, Settings, Bug } from 'lucide-react';

interface DebugControlsProps {
  className?: string;
}

export function DebugControls({ className }: DebugControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';

  if (!isDevelopment) {
    return null;
  }

  const clearDebugData = () => {
    // Clear all unlocked games
    const allKeys = Object.keys(localStorage);
    for (const key of allKeys) {
      if (key.startsWith('unlocked_')) {
        localStorage.removeItem(key);
      }
    }

    window.location.reload();
  };

  const unlockAllGames = () => {
    const games = [
      'clash-of-clans',
      'free-fire',
      'pubg-mobile',
      'gta-san-andreas',
      'fifa-24',
      'call-of-duty-mw3',
      'truck-simulator-ultimate',
      'need-for-speed-unbound',
      'gta-trilogy-definitive',
      'carx-street',
      'clash-royale',
      'candy-crush',
      'pokemon-go',
      'subway-surfers',
      'genshin-impact',
      'roblox',
      'among-us',
      'minecraft',
      'baseball-9'
    ];

    for (const gameId of games) {
      localStorage.setItem(`unlocked_${gameId}`, 'true');
    }

    alert('All games unlocked!');
  };



  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {isExpanded ? (
        <div className="bg-black/90 border border-cyan-500/30 rounded-lg p-4 min-w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Debug Controls</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0 text-cyan-400 hover:bg-cyan-400/10"
            >
              ×
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={unlockAllGames}
              className="w-full text-xs"
            >
              <Unlock className="h-3 w-3 mr-1" />
              Unlock All Games
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={clearDebugData}
              className="w-full text-xs"
            >
              Clear Debug Data
            </Button>
          </div>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(true)}
          className="bg-black/80 border-cyan-500/30 text-cyan-400 hover:bg-cyan-400/10"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
