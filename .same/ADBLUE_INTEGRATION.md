# AdBlueMedia Integration Documentation

## Overview
This document explains how the new AdBlueMedia integration works in PlayVault using your provided configuration.

## Integration Details

### 1. Scripts Added to HTML Head
The following scripts have been added to `index.html`:

```html
<!-- AdBlueMedia Content Locker Scripts -->
<script type="text/javascript">
    var nUtRu_QzT_cplrFc={"it":4503226,"key":"bbe8f"};
</script>
<script src="https://dfmpe7igjx4jo.cloudfront.net/420ad58.js"></script>
```

### 2. New Locker Component
Created `NewAdBlueMediaLocker.tsx` that uses the `_iH()` function as specified in your integration instructions.

### 3. Configuration Updates
Updated `lockerConfig.ts` to support:
- Your provided configuration (`it: 4503226, key: "bbe8f"`)
- Individual campaign IDs per game (optional)
- Backward compatibility with existing setup

## How It Works

### User Flow:
1. User clicks "Download" on a game
2. `NewAdBlueMediaLocker` component opens
3. Component calls `window._iH()` to open AdBlueMedia offer
4. User completes offer in new window/popup
5. On completion, user is redirected to game download

### Key Features:
- ✅ Uses your exact AdBlueMedia configuration
- ✅ Calls `_iH()` function as specified
- ✅ Supports individual campaign IDs per game
- ✅ Enhanced ad blocker detection
- ✅ Better error handling and user guidance
- ✅ Mobile responsive design

## Configuration Options

### Global Configuration (lockerConfig.ts):
```typescript
export const ADBLUE_CONFIG = {
  it: 4503226,      // Your provided "it" value
  key: "bbe8f",     // Your provided "key" value
  defaultCampaignId: "cee9bbd"  // Default campaign ID
};
```

### Per-Game Campaign IDs (Optional):
```typescript
export const GAME_CAMPAIGN_IDS: Record<string, string> = {
  "clash-of-clans": "specific-campaign-id-1",
  "free-fire": "specific-campaign-id-2",
  // Add more as needed
};
```

## Testing the Integration

### To Test:
1. Navigate to any game page
2. Click the "Download" button
3. The new locker dialog should open
4. It will attempt to call `_iH()` to open the AdBlueMedia offer

### Debug Information:
- Check browser console for logs
- Look for "Opening AdBlueMedia locker for game: [gameId]"
- Verify `window._iH` function is available

## Completion Detection

The current implementation expects completion to be handled through:
1. AdBlueMedia's built-in redirect mechanism, OR
2. PostMessage events with `type: 'adblue_completion'`

You may need to adjust the completion detection based on how your specific AdBlueMedia setup sends completion events.

## Next Steps

### If Testing Shows Issues:
1. Check if `_iH()` function is properly loaded
2. Verify the AdBlueMedia scripts are loading correctly
3. Adjust completion detection logic if needed
4. Test different browsers and devices

### To Add More Games:
1. Add game data to `gameData.ts`
2. Add download URL to `DOWNLOAD_URLS` in `lockerConfig.ts`
3. Optionally add specific campaign ID to `GAME_CAMPAIGN_IDS`

## Troubleshooting

### Common Issues:
- **"Locker system is loading"**: AdBlueMedia scripts haven't loaded yet
- **Ad blocker detected**: User needs to disable ad blocker
- **`_iH is not a function`**: Scripts failed to load or are blocked

### Solutions:
- Ensure scripts load before user interactions
- Provide clear ad blocker disable instructions
- Add retry mechanisms for script loading failures

## Files Modified
- `index.html` - Added AdBlueMedia scripts
- `src/data/lockerConfig.ts` - Updated configuration
- `src/components/shared/NewAdBlueMediaLocker.tsx` - New locker component
- `src/components/resources/ResourceLibrary.tsx` - Updated to use new locker
- `src/pages/GameDetailPage.tsx` - Updated to use new locker
