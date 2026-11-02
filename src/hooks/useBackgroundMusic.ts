import { useState, useEffect, useRef, useCallback } from 'react';
import { SITE_CONFIG } from '../data/configuration';

export type SoundEffectType =
  | 'click'
  | 'dodge'
  | 'blow'
  | 'success'
  | 'error'
  | 'countdown'
  | 'confetti'
  | 'envelope'
  | 'secret';

export interface BackgroundMusicController {
  isPlaying: boolean;
  isMuted: boolean;
  hasInteracted: boolean;
  toggleMusic: () => void;
  startMusicOnInteraction: () => void;
  playSoundEffect: (type: SoundEffectType) => void;
}

const STORAGE_KEY = 'project_bb_music_pref';

export function useBackgroundMusic(): BackgroundMusicController {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'muted';
    } catch {
      return false;
    }
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const usingFallbackSynthRef = useRef<boolean>(false);
  const synthIntervalRef = useRef<number | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Gentle romantic ambient chord synth fallback if user hasn't dropped an MP3 yet or if audio file fails
  const startAmbientSynth = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || synthIntervalRef.current) return;

    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 349.23], // Fmaj7
      [196.0, 246.94, 293.66, 392.0],  // G6
    ];
    let chordIndex = 0;

    const playChord = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const now = audioCtxRef.current.currentTime;
      const notes = chords[chordIndex % chords.length];
      chordIndex++;

      notes.forEach((freq, idx) => {
        if (!audioCtxRef.current) return;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.022, now + idx * 0.18 + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 3.4);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 3.5);
      });
    };

    playChord();
    synthIntervalRef.current = window.setInterval(playChord, 3600);
  }, [getAudioContext]);

  const stopAmbientSynth = useCallback(() => {
    if (synthIntervalRef.current) {
      window.clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  // Initialize HTMLAudioElement once
  useEffect(() => {
    const audio = new Audio(SITE_CONFIG.audio.backgroundMusicPath);
    audio.loop = true;
    audio.volume = SITE_CONFIG.audio.defaultVolume;
    audio.preload = 'auto';

    const handleError = () => {
      usingFallbackSynthRef.current = true;
    };

    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      stopAmbientSynth();
    };
  }, [stopAmbientSynth]);

  const startMusicOnInteraction = useCallback(() => {
    setHasInteracted(true);
    if (isMuted || isPlaying) return;

    const audio = audioRef.current;
    if (audio && !usingFallbackSynthRef.current) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          usingFallbackSynthRef.current = true;
          startAmbientSynth();
          setIsPlaying(true);
        });
    } else {
      startAmbientSynth();
      setIsPlaying(true);
    }
  }, [isMuted, isPlaying, startAmbientSynth]);

  const toggleMusic = useCallback(() => {
    setHasInteracted(true);
    const audio = audioRef.current;

    if (isPlaying) {
      if (audio) audio.pause();
      stopAmbientSynth();
      setIsPlaying(false);
      setIsMuted(true);
      try {
        localStorage.setItem(STORAGE_KEY, 'muted');
      } catch {}
    } else {
      setIsMuted(false);
      try {
        localStorage.setItem(STORAGE_KEY, 'playing');
      } catch {}

      if (audio && !usingFallbackSynthRef.current) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            usingFallbackSynthRef.current = true;
            startAmbientSynth();
            setIsPlaying(true);
          });
      } else {
        startAmbientSynth();
        setIsPlaying(true);
      }
    }
  }, [isPlaying, startAmbientSynth, stopAmbientSynth]);

  const playSoundEffect = useCallback(
    (type: SoundEffectType) => {
      if (!SITE_CONFIG.audio.enableSoundEffects || isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      try {
        if (type === 'click') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.095);
        } else if (type === 'dodge') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.14);
        } else if (type === 'blow') {
          // Soft airy whoosh sound using filtered white noise
          const bufferSize = ctx.sampleRate * 0.14;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(420, now);
          filter.frequency.exponentialRampToValueAtTime(180, now + 0.13);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          whiteNoise.start(now);
          whiteNoise.stop(now + 0.14);
        } else if (type === 'error') {
          [240, 210].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.11);
            gain.gain.setValueAtTime(0.05, now + i * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.11);
            osc.stop(now + i * 0.11 + 0.11);
          });
        } else if (type === 'success' || type === 'secret') {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.075);
            gain.gain.setValueAtTime(0.045, now + i * 0.075);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.075 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.075);
            osc.stop(now + i * 0.075 + 0.36);
          });
        } else if (type === 'countdown') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(329.63, now);
          osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.35);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (type === 'confetti') {
          [523.25, 659.25, 783.99, 987.77, 1318.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);
            gain.gain.setValueAtTime(0.04, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.52);
          });
        } else if (type === 'envelope') {
          [392.0, 493.88, 587.33, 783.99].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.12);
            gain.gain.setValueAtTime(0.035, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.48);
          });
        }
      } catch {
        // Ignore audio errors if blocked by browser
      }
    },
    [getAudioContext, isMuted]
  );

  return {
    isPlaying,
    isMuted,
    hasInteracted,
    toggleMusic,
    startMusicOnInteraction,
    playSoundEffect,
  };
}
