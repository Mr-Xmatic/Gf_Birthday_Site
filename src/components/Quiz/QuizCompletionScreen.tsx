import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import { triggerGrandCelebrationConfetti } from '../Confetti/CelebrationConfetti';

interface QuizCompletionScreenProps {
  onShowMemories: () => void;
  onPlayConfettiSound: () => void;
}

export const QuizCompletionScreen: React.FC<QuizCompletionScreenProps> = ({
  onShowMemories,
  onPlayConfettiSound,
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
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -20 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[88dvh] text-center"
    >
      <div className="w-full glass-card-blush rounded-3xl p-7 sm:p-11 border border-champagne/45 shadow-romantic relative overflow-hidden">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne/35 via-rose/25 to-burgundy border border-champagne flex items-center justify-center shadow-gold-glow"
        >
          <Award className="w-10 h-10 text-champagne" />
        </motion.div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-burgundy-deep/70 border border-champagne/30 text-champagne text-xs uppercase tracking-[0.2em] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Certified My Girl</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory leading-tight mb-5">
          {SITE_CONFIG.quizCompletionScreen.heading}
        </h1>

        <p className="text-blush/95 text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-9">
          {SITE_CONFIG.quizCompletionScreen.supportingText}
        </p>

        <motion.button
          type="button"
          onClick={onShowMemories}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50 inline-flex items-center justify-center gap-2.5"
        >
          <span>{SITE_CONFIG.quizCompletionScreen.buttonLabel}</span>
          <Heart className="w-4 h-4 fill-burgundy-deep text-burgundy-deep" />
        </motion.button>
      </div>
    </motion.section>
  );
};
