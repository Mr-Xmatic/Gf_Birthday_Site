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
function scheduleCannonPop(ctx: AudioContext, startTime: number, volume = 0.22) {
  // 1. Low-mid cannon thump (170Hz -> 42Hz)
  const thumpOsc = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(175, startTime);
  thumpOsc.frequency.exponentialRampToValueAtTime(42, startTime + 0.14);
  thumpGain.gain.setValueAtTime(volume, startTime);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
  thumpOsc.connect(thumpGain);
  thumpGain.connect(ctx.destination);
  thumpOsc.start(startTime);
  thumpOsc.stop(startTime + 0.16);

  // 2. Crisp paper-burst snap (bandpass noise burst)
  const snapSource = ctx.createBufferSource();
  snapSource.buffer = createNoiseBuffer(ctx, 0.09);
  const snapFilter = ctx.createBiquadFilter();
  snapFilter.type = 'bandpass';
  snapFilter.frequency.setValueAtTime(1400, startTime);
  snapFilter.Q.setValueAtTime(1.2, startTime);
  const snapGain = ctx.createGain();
  snapGain.gain.setValueAtTime(volume * 0.95, startTime);
  snapGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.085);
  snapSource.connect(snapFilter);
  snapFilter.connect(snapGain);
  snapGain.connect(ctx.destination);
  snapSource.start(startTime);
  snapSource.stop(startTime + 0.09);
}

export function triggerSoundEffect(type: SoundEffectType): void {
  if (!SITE_CONFIG.audio.enableSoundEffects || isAudioMuted()) return;
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    if (type === 'click') {
      // Crisp, warm tactile button pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.065);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'dodge') {
      // Playful quick "boing-zip" slide when the button dodges her finger
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(310, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'blow') {
      // Realistic breathy wind puff for blowing out birthday cake candles
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = createNoiseBuffer(ctx, 0.24);

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(520, now);
      bandpass.frequency.exponentialRampToValueAtTime(210, now + 0.22);
      bandpass.Q.setValueAtTime(1.4, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

      noiseSource.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 0.24);
    } else if (type === 'error') {
      // Playful double "uh-oh" tone
      [250, 195].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.13);
        gain.gain.setValueAtTime(0.14, now + i * 0.13);
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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.065);
        gain.gain.setValueAtTime(0.12, now + i * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.065);
        osc.stop(now + i * 0.065 + 0.4);
      });
    } else if (type === 'secret') {
      // Magical music-box sparkle arpeggio for hidden gallery hearts
      [659.25, 830.61, 987.77, 1318.51, 1661.22].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.11, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.46);
      });
    } else if (type === 'countdown') {
      // Cinematic heartbeat thump + crystal chime tick for 3 -> 2 -> 1
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(130, now);
      boom.frequency.exponentialRampToValueAtTime(42, now + 0.32);
      boomGain.gain.setValueAtTime(0.24, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      boom.connect(boomGain);
      boomGain.connect(ctx.destination);
      boom.start(now);
      boom.stop(now + 0.36);

      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(880, now);
      chimeGain.gain.setValueAtTime(0.09, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(now);
      chime.stop(now + 0.19);
    } else if (type === 'confetti') {
      // 1. Dual party-popper cannon pops ("POP! ... POP!")
      scheduleCannonPop(ctx, now, 0.25);
      scheduleCannonPop(ctx, now + 0.22, 0.2);

      // 2. Shimmering confetti flutter noise
      const flutter = ctx.createBufferSource();
      flutter.buffer = createNoiseBuffer(ctx, 0.65);
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(3200, now + 0.05);
      const flutterGain = ctx.createGain();
      flutterGain.gain.setValueAtTime(0.001, now);
      flutterGain.gain.linearRampToValueAtTime(0.07, now + 0.08);
      flutterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      flutter.connect(hp);
      hp.connect(flutterGain);
      flutterGain.connect(ctx.destination);
      flutter.start(now);
      flutter.stop(now + 0.66);

      // 3. Grand celebratory fanfare chime cascade
      const notes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = now + 0.04 + i * 0.065;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.13, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.62);
      });
    } else if (type === 'sparkle') {
      // Delicate fairy-dust sparkle chime
      [783.99, 987.77, 1174.66, 1567.98, 1975.53].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + i * 0.055;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.36);
      });
    } else if (type === 'envelope') {
      // Multi-stage sound synchronized with the envelope opening animation:
      // Stage A (now + 0.52s): Wax seal crack/pop
      scheduleCannonPop(ctx, now + 0.52, 0.14);

      // Stage B (now + 1.02s): Crisp parchment paper slide
      const paperSlide = ctx.createBufferSource();
      paperSlide.buffer = createNoiseBuffer(ctx, 0.32);
      const paperFilter = ctx.createBiquadFilter();
      paperFilter.type = 'bandpass';
      paperFilter.frequency.setValueAtTime(1800, now + 1.02);
      paperFilter.frequency.exponentialRampToValueAtTime(900, now + 1.32);
      const paperGain = ctx.createGain();
      paperGain.gain.setValueAtTime(0.001, now + 1.02);
      paperGain.gain.linearRampToValueAtTime(0.11, now + 1.1);
      paperGain.gain.exponentialRampToValueAtTime(0.001, now + 1.33);
      paperSlide.connect(paperFilter);
      paperFilter.connect(paperGain);
      paperGain.connect(ctx.destination);
      paperSlide.start(now + 1.02);
      paperSlide.stop(now + 1.34);

      // Stage C (now + 1.55s): Warm romantic harp glissando as letter emerges
      [392.0, 493.88, 587.33, 739.99, 783.99, 987.77, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + 1.55 + i * 0.08;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.095, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.56);
      });
    } else if (type === 'gift-open') {
      // Luxury gift box shake + ribbon release + celestial shimmer as the 3D bracelet rises
      // 1. Subtle box rattle (now + 0.08s & 0.24s)
      scheduleCannonPop(ctx, now + 0.08, 0.09);
      scheduleCannonPop(ctx, now + 0.24, 0.11);

      // 2. Magical rising angelic chord arpeggio (now + 0.9s -> 2.4s)
      const shimmerNotes = [
        392.0, 493.88, 587.33, 783.99, 987.77, 1174.66, 1567.98, 1975.53,
      ];
      shimmerNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t = now + 0.85 + i * 0.14;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.11, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.88);
      });
    } else if (type === 'pen') {
      // Soft fountain-pen-on-parchment tick during handwriting simulation
      const penNoise = ctx.createBufferSource();
      penNoise.buffer = createNoiseBuffer(ctx, 0.022);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400 + Math.random() * 600, now);
      filter.Q.setValueAtTime(2.5, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.032, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      penNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      penNoise.start(now);
      penNoise.stop(now + 0.022);
    }
  } catch {
    // Ignore audio context errors if blocked by browser
  }
}
