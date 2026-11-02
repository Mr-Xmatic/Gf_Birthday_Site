import React from 'react';
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
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <motion.button
        type="button"
        onClick={onToggle}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isPlaying ? 'Pause background music' : 'Unmute background music'}
        title={isPlaying ? 'Pause music' : 'Unmute music for the full experience'}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full glass-card text-ivory shadow-romantic transition-all cursor-pointer ${
          isPlaying
            ? 'border border-champagne/45 hover:border-champagne/80'
            : 'border-2 border-champagne shadow-gold-glow bg-burgundy-mid/90'
        }`}
      >
        <div
          className={`relative flex items-center justify-center w-7 h-7 rounded-full ${
            isPlaying ? 'bg-rose/25 text-champagne' : 'bg-champagne text-burgundy-deep'
          }`}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-champagne" />
          ) : (
            <VolumeX className="w-4 h-4 text-burgundy-deep" />
          )}
        </div>

        {/* Animated Equalizer Bars when playing */}
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-4 px-0.5" aria-hidden="true">
            <span className="w-0.5 bg-champagne rounded-full eq-bar-1" />
            <span className="w-0.5 bg-rose rounded-full eq-bar-2" />
            <span className="w-0.5 bg-champagne rounded-full eq-bar-3" />
          </div>
        ) : (
          <Music className="w-3.5 h-3.5 text-champagne" />
        )}

        <span className="text-xs font-semibold tracking-wider uppercase text-ivory">
          {isPlaying ? 'Hold My Hand • On' : 'Tap to Unmute 🎵'}
        </span>
      </motion.button>

      {/* Prominent Romantic Prompt When Sound Is Muted Initially */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.button
            type="button"
            onClick={onToggle}
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ duration: 0.35 }}
            className="max-w-[265px] sm:max-w-xs text-right px-4 py-2.5 rounded-2xl bg-gradient-to-r from-burgundy-deep/95 via-burgundy-mid/95 to-burgundy-deep/95 border border-champagne/65 shadow-gold-glow flex items-center gap-2.5 cursor-pointer hover:border-champagne transition-all"
          >
            <Sparkles className="w-4 h-4 text-champagne shrink-0 animate-pulse" />
            <span className="text-xs font-medium text-ivory leading-snug text-left">
              {SITE_CONFIG.audio.unmutePromptText}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
