import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '../../data/configuration';

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isPlaying,
  onToggle,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnmutedOnce, setHasUnmutedOnce] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setHasUnmutedOnce(true);
      const timer = window.setTimeout(() => {
        setIsMinimized(true);
      }, 1200);
      return () => window.clearTimeout(timer);
    } else {
      setIsMinimized(false);
    }
  }, [isPlaying]);

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex flex-col items-end gap-2">
      <motion.button
        type="button"
        layout
        onClick={onToggle}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isPlaying ? 'Pause background music' : 'Unmute background music'}
        title={isPlaying ? 'Hold My Hand • Tap to pause' : 'Tap to play music'}
        className={`flex items-center justify-center rounded-full glass-card text-ivory shadow-romantic transition-colors cursor-pointer overflow-hidden ${
          isPlaying
            ? isMinimized
              ? 'w-9 h-9 sm:w-10 sm:h-10 p-0 border border-champagne/40 bg-burgundy-deep/75 hover:border-champagne/80'
              : 'gap-2 px-3.5 py-2 border border-champagne/45 bg-burgundy-deep/85'
            : 'gap-2 px-3.5 py-2 border-2 border-champagne shadow-gold-glow bg-burgundy-mid/90'
        }`}
      >
        {isPlaying && isMinimized ? (
          /* Compact Minimized Circle: Equalizer Bars Only */
          <div className="flex items-end justify-center gap-0.5 h-3.5" aria-hidden="true">
            <span className="w-0.5 bg-champagne rounded-full eq-bar-1" />
            <span className="w-0.5 bg-rose rounded-full eq-bar-2" />
            <span className="w-0.5 bg-champagne rounded-full eq-bar-3" />
          </div>
        ) : (
          <>
            <div
              className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full shrink-0 ${
                isPlaying ? 'bg-rose/25 text-champagne' : 'bg-champagne text-burgundy-deep'
              }`}
            >
              {isPlaying ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-champagne" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-burgundy-deep" />
              )}
            </div>

            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5 px-0.5" aria-hidden="true">
                <span className="w-0.5 bg-champagne rounded-full eq-bar-1" />
                <span className="w-0.5 bg-rose rounded-full eq-bar-2" />
                <span className="w-0.5 bg-champagne rounded-full eq-bar-3" />
              </div>
            ) : (
              <Music className="w-3.5 h-3.5 text-champagne shrink-0" />
            )}

            <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-ivory whitespace-nowrap pr-1">
              {isPlaying ? 'Hold My Hand' : 'Tap to Unmute 🎵'}
            </span>
          </>
        )}
      </motion.button>

      {/* Prominent Romantic Prompt Only Before First Unmute */}
      <AnimatePresence>
        {!isPlaying && !hasUnmutedOnce && (
          <motion.button
            type="button"
            onClick={onToggle}
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ duration: 0.35 }}
            className="max-w-[235px] sm:max-w-xs text-right px-3.5 py-2 rounded-2xl bg-gradient-to-r from-burgundy-deep/95 via-burgundy-mid/95 to-burgundy-deep/95 border border-champagne/65 shadow-gold-glow flex items-center gap-2 cursor-pointer hover:border-champagne transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-champagne shrink-0 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-medium text-ivory leading-snug text-left">
              {SITE_CONFIG.audio.unmutePromptText}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
