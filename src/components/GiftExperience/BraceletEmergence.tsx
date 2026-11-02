import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import { GiftBoxPhase } from './GiftBox';
import { GiftOpeningAnimation } from './GiftOpeningAnimation';
import { BraceletVideo } from './BraceletVideo';
import { GiftAppreciationMessage } from './GiftAppreciationMessage';
import { triggerSubtleSparkleBurst } from '../Confetti/CelebrationConfetti';

interface BraceletEmergenceProps {
  onCompleteBraceletExperience: () => void;
  onPlayClickSound: () => void;
  onPlayOpenSound: () => void;
  onPlaySuccessSound: () => void;
}

type BraceletGiftStage =
  | 'box-ready'
  | 'box-opening'
  | 'bracelet-rising'
  | 'bracelet-rotating'
  | 'appreciation';

export const BraceletEmergence: React.FC<BraceletEmergenceProps> = ({
  onCompleteBraceletExperience,
  onPlayClickSound,
  onPlayOpenSound,
  onPlaySuccessSound,
}) => {
  const [stage, setStage] = useState<BraceletGiftStage>('box-ready');
  const [boxPhase, setBoxPhase] = useState<GiftBoxPhase>('idle');

  const onPlaySuccessRef = useRef(onPlaySuccessSound);
  useEffect(() => {
    onPlaySuccessRef.current = onPlaySuccessSound;
  }, [onPlaySuccessSound]);

  const firstGiftConfig = SITE_CONFIG.giftBoxExperience.firstGift;
  const braceletConfig = SITE_CONFIG.giftBoxExperience.secondGiftBracelet;

  const handleOpenBraceletGift = () => {
    if (stage !== 'box-ready') return;
    onPlayOpenSound();
    setStage('box-opening');

    // 1. The box gently shakes
    setBoxPhase('shaking');

    // 2. The ribbon loosens
    window.setTimeout(() => {
      setBoxPhase('ribbon-loosening');
    }, 550);

    // 3. The lid opens slowly & golden light + sparkles rise from the box
    window.setTimeout(() => {
      setBoxPhase('lid-opening');
      triggerSubtleSparkleBurst();
    }, 1050);

    // 4. The bracelet begins to emerge vertically from inside the open box
    window.setTimeout(() => {
      setStage('bracelet-rising');
    }, 1450);

    // 5. The gift box and lid gradually fade away as the bracelet rises toward the viewer
    window.setTimeout(() => {
      setBoxPhase('fading-out');
    }, 2050);

    // 6. Seamless transition into the actual 6-second 3D bracelet rotation video at the exact moment it reaches center!
    window.setTimeout(() => {
      setStage('bracelet-rotating');
      onPlaySuccessRef.current();
    }, 3350);
  };

  const handleRotationComplete = () => {
    triggerSubtleSparkleBurst();
    setStage('appreciation');
  };

  const isBraceletVisible =
    stage === 'bracelet-rising' ||
    stage === 'bracelet-rotating' ||
    stage === 'appreciation';

  const isBoxVisible =
    stage === 'box-ready' ||
    stage === 'box-opening' ||
    stage === 'bracelet-rising';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.65 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center text-center"
    >
      <div className="w-full flex flex-col items-center">
        {/* Header Above Box (Fades out gracefully once bracelet takes center stage) */}
        <AnimatePresence>
          {(stage === 'box-ready' || stage === 'box-opening') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="mb-4 text-center max-w-lg"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-champagne/35 text-champagne text-xs uppercase tracking-[0.2em] mb-4">
                <Gift className="w-3.5 h-3.5" />
                <span>A Special Gift For You</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory leading-tight mb-2.5">
                {firstGiftConfig.introHeading}
              </h1>

              <p className="text-blush/90 text-base sm:text-lg">
                {firstGiftConfig.introSupportingText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Combined 3D Emergence Stage: Box + Rising Bracelet */}
        <div className="relative w-full min-h-[290px] sm:min-h-[340px] flex flex-col items-center justify-center">
          {/* THE EMERGING BRACELET (Starts inside the open box, rises vertically, scales toward viewer, then plays 6s 3D rotation!) */}
          <motion.div
            initial={{ opacity: 0, y: 95, scale: 0.24 }}
            animate={
              stage === 'bracelet-rising'
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'brightness(1.08)',
                  }
                : stage === 'bracelet-rotating' || stage === 'appreciation'
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'brightness(1)',
                  }
                : {
                    opacity: 0,
                    y: 95,
                    scale: 0.24,
                  }
            }
            transition={{
              duration: 1.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`w-full flex items-center justify-center z-30 ${
              isBraceletVisible
                ? 'pointer-events-auto'
                : 'pointer-events-none h-0 overflow-hidden'
            }`}
          >
            <BraceletVideo
              videoPath={braceletConfig.videoPath}
              shouldPlay={
                stage === 'bracelet-rotating' || stage === 'appreciation'
              }
              onRotationComplete={handleRotationComplete}
            />
          </motion.div>

          {/* THE GIFT BOX (Opens and gradually fades away as the bracelet rises) */}
          <AnimatePresence>
            {isBoxVisible && (
              <motion.div
                key="bracelet-gift-box-container"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeInOut' }}
                className={`${
                  stage === 'bracelet-rising'
                    ? 'absolute inset-0 flex items-center justify-center z-10 pointer-events-none'
                    : 'relative z-20'
                }`}
              >
                <GiftOpeningAnimation
                  phase={boxPhase}
                  variant="first"
                  onOpenClick={handleOpenBraceletGift}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* "OPEN YOUR GIFT 🎁" Button */}
        <AnimatePresence>
          {stage === 'box-ready' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4 }}
              className="mt-6"
            >
              <motion.button
                type="button"
                onClick={handleOpenBraceletGift}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-9 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{firstGiftConfig.openButtonLabel}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Appreciation Message (Smoothly Fades In After the 6-Second Bracelet Rotation Finishes) */}
        <GiftAppreciationMessage
          visible={stage === 'appreciation'}
          onContinueToFinale={onCompleteBraceletExperience}
          onPlaySuccessSound={onPlaySuccessSound}
          onPlayClickSound={onPlayClickSound}
        />
      </div>
    </motion.div>
  );
};
