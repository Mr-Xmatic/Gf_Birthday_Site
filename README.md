# FOR YOUR EYES ONLY — PROJECT BB ❤️

A bespoke, mobile-first interactive birthday surprise experience crafted with React, TypeScript, Tailwind CSS, Framer Motion, and CSS 3D transforms.

---

## ✨ Experience Flow (All 10 Stages)

1. **Screen 1 — Mystery Landing Page**: Live countdown targeting **November 4, 2026 (`00:00:00` in `Africa/Douala`)**, paired with a playful dodging `"OPEN YOUR SURPRISE"` button that stays safely inside the viewport and rotates through teasing messages before her birthday.
2. **Screen 2 — Birthday Unlock**: Automatically unlocks at midnight on November 4 in `Africa/Douala` (or via the discreet `"Preview Nov 4 Birthday Unlock Now ✨"` button for testing), firing celebratory confetti and displaying `"HAPPY BIRTHDAY, MY BABY! ❤️🎂"`.
3. **Screen 3 — Password Verification**: Prompts for her birthday in `DD/MM/YYYY` format (`04/11/YYYY`). Wrong entries trigger `"Are you sure that's your birthday? 😂 Try again, baby."`, while the right date bursts floating hearts and transitions forward.
4. **Screen 4 — Three-Second Countdown**: Dramatic `3 → 2 → 1` scale & glow transition.
5. **Screen 5 — Quiz Introduction**: `"THE BB EXPERIENCE ❤️"` introduction screen.
6. **Screen 6 — Personalized Quiz**: 8 intimate, playful questions with progress bar, animated option cards, and 32 unique contextual responses (zero "wrong answer" states).
7. **Screen 7 — Quiz Completion Celebration**: Second major confetti celebration with `"HEY! SO YOU REALLY ARE MY BABY! ❤️"`.
8. **Screen 8 — 3D Photo Memory Gallery**: True CSS 3D circular photo carousel (`perspective` + `preserve-3d` + `rotateY` + `translateZ`) supporting mobile touch swipe, desktop drag, tap-to-front, fullscreen Lightbox view, and **3 hidden clickable secret hearts** that open romantic popup notes.
9. **Screen 9 — Interactive Love Letter**: Realistic 3D envelope stamped with her initials (`B.B.`) and a crimson-gold heart wax seal. Clicking `"OPEN YOUR LETTER ❤️"` shakes the envelope, breaks the seal, opens the flap, slides out the letter, and progressively writes the full letter in handwritten typography (`Caveat`), ending with `"YOUR X. ❤️"`.
10. **Screen 10 — Final Gift Reveal**: Progressive, cheeky cinematic reveal ending with `"Preferably with me. 😉❤️"` and `"I THINK I KNOW WHAT YOU MEAN... 😂"`.

---

## 📁 Where to Place Your Assets & Customize Content

### 1. Replace Placeholder Photographs
- Put your photos (`.jpg`, `.png`, `.webp`) in **`public/photos/`**.
- Open **[`src/data/photos.ts`](src/data/photos.ts)** and update the `src`, `caption`, `date`, and `locationOrMood` for each photo:
  ```ts
  {
    id: 'memory-1',
    src: '/photos/photo-1.jpg',
    caption: 'That smile that makes my entire world stop.',
    date: 'Favourite View',
  }
  ```

### 2. Replace Background Music
- Place your MP3 or WAV file in **`public/music/`** (for example, `public/music/our-song.mp3`).
- Open **[`src/data/configuration.ts`](src/data/configuration.ts)** and update `SITE_CONFIG.audio.backgroundMusicPath`:
  ```ts
  audio: {
    backgroundMusicPath: '/music/our-song.mp3',
    fallbackMusicTitle: 'Midnight Velvet — For BB',
    defaultVolume: 0.45,
    enableSoundEffects: true,
  }
  ```
- *(Note: A warm ambient `.wav` file is already generated at `public/music/romantic-theme.wav` so music works right away!)*

### 3. Customize Password, Names, Letter, or Final Reveal
- Open **[`src/data/configuration.ts`](src/data/configuration.ts)** to adjust:
  - `password` (e.g. `'04/11/2002'`)
  - `allowAnyYearOnBirthdayDayMonth` (set to `false` if you want to enforce her exact birth year strictly, or leave `true` so any `04/11/YYYY` passes)
  - `girlfriendNickname`, `envelopeInitials`, `senderSignature`
  - `loveLetterScreen` paragraphs and `finalRevealScreen` lines
- Open **[`src/data/quizQuestions.ts`](src/data/quizQuestions.ts)** to edit any of the 8 quiz questions, options, or personalized feedback messages.

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
npm run preview
```
