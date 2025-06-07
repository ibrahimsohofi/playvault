# Multiple AdBlueMedia Lockers Configuration Guide

## Overview
This guide shows how to configure different AdBlueMedia lockers for different games. Each game can have its own unique:
- Configuration variables
- Script sources
- Function names (like `_iH()`, `_VR()`, etc.)

## How It Works

### Dynamic Script Loading
The system dynamically loads the correct AdBlueMedia scripts for each game when the user tries to download it. This means:
- ✅ Each game has its own unique locker
- ✅ Scripts are loaded only when needed
- ✅ No conflicts between different configurations
- ✅ Easy to add new games with new lockers

## Adding a New Game with AdBlueMedia Locker

### Step 1: Get Your AdBlueMedia Configuration
When you create a new locker in AdBlueMedia, you'll get something like:

```html
<!-- Example for Game A -->
<script type="text/javascript">
    var nUtRu_QzT_cplrFc={"it":4503226,"key":"bbe8f"};
</script>
<script src="https://dfmpe7igjx4jo.cloudfront.net/420ad58.js"></script>
<!-- Function: _iH() -->

<!-- Example for Game B -->
<script type="text/javascript">
    var nCsyH_pTk_eiPFic={"it":4507559,"key":"6407a"};
</script>
<script src="https://dfmpe7igjx4jo.cloudfront.net/965d84f.js"></script>
<!-- Function: _VR() -->
```

### Step 2: Add Configuration to lockerConfig.ts

Open `src/data/lockerConfig.ts` and add your game to `GAME_ADBLUE_CONFIGS`:

```typescript
export const GAME_ADBLUE_CONFIGS: Record<string, AdBlueMediaConfig> = {
  // Existing games...
  "gta-san-andreas": {
    variable: "nUtRu_QzT_cplrFc",
    it: 4503226,
    key: "bbe8f",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/420ad58.js",
    functionName: "_iH"
  },

  "fifa-24": {
    variable: "nCsyH_pTk_eiPFic",
    it: 4507559,
    key: "6407a",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/965d84f.js",
    functionName: "_VR"
  },

  // ADD YOUR NEW GAME HERE:
  "your-new-game-id": {
    variable: "nXXX_XXX_XXXXX",    // From your AdBlueMedia config
    it: 1234567,                   // Your "it" value
    key: "xxxxx",                  // Your "key" value
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/xxxxxx.js", // Your script URL
    functionName: "_ABC"           // Your function name
  },
};
```

### Step 3: Add Game Data

Add your game to `src/data/gameData.ts`:

```typescript
{
  id: "your-new-game-id",  // Must match the ID in lockerConfig.ts
  title: "Your Game Title",
  category: "action",
  description: "Game description...",
  // ... other game properties
}
```

### Step 4: Add Download URL

Add the download URL to `DOWNLOAD_URLS` in `lockerConfig.ts`:

```typescript
export const DOWNLOAD_URLS: Record<string, string> = {
  // ... existing URLs
  "your-new-game-id": "https://your-download-url.com/game.apk",
};
```

## Example: Adding 3 Different Games

```typescript
export const GAME_ADBLUE_CONFIGS: Record<string, AdBlueMediaConfig> = {
  // Game 1 - Uses _iH() function
  "clash-of-clans": {
    variable: "nUtRu_QzT_cplrFc",
    it: 4503226,
    key: "bbe8f",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/420ad58.js",
    functionName: "_iH"
  },

  // Game 2 - Uses _VR() function
  "free-fire": {
    variable: "nCsyH_pTk_eiPFic",
    it: 4507559,
    key: "6407a",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/965d84f.js",
    functionName: "_VR"
  },

  // Game 3 - Uses _XY() function
  "pubg-mobile": {
    variable: "nABC_DEF_GHIJK",
    it: 9876543,
    key: "xyz123",
    scriptSrc: "https://dfmpe7igjx4jo.cloudfront.net/abcdef.js",
    functionName: "_XY"
  },
};
```

## How Different Configurations Work

When a user clicks download on different games:

### Game 1 (clash-of-clans):
1. System loads `420ad58.js` script
2. Creates variable `nUtRu_QzT_cplrFc={"it":4503226,"key":"bbe8f"}`
3. Calls `_iH()` function to open locker

### Game 2 (free-fire):
1. System loads `965d84f.js` script
2. Creates variable `nCsyH_pTk_eiPFic={"it":4507559,"key":"6407a"}`
3. Calls `_VR()` function to open locker

### Game 3 (pubg-mobile):
1. System loads `abcdef.js` script
2. Creates variable `nABC_DEF_GHIJK={"it":9876543,"key":"xyz123"}`
3. Calls `_XY()` function to open locker

## Benefits of This Approach

✅ **Isolation**: Each game has its own completely separate locker
✅ **No Conflicts**: Scripts don't interfere with each other
✅ **Dynamic Loading**: Only loads scripts when needed
✅ **Easy Management**: Simple configuration per game
✅ **Scalable**: Add unlimited games with different lockers
✅ **Clean**: No leftover scripts from other games

## Troubleshooting

### If a Game's Locker Doesn't Work:

1. **Check Configuration**: Verify all values in `lockerConfig.ts` match your AdBlueMedia setup
2. **Check Function Name**: Make sure `functionName` matches what AdBlueMedia provides
3. **Check Script URL**: Verify the `scriptSrc` URL is correct
4. **Check Console**: Look for JavaScript errors in browser console
5. **Test Variables**: Check if the configuration variable is created correctly

### Common Issues:

- **"Function not available"**: Script didn't load or function name is wrong
- **"Failed to load script"**: Script URL is incorrect or blocked
- **"Configuration not loaded"**: Variable name or values are incorrect

## Testing Your Configuration

1. Add your configuration to `lockerConfig.ts`
2. Navigate to your game's page
3. Click "Download"
4. Check browser console for loading messages
5. Verify the correct function is called

The system will show which locker function is being used in the dialog, making it easy to debug.
