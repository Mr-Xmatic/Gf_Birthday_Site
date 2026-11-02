# Adding Your Background Music (`PROJECT BB`)

## Quick Steps
1. Place your romantic song file (e.g. `romantic-theme.mp3` or `romantic-theme.wav`) inside:
   - **`public/music/`**
2. If your file is named `romantic-theme.mp3`, open [`src/data/configuration.ts`](../../src/data/configuration.ts) and set:
   ```ts
   audio: {
     backgroundMusicPath: '/music/romantic-theme.mp3',
     fallbackMusicTitle: 'Midnight Velvet — For BB',
     defaultVolume: 0.45,
     enableSoundEffects: true,
   }
   ```
3. Note: A warm romantic ambient `.wav` loop (`public/music/romantic-theme.wav`) and a built-in Web Audio API synthesizer are already included out-of-the-box so the music player works immediately!
