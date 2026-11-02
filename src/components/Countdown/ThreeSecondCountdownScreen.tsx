import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreeSecondCountdownScreenProps {
  onComplete: () => void;
  onPlayTick: () => void;
}

export const ThreeSecondCountdownScreen: React.FC<
  ThreeSecondCountdownScreenProps
> = ({ onComplete, onPlayTick }) => {
  const [count, setCount] = useState<number>(3);

  // Store callbacks in refs so parent re-renders never reset the 3-2-1 timers
  const onCompleteRef = useRef(onComplete);
  const onPlayTickRef = useRef(onPlayTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPlayTickRef.current = onPlayTick;
  }, [onComplete, onPlayTick]);

  useEffect(() => {
    onPlayTickRef.current();

    const timer1 = window.setTimeout(() => {
      setCount(2);
      onPlayTickRef.current();
    }, 1000);

    const timer2 = window.setTimeout(() => {
      setCount(1);
      onPlayTickRef.current();
    }, 2000);

    const timer3 = window.setTimeout(() => {
      onCompleteRef.current();
    }, 3000);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      window.clearTimeout(timer3);
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative z-10 w-full min-h-[88dvh] flex flex-col items-center justify-center px-4 text-center select-none"
    >
      <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
        {/* Pulsing Champagne & Rose Halo */}
        <motion.div
          key={`halo-${count}`}
          initial={{ scale: 0.75, opacity: 0.75 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-champagne/50 shadow-gold-glow"
        />

        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full glass-card-blush flex items-center justify-center border border-champagne/45 shadow-gold-glow">
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="font-serif text-7xl sm:text-8xl font-bold text-champagne drop-shadow-[0_0_30px_rgba(216,184,120,0.6)]"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-8 text-xs sm:text-sm uppercase tracking-[0.28em] text-blush/75">
        Preparing your personalized experience...
      </p>
    </motion.section>
  );
};
