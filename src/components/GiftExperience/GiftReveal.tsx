import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import { GiftOpeningAnimation } from './GiftOpeningAnimation';
import { GiftBoxPhase } from './GiftBox';
import { triggerSubtleSparkleBurst } from '../Confetti/CelebrationConfetti';

interface GiftRevealProps {
  onCompleteFirstGift: () => void;
  onPlayClick: () => void;
  onPlayOpenSound: () => void;
  onPlaySuccessSound: () => void;
}

export const GiftReveal: React.FC<GiftRevealProps> = ({
  onCompleteFirstGift,
  onPlayClick,
  onPlayOpenSound,
  onPlaySuccessSound,
}) => {
  const [boxPhase, setBoxPhase] = useState<GiftBoxPhase>('idle');
  const [isGiftRevealed, setIsGiftRevealed] = useState(false);
  const [showHeartsBurst, setShowHeartsBurst] = useState(false);

  const firstGiftConfig = SITE_CONFIG.giftBoxExperience.firstGift;

  const handleOpenGift = () => {
    if (boxPhase !== 'idle') return;
    onPlayOpenSound();

    // 1. The gift box gently shakes
    setBoxPhase('shaking');

    // 2. The ribbon loosens or disappears
    window.setTimeout(() => {
      setBoxPhase('ribbon-loosening');
    }, 550);

    // 3. The lid slowly lifts and opens + warm golden light shines from inside
    window.setTimeout(() => {
      setBoxPhase('lid-opening');
      triggerSubtleSparkleBurst();
    }, 1050);

    // 4. Box fades out as the first gift emerges into full view
    window.setTimeout(() => {
      setBoxPhase('fading-out');
      setIsGiftRevealed(true);
      onPlaySuccessSound();
    }, 1850);
  };

  const handleLoveItClick = () => {
    if (showHeartsBurst) return;
    onPlayClick();
    onPlaySuccessSound();
    triggerSubtleSparkleBurst();
    setShowHeartsBurst(true);

    window.setTimeout(() => {
      onCompleteFirstGift();
    }, 1250);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-xl mx-auto flex flex-col items-center text-center"
    >
      <AnimatePresence mode="wait">
        {!isGiftRevealed ? (
          <motion.div
            key="first-gift-box-stage"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            className="w-full glass-card-blush rounded-3xl p-7 sm:p-10 border border-champagne/40 shadow-romantic flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy-deep/75 border border-champagne/35 text-champagne text-xs uppercase tracking-[0.2em] mb-4">
              <Gift className="w-3.5 h-3.5" />
              <span>Birthday Gift • Part I</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory leading-tight mb-3">
              {firstGiftConfig.introHeading}
            </h1>

            <p className="text-blush/90 text-base sm:text-lg mb-6 max-w-md">
              {firstGiftConfig.introSupportingText}
            </p>

            {/* 3D Gift Box & Opening Animation */}
            <div className="my-2">
              <GiftOpeningAnimation
                phase={boxPhase}
                variant="first"
                onOpenClick={handleOpenGift}
              />
            </div>

            <div className="mt-6">
              <motion.button
                type="button"
                disabled={boxPhase !== 'idle'}
                onClick={handleOpenGift}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-9 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50 disabled:opacity-60 inline-flex items-center gap-2.5"
              >
                <span>{firstGiftConfig.openButtonLabel}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Revealed First Gift Stage */
          <motion.div
            key="first-gift-revealed-stage"
            initial={{ opacity: 0, y: 36, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="w-full glass-card-blush rounded-3xl p-7 sm:p-10 border border-champagne/50 shadow-gold-glow flex flex-col items-center relative overflow-hidden"
          >
            {/* Warm Golden Spotlight Behind Revealed Gift */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-champagne/25 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-burgundy-deep/75 border border-champagne/40 text-champagne text-xs uppercase tracking-[0.2em] mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unwrapped For You</span>
            </div>

            {/* Revealed Gift Frame */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-champagne shadow-gold-glow mb-7 bg-burgundy-deep"
            >
              <img
                src={firstGiftConfig.imagePath}
                alt="Your Birthday Gift"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory mb-3">
              {firstGiftConfig.revealedHeading}
            </h2>

            <p className="text-blush/95 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
              {firstGiftConfig.revealedSupportingText}
            </p>

            <motion.button
              type="button"
              onClick={handleLoveItClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/60 inline-flex items-center gap-2.5"
            >
              <span>{firstGiftConfig.loveItButtonLabel}</span>
            </motion.button>

            {/* Floating Hearts Burst When Clicking "I LOVE IT! ❤️" */}
            <AnimatePresence>
              {showHeartsBurst && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {[...Array(12)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{
                        opacity: 1,
                        y: 260,
                        x: (idx - 5.5) * 34,
                        scale: 0.5,
                      }}
                      animate={{
                        opacity: 0,
                        y: -60,
                        x: (idx - 5.5) * 48,
                        scale: 1.3,
                      }}
                      transition={{ duration: 1.15, ease: 'easeOut' }}
                      className="absolute left-1/2 bottom-0"
                    >
                      <Heart className="w-6 h-6 fill-rose text-rose" />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
