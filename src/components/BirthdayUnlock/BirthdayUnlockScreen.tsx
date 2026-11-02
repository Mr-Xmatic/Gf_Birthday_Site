import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Cake } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import { triggerGrandCelebrationConfetti } from '../Confetti/CelebrationConfetti';

interface BirthdayUnlockScreenProps {
  onBegin: () => void;
  onPlayConfettiSound: () => void;
  isSimulatingBirthday?: boolean;
  onExitSimulation?: () => void;
}

export const BirthdayUnlockScreen: React.FC<BirthdayUnlockScreenProps> = ({
  onBegin,
  onPlayConfettiSound,
  isSimulatingBirthday,
  onExitSimulation,
}) => {
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    if (!hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      triggerGrandCelebrationConfetti();
      onPlayConfettiSound();
    }
  }, [onPlayConfettiSound]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -20 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[88dvh] text-center"
    >
      {/* Top Celebration Crest */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-blush text-champagne text-xs tracking-[0.22em] uppercase mb-6"
      >
        <Sparkles className="w-3.5 h-3.5 text-champagne" />
        <span>NOVEMBER 4 • UNLOCKED FOR BB</span>
        <Sparkles className="w-3.5 h-3.5 text-champagne" />
      </motion.div>

      {/* Main Birthday Greeting Card */}
      <div className="w-full glass-card-blush rounded-3xl p-7 sm:p-11 relative overflow-hidden">
        {/* Decorative Corner Glows */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-champagne/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-rose/20 blur-2xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne/30 via-rose/25 to-burgundy border border-champagne/60 flex items-center justify-center shadow-gold-glow"
        >
          <Cake className="w-9 h-9 text-champagne" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="font-serif text-3xl sm:text-5xl font-bold text-ivory leading-tight mb-5"
        >
          {SITE_CONFIG.birthdayUnlockScreen.heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-blush/95 text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-9"
        >
          {SITE_CONFIG.birthdayUnlockScreen.supportingText}
        </motion.p>

        {/* Stationary Functional Button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center"
        >
          <motion.button
            type="button"
            onClick={onBegin}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto min-w-[240px] px-9 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50 flex items-center justify-center gap-2.5"
          >
            <span>{SITE_CONFIG.birthdayUnlockScreen.buttonLabel}</span>
            <Heart className="w-4 h-4 fill-burgundy-deep text-burgundy-deep" />
          </motion.button>
        </motion.div>
      </div>

      {isSimulatingBirthday && onExitSimulation && (
        <button
          type="button"
          onClick={onExitSimulation}
          className="mt-6 text-xs text-ivory/55 hover:text-ivory underline underline-offset-4"
        >
          Return to Pre-Birthday Countdown View
        </button>
      )}
    </motion.section>
  );
};
