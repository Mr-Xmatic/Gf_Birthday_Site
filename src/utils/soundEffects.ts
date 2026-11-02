import { SITE_CONFIG } from '../data/configuration';

export type SoundEffectType =
  | 'click'
  | 'dodge'
  | 'blow'
  | 'success'
  | 'error'
  | 'countdown'
  | 'confetti'
  | 'sparkle'
  | 'envelope'
  | 'secret'
  | 'pen'
  | 'gift-open';

const STORAGE_KEY = 'project_bb_music_pref';

let sharedAudioCtx: AudioContext | null = null;
let musicDuckCallback: ((durationMs: number, duckedVolume?: number) => void) | null = null;

export function registerMusicDucker(
  cb: ((durationMs: number, duckedVolume?: number) => void) | null
) {
  musicDuckCallback = cb;
}

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

function isAudioMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'muted';
  } catch {
    return false;
  }
}

function createNoiseBuffer(ctx: AudioContext, durationSec: number): AudioBuffer {
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Fires a realistic party-popper cannon pop at `startTime`
 */
function scheduleCannonPop(ctx: AudioContext, startTime: number, volume = 0.5) {
  // 1. Low-mid cannon thump (220Hz -> 58Hz)
  const thumpOsc = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  thumpOsc.type = 'triangle';
  thumpOsc.frequency.setValueAtTime(220, startTime);
  thumpOsc.frequency.exponentialRampToValueAtTime(58, startTime + 0.15);
  thumpGain.gain.setValueAtTime(volume, startTime);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
  thumpOsc.connect(thumpGain);
  thumpGain.connect(ctx.destination);
  thumpOsc.start(startTime);
  thumpOsc.stop(startTime + 0.17);

  // 2. Crisp paper-burst snap (bandpass noise burst)
  const snapSource = ctx.createBufferSource();
  snapSource.buffer = createNoiseBuffer(ctx, 0.1);
  const snapFilter = ctx.createBiquadFilter();
  snapFilter.type = 'bandpass';
  snapFilter.frequency.setValueAtTime(1500, startTime);
  snapFilter.Q.setValueAtTime(1.0, startTime);
  const snapGain = ctx.createGain();
  snapGain.gain.setValueAtTime(volume, startTime);
  snapGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.095);
  snapSource.connect(snapFilter);
  snapFilter.connect(snapGain);
  snapGain.connect(ctx.destination);
  snapSource.start(startTime);
  snapSource.stop(startTime + 0.1);
}

