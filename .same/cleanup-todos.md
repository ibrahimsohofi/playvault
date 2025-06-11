# PlayVault Cleanup Plan

## Files to Remove 🗑️

### 1. Duplicate/Legacy Files ✅ COMPLETED
- [x] `src/App.tsx.decoded` - Appears to be a backup/decoded version
- [x] `dist_copy/` - Entire directory (build artifacts, should be regenerated)
- [x] `tsconfig.tsbuildinfo` - TypeScript build cache file

### 2. Unused Game Images (if not referenced)
- [ ] Review and remove unused game screenshots in `public/images/games/screenshots/`
- [ ] Remove duplicate game images that aren't being used

### 3. Documentation Files (keep essential ones) ✅ COMPLETED
- [x] `ADBLUE_INTEGRATION.md` - Moved to .same folder
- [x] `GAME_IMAGES_INSTRUCTIONS.md` - Moved to .same folder
- [x] `MULTIPLE_LOCKERS_GUIDE.md` - Moved to .same folder
- [x] `SEARCH_ENGINE_SETUP.md` - Moved to .same folder
- [x] `SEO_AUDIT_REPORT.md` - Moved to .same folder
- [x] `bundle-analysis.md` - Moved to .same folder

### 4. Testing Files (if not actively used)
- [ ] Review test files in `src/test/` directory
- [ ] Remove unused test utilities

### 5. Unused Assets ✅ COMPLETED
- [x] `public/images/games/dl.py` - Python download script
- [x] `public/images/games/dlpy.txt` and `ff.txt` - Text files
- [ ] Unused favicon files if multiple exist

### 6. Build/Cache Files ✅ COMPLETED
- [x] `package-lock.json` - Using bun, so npm lock file not needed
- [ ] Any `.cache` directories

## Keep These Files ✅
- All active source code in `src/`
- Essential config files (package.json, vite.config.ts, etc.)
- Active game images that are referenced
- README.md and essential documentation
- .same folder for project management

## Estimated Space Savings
- dist_copy directory: ~90MB
- Unused game images: ~50MB
- Legacy files and docs: ~5MB
- Total: ~145MB savings
