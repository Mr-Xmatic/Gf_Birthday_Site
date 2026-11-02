import { useState, useEffect, useRef, useCallback } from 'react';
import { SITE_CONFIG } from '../data/configuration';
import {
  SoundEffectType,
  triggerSoundEffect,
  registerMusicDucker,
} from '../utils/soundEffects';

export type { SoundEffectType };

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
  const duckTimeoutRef = useRef<number | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      [220.0, 261.63, 329.63, 392.0], // Am7
      [174.61, 220.0, 261.63, 349.23], // Fmaj7
      [196.0, 246.94, 293.66, 392.0], // G6
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

  // Initialize HTMLAudioElement once and wire up smooth, gentle volume ramping
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

    const smoothVolumeTo = (targetVol: number, durationMs = 180) => {
      const el = audioRef.current;
      if (!el) return;
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      const startVol = el.volume;
      const diff = targetVol - startVol;
      if (Math.abs(diff) < 0.01) {
        el.volume = targetVol;
        return;
      }

      const steps = Math.max(4, Math.floor(durationMs / 20));
      let currentStep = 0;

      fadeIntervalRef.current = window.setInterval(() => {
        currentStep++;
        if (!audioRef.current) return;
        if (currentStep >= steps) {
          audioRef.current.volume = targetVol;
          if (fadeIntervalRef.current) {
            window.clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        } else {
          audioRef.current.volume = Math.max(
            0,
            Math.min(1, startVol + (diff * currentStep) / steps)
          );
        }
      }, 20);
    };

    registerMusicDucker((durationMs: number, duckedVolume = 0.3) => {
      const el = audioRef.current;
      if (!el) return;

      // Never drop below 70% of normal song volume so the music flow never feels interrupted
      const safeFloor = SITE_CONFIG.audio.defaultVolume * 0.7;
      const targetDuck = Math.max(safeFloor, duckedVolume);

      smoothVolumeTo(targetDuck, 120);

      if (duckTimeoutRef.current) {
        window.clearTimeout(duckTimeoutRef.current);
      }
      duckTimeoutRef.current = window.setTimeout(() => {
        smoothVolumeTo(SITE_CONFIG.audio.defaultVolume, 260);
        duckTimeoutRef.current = null;
      }, durationMs);
    });

    return () => {
      registerMusicDucker(null);
      if (duckTimeoutRef.current) {
        window.clearTimeout(duckTimeoutRef.current);
      }
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
      }
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
      if (isMuted) return;
      triggerSoundEffect(type);
    },
    [isMuted]
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