export function triggerSoundEffect(type: SoundEffectType): void {
  if (!SITE_CONFIG.audio.enableSoundEffects || isAudioMuted()) return;
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    if (type === 'click') {
      // Crisp tactile button pop (no music dip needed)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.07);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    } else if (type === 'dodge') {
      // Playful quick "boing-zip" slide (no music dip needed)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.17);
      gain.gain.setValueAtTime(0.34, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (type === 'blow') {
      // Realistic breathy wind puff for blowing out birthday cake candles
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = createNoiseBuffer(ctx, 0.26);

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(600, now);
      bandpass.frequency.exponentialRampToValueAtTime(240, now + 0.24);
      bandpass.Q.setValueAtTime(1.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.42, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 0.26);
    } else if (type === 'error') {
      // Playful double "uh-oh" tone
      [270, 200].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.13);
        gain.gain.setValueAtTime(0.32, now + i * 0.13);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.13 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.13);
        osc.stop(now + i * 0.13 + 0.13);
      });
    } else if (type === 'success') {
      // Uplifting romantic chord chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.065);
        gain.gain.setValueAtTime(0.28, now + i * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.065);
        osc.stop(now + i * 0.065 + 0.42);
      });
    } else if (type === 'secret') {
      // Magical music-box sparkle arpeggio for hidden gallery hearts
      [659.25, 830.61, 987.77, 1318.51, 1661.22].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.26, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.48);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.5);
      });
    } else if (type === 'countdown') {
      // Very gentle, barely noticeable softening of the song (from 0.42 to 0.29)
      // while boosting the countdown chime itself so the song's groove never dips!
      musicDuckCallback?.(950, 0.29);

      // 1. Punchy cinematic impact drum (280Hz -> 75Hz triangle)
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boom.type = 'triangle';
      boom.frequency.setValueAtTime(280, now);
      boom.frequency.exponentialRampToValueAtTime(75, now + 0.36);
      boomGain.gain.setValueAtTime(0.62, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      boom.connect(boomGain);
      boomGain.connect(ctx.destination);
      boom.start(now);
      boom.stop(now + 0.42);

      // 2. Bright, crystal-clear countdown chime (880Hz + 1318.5Hz + 1760Hz) that sits clearly above the music
      [880, 1318.51, 1760].forEach((freq, idx) => {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = idx === 0 ? 'triangle' : 'sine';
        chime.frequency.setValueAtTime(freq, now);
        const peak = idx === 0 ? 0.52 : idx === 1 ? 0.32 : 0.28;
        chimeGain.gain.setValueAtTime(peak, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now);
        chime.stop(now + 0.4);
      });

      // 3. Sharp clockwork transient tick at t = 0
      const tickNoise = ctx.createBufferSource();
      tickNoise.buffer = createNoiseBuffer(ctx, 0.035);
      const tickFilter = ctx.createBiquadFilter();
      tickFilter.type = 'bandpass';
      tickFilter.frequency.setValueAtTime(2400, now);
      const tickGain = ctx.createGain();
      tickGain.gain.setValueAtTime(0.42, now);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);
      tickNoise.connect(tickFilter);
      tickFilter.connect(tickGain);
      tickGain.connect(ctx.destination);
      tickNoise.start(now);
      tickNoise.stop(now + 0.035);
    } else if (type === 'confetti') {
      // Gentle, subtle softening (0.42 -> 0.31) so the song keeps flowing naturally
      musicDuckCallback?.(900, 0.31);

      // 1. Dual party-popper cannon pops ("POP! ... POP!")
      scheduleCannonPop(ctx, now, 0.52);
      scheduleCannonPop(ctx, now + 0.22, 0.44);

      // 2. Shimmering confetti flutter noise
      const flutter = ctx.createBufferSource();
      flutter.buffer = createNoiseBuffer(ctx, 0.7);
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(3000, now + 0.05);
      const flutterGain = ctx.createGain();
      flutterGain.gain.setValueAtTime(0.001, now);
      flutterGain.gain.linearRampToValueAtTime(0.16, now + 0.08);
      flutterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);
      flutter.connect(hp);
      hp.connect(flutterGain);
      flutterGain.connect(ctx.destination);
      flutter.start(now);
      flutter.stop(now + 0.7);

      // 3. Grand celebratory fanfare chime cascade
      const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = now + 0.04 + i * 0.065;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.62);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.64);
      });
    } else if (type === 'sparkle') {
      // Delicate fairy-dust sparkle chime (no music dip needed)
      [783.99, 987.77, 1174.66, 1567.98, 1975.53].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + i * 0.055;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.36);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.38);
      });
    } else if (type === 'envelope') {
      // Very subtle softening (0.42 -> 0.32) while the wax seal cracks & harp plays
      musicDuckCallback?.(1800, 0.32);

      // Stage A (now + 0.52s): Wax seal crack/pop
      scheduleCannonPop(ctx, now + 0.52, 0.34);

      // Stage B (now + 1.02s): Crisp parchment paper slide
      const paperSlide = ctx.createBufferSource();
      paperSlide.buffer = createNoiseBuffer(ctx, 0.34);
      const paperFilter = ctx.createBiquadFilter();
      paperFilter.type = 'bandpass';
      paperFilter.frequency.setValueAtTime(1800, now + 1.02);
      paperFilter.frequency.exponentialRampToValueAtTime(900, now + 1.34);
      const paperGain = ctx.createGain();
      paperGain.gain.setValueAtTime(0.001, now + 1.02);
      paperGain.gain.linearRampToValueAtTime(0.26, now + 1.1);
      paperGain.gain.exponentialRampToValueAtTime(0.001, now + 1.35);
      paperSlide.connect(paperFilter);
      paperFilter.connect(paperGain);
      paperGain.connect(ctx.destination);
      paperSlide.start(now + 1.02);
      paperSlide.stop(now + 1.36);

      // Stage C (now + 1.55s): Warm romantic harp glissando as letter emerges
      [392.0, 493.88, 587.33, 739.99, 783.99, 987.77, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = now + 1.55 + i * 0.08;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.58);
      });
    } else if (type === 'gift-open') {
      // Very subtle softening (0.42 -> 0.32) while the gift box opens
      musicDuckCallback?.(1900, 0.32);

      // 1. Subtle box rattle (now + 0.08s & 0.24s)
      scheduleCannonPop(ctx, now + 0.08, 0.24);
      scheduleCannonPop(ctx, now + 0.24, 0.28);

      // 2. Magical rising angelic chord arpeggio (now + 0.85s -> 2.4s)
      const shimmerNotes = [
        392.0, 493.88, 587.33, 783.99, 987.77, 1174.66, 1567.98, 1975.53,
      ];
      shimmerNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = now + 0.85 + i * 0.14;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.26, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.88);
      });
    } else if (type === 'pen') {
      // Soft fountain-pen-on-parchment tick during handwriting simulation
      const penNoise = ctx.createBufferSource();
      penNoise.buffer = createNoiseBuffer(ctx, 0.024);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400 + Math.random() * 600, now);
      filter.Q.setValueAtTime(2.0, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.075, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);
      penNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      penNoise.start(now);
      penNoise.stop(now + 0.024);
    }
  } catch {
    // Ignore audio context errors if blocked by browser
  }
}
