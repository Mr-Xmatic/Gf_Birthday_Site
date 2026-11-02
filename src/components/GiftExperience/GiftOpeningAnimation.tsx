import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GiftBox, GiftBoxPhase } from './GiftBox';

interface GiftOpeningAnimationProps {
  phase: GiftBoxPhase;
  variant?: 'first' | 'second';
  onOpenClick?: () => void;
  children?: React.ReactNode;
}

export const GiftOpeningAnimation: React.FC<GiftOpeningAnimationProps> = ({
  phase,
  variant = 'first',
  onOpenClick,
  children,
}) => {
  const showSparkles =
    phase === 'lid-opening' || phase === 'opened' || phase === 'fading-out';

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4">
      {/* Emerging Content Slot (First Gift or Rising Bracelet) */}
      <div className="relative z-30 w-full flex items-center justify-center">
        {children}
      </div>

      {/* Rising Golden Sparkles & Light Particles When Box Opens */}
      <AnimatePresence>
        {showSparkles && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-visible">
            {[...Array(12)].map((_, idx) => {
              const angle = (idx / 12) * Math.PI * 2;
              const distanceX = Math.cos(angle) * (65 + (idx % 3) * 28);
              const distanceY = -70 - (idx % 4) * 32;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, x: 0, scale: 0.3 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: distanceY,
                    x: distanceX,
                    scale: [0.4, 1.15, 0.5],
                  }}
                  transition={{
                    duration: 1.8,
                    delay: (idx % 4) * 0.12,
                    ease: 'easeOut',
                  }}
                  className="absolute text-champagne"
                >
                  <Sparkles className="w-4 h-4 text-[#FCEAB8] drop-shadow-[0_0_8px_#D8B878]" />
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* 3D Gift Box */}
      <GiftBox phase={phase} variant={variant} onClick={onOpenClick} />
    </div>
  );
};
