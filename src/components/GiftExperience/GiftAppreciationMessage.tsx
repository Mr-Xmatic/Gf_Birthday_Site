import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import {
  triggerGrandCelebrationConfetti,
  triggerSubtleSparkleBurst,
} from '../Confetti/CelebrationConfetti';

interface GiftAppreciationMessageProps {
  visible: boolean;
  onContinueToFinale: () => void;
  onPlaySuccessSound: () => void;
  onPlayClickSound: () => void;
}

export const GiftAppreciationMessage: React.FC<GiftAppreciationMessageProps> = ({
  visible,
  onContinueToFinale,
  onPlaySuccessSound,
  onPlayClickSound,
}) => {
  const [hasClickedLoveIt, setHasClickedLoveIt] = useState(false);

  const braceletConfig = SITE_CONFIG.giftBoxExperience.secondGiftBracelet;

  const handleLoveIt = () => {
    if (hasClickedLoveIt) return;
    onPlaySuccessSound();
    triggerGrandCelebrationConfetti();
    window.setTimeout(() => {
      triggerSubtleSparkleBurst();
    }, 550);
    setHasClickedLoveIt(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative w-full max-w-xl mx-auto mt-6 text-center"
        >
          <div className="glass-card-blush rounded-3xl p-6 sm:p-8 border border-champagne/45 shadow-romantic relative overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="font-serif text-2xl sm:text-4xl font-bold text-ivory mb-3"
            >
              {braceletConfig.appreciationHeading}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55 }}
              className="text-blush/95 text-base sm:text-lg max-w-md mx-auto mb-6 leading-relaxed"
            >
              {braceletConfig.appreciationSupportingText}
            </motion.p>

            <AnimatePresence mode="wait">
              {!hasClickedLoveIt ? (
                <motion.div
                  key="love-it-btn"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.5, duration: 0.45 }}
                >
                  <motion.button
                    type="button"
                    onClick={handleLoveIt}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-10 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/60 inline-flex items-center gap-2.5"
                  >
                    <span>{braceletConfig.loveItButtonLabel}</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="affectionate-closing"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="space-y-5"
                >
                  <div className="p-4 sm:p-5 rounded-2xl bg-burgundy-deep/85 border border-champagne/50 text-ivory shadow-gold-glow">
                    <div className="flex items-center justify-center gap-1.5 text-rose mb-1.5">
                      <Heart className="w-4 h-4 fill-rose" />
                      <Sparkles className="w-4 h-4 text-champagne" />
                      <Heart className="w-4 h-4 fill-rose" />
                    </div>
                    <p className="font-serif italic text-base sm:text-lg text-champagne leading-relaxed">
                      “{braceletConfig.closingAffectionateNote}”
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => {
                      onPlayClickSound();
                      onContinueToFinale();
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-xs sm:text-sm tracking-wider uppercase shadow-gold-glow border border-ivory/50 inline-flex items-center justify-center gap-2"
                  >
                    <span>{braceletConfig.continueToFinaleButtonLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gentle Burst of Floating Hearts When Clicking "I LOVE IT! ❤️" */}
            <AnimatePresence>
              {hasClickedLoveIt && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {[...Array(14)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{
                        opacity: 1,
                        y: 220,
                        x: (idx - 6.5) * 32,
                        scale: 0.5,
                      }}
                      animate={{
                        opacity: 0,
                        y: -50,
                        x: (idx - 6.5) * 46,
                        scale: 1.25,
                      }}
                      transition={{ duration: 1.3, ease: 'easeOut' }}
                      className="absolute left-1/2 bottom-0"
                    >
                      <Heart className="w-6 h-6 fill-rose text-rose" />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
