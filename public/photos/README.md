# Adding Your Own Photographs (`PROJECT BB`)

## Quick Steps
1. Drop your photographs (`.jpg`, `.jpeg`, `.png`, `.webp`) into:
   - **`public/photos/`** (Recommended — served directly at `/photos/your-photo.jpg`)
2. Open [`src/data/photos.ts`](../../src/data/photos.ts) and update the `src`, `caption`, `date`, and `locationOrMood` fields for each memory.

### Example (`src/data/photos.ts`)
```ts
export const MEMORY_PHOTOS: MemoryPhoto[] = [
  {
    id: 'memory-1',
    src: '/photos/our-first-date.jpg',
    caption: 'That smile that makes my entire world stop.',
    date: 'Favourite View',
    locationOrMood: 'Golden Hour Glow',
  },
  // ...
];
```
