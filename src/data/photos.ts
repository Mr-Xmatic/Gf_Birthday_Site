export interface MemoryPhoto {
  id: string;
  /**
   * Place your photos, GIFs, or looping MP4 clips inside `public/photos/`
   * and reference them here as `/photos/your-file.mp4` or `/photos/your-file.gif`.
   */
  src: string;
  caption?: string;
  date?: string;
  locationOrMood?: string;
}

export const MEMORY_PHOTOS: MemoryPhoto[] = [
  {
    id: 'memory-1',
    src: '/photos/tiktok_1791209986816_1.mp4',
    caption: 'That smile that makes my entire world stop.',
    date: 'Favourite View',
    locationOrMood: 'Golden Hour Glow',
  },
  {
    id: 'memory-2',
    src: '/photos/VID-20261021-WA0004_1.mp4',
    caption: 'When you pretend to be serious for 3 seconds before laughing.',
    date: 'Inside Joke',
    locationOrMood: 'Pure Happiness',
  },
  {
    id: 'memory-3',
    src: '/photos/VID-20261022-WA0055_1.mp4',
    caption: 'Former president of the anti-love club, caught in 4K.',
    date: 'Plot Twist ❤️',
    locationOrMood: 'Unstoppable Us',
  },
  {
    id: 'memory-4',
    src: '/photos/VID-20261022-WA0060_1.mp4',
    caption: 'Effortlessly stunning. Honestly unfair to the rest of us.',
    date: 'Main Character',
    locationOrMood: 'Soft Luxury',
  },
  {
    id: 'memory-5',
    src: '/photos/VID-20261022-WA0062_1.mp4',
    caption: 'Late night talks, soft whispers, and holding you close.',
    date: 'Midnight Moments',
    locationOrMood: 'Safe Place',
  },
  {
    id: 'memory-6',
    src: '/photos/VID-20261026-WA0107_1.mp4',
    caption: 'Even when we are both being stubborn, I still adore you.',
    date: 'Partners in Crime',
    locationOrMood: 'Zero Surrender 😂',
  },
  {
    id: 'memory-7',
    src: '/photos/VID-20261101-WA0021_1.mp4',
    caption: 'Every glance, every tease, every stolen kiss.',
    date: 'Just Us Two',
    locationOrMood: 'Chemistry',
  },
  {
    id: 'memory-8',
    src: '/photos/VID-20261101-WA0022_1.mp4',
    caption: 'Here is to a thousand more memories together, my baby.',
    date: 'November 4 ❤️',
    locationOrMood: 'Forever My Girl',
  },
];
