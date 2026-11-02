# Asset Folders (`src/assets/`)

For convenience, static photos and music are served from:
- **Photos**: `public/photos/` (configured in `src/data/photos.ts`)
- **Background Music**: `public/music/` (configured in `src/data/configuration.ts`)
- **Sound Effects**: Synthesized in real-time via the browser's Web Audio API in `src/hooks/useBackgroundMusic.ts` (no external sound files required!).
