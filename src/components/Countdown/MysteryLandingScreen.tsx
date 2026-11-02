import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import { CountdownTime } from '../../hooks/useBirthdayGate';

interface MysteryLandingScreenProps {
  countdown: CountdownTime;
  doualaTime: string;
  onPlayDodgeSound: () => void;
  onSimulateBirthdayUnlock: () => void;
}

export const MysteryLandingScreen: React.FC<MysteryLandingScreenProps> = ({
  countdown,
  doualaTime,
  onPlayDodgeSound,
  onSimulateBirthdayUnlock,
}) => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [secretTapCount, setSecretTapCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [buttonOffset, setButtonOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleSecretBadgeTap = useCallback(() => {
    setSecretTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        onSimulateBirthdayUnlock();
      }
      return next;
    });
  }, [onSimulateBirthdayUnlock]);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const handlePlayfulClick = useCallback(() => {
    onPlayDodgeSound();

    const todayFormatted = new Intl.DateTimeFormat('en-US', {
      timeZone: SITE_CONFIG.timezone,
      month: 'long',
      day: 'numeric',
    }).format(new Date());

    const messages = SITE_CONFIG.landingScreen.playfulMessages;
    const rawMsg = messages[attemptCount % messages.length];
    const nextMsg =
      todayFormatted === 'November 4'
        ? rawMsg.replace('I said November 4, not {TODAY}.', 'Almost time, baby! ❤️')
        : rawMsg.replace('{TODAY}', todayFormatted);
    setCurrentMessage(nextMsg);
    setAttemptCount((prev) => prev + 1);

    // Calculate safe bounded random offset within the visible arena so it never leaves the screen
    const arenaWidth = arenaRef.current?.clientWidth || Math.min(window.innerWidth - 32, 420);
    const arenaHeight = arenaRef.current?.clientHeight || 170;
    const buttonWidth = btnRef.current?.offsetWidth || 235;
    const buttonHeight = btnRef.current?.offsetHeight || 56;

    const maxX = Math.max(24, (arenaWidth - buttonWidth) / 2 - 8);
    const maxY = Math.max(20, (arenaHeight - buttonHeight) / 2 - 6);

    // Ensure the new position is noticeably different from the current position
    let nextX = (Math.random() * 2 - 1) * maxX;
    let nextY = (Math.random() * 2 - 1) * maxY;

    if (Math.abs(nextX - buttonOffset.x) < 35) {
      nextX = buttonOffset.x >= 0 ? -maxX * 0.75 : maxX * 0.75;
    }
    if (Math.abs(nextY - buttonOffset.y) < 18) {
      nextY = buttonOffset.y >= 0 ? -maxY * 0.75 : maxY * 0.75;
    }

    setButtonOffset({
      x: Math.round(nextX),
      y: Math.round(nextY),
    });
  }, [attemptCount, buttonOffset.x, buttonOffset.y, onPlayDodgeSound]);

  const timeUnits = [
    { label: 'DAYS', value: countdown.days },
    { label: 'HOURS', value: countdown.hours },
    { label: 'MINUTES', value: countdown.minutes },
    { label: 'SECONDS', value: countdown.seconds },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center text-center min-h-[88dvh] justify-between"
    >
      {/* Top Editorial Badge (Secret 5-tap trigger for creator testing) */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <div
          onClick={handleSecretBadgeTap}
          title={secretTapCount > 0 ? `${5 - secretTapCount} more taps` : undefined}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-champagne/30 text-champagne text-xs tracking-[0.22em] uppercase select-none"
        >
          <Lock className="w-3.5 h-3.5 text-rose" />
          <span>{SITE_CONFIG.projectName}</span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="w-full glass-card rounded-3xl p-6 sm:p-10 border border-rose/25 shadow-romantic my-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-rose/15 border border-champagne/35 flex items-center justify-center shadow-gold-glow">
            <Sparkles className="w-5 h-5 text-champagne" />
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-ivory leading-tight tracking-tight mb-4">
          {SITE_CONFIG.landingScreen.heading}
        </h1>

        <p className="text-blush/90 text-base sm:text-lg font-normal max-w-md mx-auto mb-8 leading-relaxed">
          {SITE_CONFIG.landingScreen.supportingText}
        </p>

        {/* Live Countdown Grid */}
        <div
          className="grid grid-cols-4 gap-2.5 sm:gap-4 mb-6"
          role="timer"
          aria-label="Countdown to November 4, 2026"
        >
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-burgundy-deep/75 border border-champagne/25 shadow-inner"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 8, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="font-serif text-2xl sm:text-4xl font-bold text-champagne tabular-nums"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
              <span className="text-[10px] sm:text-xs tracking-[0.18em] text-blush/75 uppercase mt-1.5 font-medium">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-ivory/50 tracking-wider uppercase mb-6">
          Target: November 4, 2026 • Africa/Douala ({doualaTime})
        </p>

        {/* Playful Message Toast Area */}
        <div className="min-h-[3.5rem] flex items-center justify-center mb-2 px-2">
          <AnimatePresence mode="wait">
            {currentMessage ? (
              <motion.div
                key={`${attemptCount}-${currentMessage}`}
                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.25 }}
                className="px-4 py-2.5 rounded-2xl bg-rose/15 border border-rose/40 text-ivory text-sm sm:text-base font-medium shadow-rose-glow"
              >
                {currentMessage}
              </motion.div>
            ) : (
              <p className="text-xs sm:text-sm text-blush/60 italic">
                Locked until midnight on November 4...
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Bounded Playful Button Arena */}
        <div
          ref={arenaRef}
          className="relative w-full h-44 sm:h-48 flex items-center justify-center overflow-hidden rounded-2xl"
        >
          <motion.button
            ref={btnRef}
            type="button"
            onClick={handlePlayfulClick}
            animate={{
              x: buttonOffset.x,
              y: buttonOffset.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="px-7 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-semibold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow flex items-center gap-2.5 border border-ivory/40 cursor-pointer select-none"
          >
            <Heart className="w-4 h-4 fill-burgundy-deep text-burgundy-deep" />
            <span>{SITE_CONFIG.landingScreen.buttonLabel}</span>
          </motion.button>
        </div>
      </div>

      <div className="h-2" />
    </motion.section>
  );
};
