import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Feather } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import { triggerSubtleSparkleBurst } from '../Confetti/CelebrationConfetti';
import { triggerSoundEffect } from '../../utils/soundEffects';

interface InteractiveLoveLetterScreenProps {
  onCompleteLetter: () => void;
  onPlayEnvelopeSound: () => void;
}

type EnvelopePhase =
  | 'sealed'
  | 'shaking'
  | 'seal-breaking'
  | 'flap-opening'
  | 'letter-emerging'
  | 'unfolded';

export const InteractiveLoveLetterScreen: React.FC<
  InteractiveLoveLetterScreenProps
> = ({ onCompleteLetter, onPlayEnvelopeSound }) => {
  const [phase, setPhase] = useState<EnvelopePhase>('sealed');
  const [typedCharCount, setTypedCharCount] = useState(0);
  const [showFinalButton, setShowFinalButton] = useState(false);

  const letterBottomRef = useRef<HTMLDivElement | null>(null);

  // Build segments as arrays of Unicode characters (Array.from) so emojis never split mid-character
  const letterSegments = useMemo(() => {
    const titleChars = Array.from(SITE_CONFIG.loveLetterScreen.title);
    const salutationChars = Array.from(SITE_CONFIG.loveLetterScreen.salutation);
    const paragraphCharArrays = SITE_CONFIG.loveLetterScreen.paragraphs.map(
      (p) => Array.from(p)
    );
    const signOffChars = Array.from(SITE_CONFIG.loveLetterScreen.signOff);
    const signatureChars = Array.from(SITE_CONFIG.loveLetterScreen.signature);

    // Pause tokens (12 virtual ticks = ~260ms pause between paragraphs)
    const PAUSE_TICKS = 12;

    let cursor = 0;
    const titleRange = { start: cursor, end: cursor + titleChars.length, chars: titleChars };
    cursor = titleRange.end + PAUSE_TICKS;

    const salutationRange = {
      start: cursor,
      end: cursor + salutationChars.length,
      chars: salutationChars,
    };
    cursor = salutationRange.end + PAUSE_TICKS;

    const paragraphRanges = paragraphCharArrays.map((chars) => {
      const range = { start: cursor, end: cursor + chars.length, chars };
      cursor = range.end + PAUSE_TICKS;
      return range;
    });

    const signOffRange = {
      start: cursor,
      end: cursor + signOffChars.length,
      chars: signOffChars,
    };
    cursor = signOffRange.end + 8;

    const signatureRange = {
      start: cursor,
      end: cursor + signatureChars.length,
      chars: signatureChars,
    };
    const totalTicks = signatureRange.end;

    return {
      titleRange,
      salutationRange,
      paragraphRanges,
      signOffRange,
      signatureRange,
      totalTicks,
    };
  }, []);

  const handleOpenEnvelope = () => {
    if (phase !== 'sealed') return;
    onPlayEnvelopeSound();

    // Step 1: Envelope gently shakes
    setPhase('shaking');

    // Step 2: Wax seal breaks/fades
    window.setTimeout(() => {
      setPhase('seal-breaking');
    }, 550);

    // Step 3: Envelope flap opens
    window.setTimeout(() => {
      setPhase('flap-opening');
    }, 1050);

    // Step 4: Letter slowly emerges
    window.setTimeout(() => {
      setPhase('letter-emerging');
    }, 1650);

    // Step 5: Letter unfolds & letter-by-letter handwriting begins
    window.setTimeout(() => {
      setPhase('unfolded');
      triggerSubtleSparkleBurst();
    }, 2400);
  };

  // Step 6: Letter-by-letter handwriting simulation
  useEffect(() => {
    if (phase !== 'unfolded') return;

    const interval = window.setInterval(() => {
      setTypedCharCount((prev) => {
        if (prev >= letterSegments.totalTicks) {
          window.clearInterval(interval);
          return letterSegments.totalTicks;
        }
        const next = prev + 1;
        if (next % 5 === 0) {
          triggerSoundEffect('pen');
        }
        return next;
      });
    }, 22);

    return () => window.clearInterval(interval);
  }, [phase, letterSegments.totalTicks]);

  // Trigger sparkle & reveal continue button shortly after the final character of "I love You, Your X" is written
  useEffect(() => {
    if (phase !== 'unfolded') return;
    if (typedCharCount >= letterSegments.totalTicks && !showFinalButton) {
      triggerSubtleSparkleBurst();
      const timer = window.setTimeout(() => {
        setShowFinalButton(true);
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [phase, typedCharCount, letterSegments.totalTicks, showFinalButton]);

  const handleInstantRevealAll = () => {
    setTypedCharCount(letterSegments.totalTicks);
    setShowFinalButton(true);
  };

  const sliceSegment = (range: {
    start: number;
    end: number;
    chars: string[];
  }): { text: string; isWritingNow: boolean; isStarted: boolean } => {
    if (typedCharCount <= range.start) {
      return { text: '', isWritingNow: false, isStarted: false };
    }
    const count = Math.min(range.chars.length, typedCharCount - range.start);
    const isWritingNow =
      typedCharCount > range.start && typedCharCount <= range.end;
    return {
      text: range.chars.slice(0, count).join(''),
      isWritingNow,
      isStarted: true,
    };
  };

  const titleState = sliceSegment(letterSegments.titleRange);
  const salutationState = sliceSegment(letterSegments.salutationRange);
  const signOffState = sliceSegment(letterSegments.signOffRange);
  const signatureState = sliceSegment(letterSegments.signatureRange);
  const isFinishedWriting = typedCharCount >= letterSegments.totalTicks;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[88dvh]"
    >
      <AnimatePresence mode="wait">
        {phase !== 'unfolded' ? (
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
            transition={{ duration: 0.55 }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-champagne/30 text-champagne text-xs uppercase tracking-[0.2em] mb-6">
              <Feather className="w-3.5 h-3.5" />
              <span>Handwritten For You</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ivory mb-10">
              {SITE_CONFIG.loveLetterScreen.envelopePrompt}
            </h1>

            {/* Rich Classic Gold 3D Envelope with Centered Red "X" Wax Seal */}
            <div className="relative w-full max-w-[355px] sm:max-w-[430px] h-[255px] sm:h-[285px] perspective-stage my-4 flex items-center justify-center">
              <motion.div
                animate={
                  phase === 'shaking'
                    ? {
                        rotate: [0, -2.5, 2.5, -2.5, 2.5, -1.2, 1.2, 0],
                        scale: [1, 1.02, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
                onClick={handleOpenEnvelope}
                className="relative w-full h-full rounded-2xl shadow-envelope cursor-pointer select-none"
                style={{
                  background:
                    'linear-gradient(145deg, #F6E3A6 0%, #DCBA6E 48%, #B58B3E 100%)',
                  border: '2px solid #FCEAB8',
                  boxShadow:
                    '0 28px 60px -12px rgba(10, 2, 5, 0.85), 0 0 40px rgba(216, 184, 120, 0.3)',
                }}
              >
                {/* Warm Gold-Bronze Inner Pocket (Only visible when top flap opens) */}
                <div
                  className="absolute inset-1 rounded-xl pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, #8F6722 0%, #634410 100%)',
                  }}
                />

                {/* Emerging Rose-Parchment Letter Sheet Inside Envelope */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={
                    phase === 'letter-emerging'
                      ? { y: -84, opacity: 1, scale: 0.96 }
                      : phase === 'flap-opening'
                      ? { y: -18, opacity: 0.92, scale: 0.94 }
                      : { y: 12, opacity: 0, scale: 0.92 }
                  }
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute inset-x-5 top-4 h-48 rounded-xl paper-texture border-2 border-champagne/80 p-5 text-left z-10 shadow-xl"
                >
                  <p className="font-handwriting text-2xl text-burgundy font-bold">
                    {SITE_CONFIG.loveLetterScreen.title}
                  </p>
                  <p className="font-handwriting text-lg text-burgundy/80 mt-1">
                    {SITE_CONFIG.loveLetterScreen.salutation}
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="h-1.5 w-3/4 bg-rose/35 rounded-full" />
                    <div className="h-1.5 w-full bg-rose/25 rounded-full" />
                    <div className="h-1.5 w-2/3 bg-rose/35 rounded-full" />
                  </div>
                </motion.div>

                {/* Left & Right Classic Gold Side Flaps */}
                <div
                  className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
                  style={{
                    clipPath: 'polygon(0 0, 54% 50%, 0 100%)',
                    background:
                      'linear-gradient(135deg, #F8E7B0 0%, #DAB66A 55%, #B38A3E 100%)',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
                  style={{
                    clipPath: 'polygon(100% 0, 46% 50%, 100% 100%)',
                    background:
                      'linear-gradient(225deg, #F8E7B0 0%, #D5B164 55%, #A87E34 100%)',
                  }}
                />

                {/* Bottom Classic Gold Pocket Flap */}
                <div
                  className="absolute inset-0 rounded-2xl z-20 pointer-events-none overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 100%, 50% 46%, 100% 100%)',
                    background:
                      'linear-gradient(180deg, #FAECB8 0%, #DFBD72 48%, #BA9144 100%)',
                  }}
                />

                {/* Subtle Gold Crest Label at Bottom of Envelope */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center z-20 pointer-events-none">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#6B4910] font-bold">
                    Happy Birthday • {SITE_CONFIG.envelopeInitials}
                  </span>
                </div>

                {/* Envelope Top Triangular Classic Gold Flap (3D RotateX) */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={
                    phase === 'flap-opening' || phase === 'letter-emerging'
                      ? { rotateX: 180 }
                      : { rotateX: 0 }
                  }
                  transition={{ duration: 0.65, ease: 'easeInOut' }}
                  style={{
                    transformOrigin: 'top center',
                    clipPath: 'polygon(0 0, 100% 0, 50% 54%)',
                    background:
                      'linear-gradient(180deg, #FCF1C8 0%, #E4C47A 55%, #C49B4E 100%)',
                    filter: 'drop-shadow(0 5px 8px rgba(110, 75, 15, 0.28))',
                  }}
                  className={`absolute inset-0 rounded-t-2xl ${
                    phase === 'letter-emerging' ? 'z-0' : 'z-30'
                  }`}
                />

                {/* Perfectly Centered Pure Crimson Red Wax Seal with "X" (Zero Black Rings) */}
                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={
                      phase === 'seal-breaking' ||
                      phase === 'flap-opening' ||
                      phase === 'letter-emerging'
                        ? { scale: 1.35, opacity: 0, rotate: 12 }
                        : { scale: 1, opacity: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.45 }}
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(circle at 35% 30%, #EF3E3E 0%, #C81919 55%, #9E0E0E 100%)',
                      boxShadow:
                        '0 8px 18px rgba(120, 20, 20, 0.45), inset 0 2px 4px rgba(255, 190, 190, 0.5)',
                      border: '2px solid #D62828',
                    }}
                  >
                    <div
                      className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
                      style={{
                        border: '1.5px solid rgba(255, 232, 185, 0.75)',
                        background:
                          'radial-gradient(circle at 40% 35%, #CC1B1B 0%, #A31010 100%)',
                      }}
                    >
                      <span
                        className="font-serif text-2xl sm:text-[26px] font-bold leading-none select-none"
                        style={{
                          color: '#FFF0C8',
                          textShadow: '0 1px 2px rgba(120, 10, 10, 0.6)',
                        }}
                      >
                        X
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Open Letter Button */}
            <div className="mt-10">
              <motion.button
                type="button"
                disabled={phase !== 'sealed'}
                onClick={handleOpenEnvelope}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-9 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50 disabled:opacity-60 inline-flex items-center gap-2.5"
              >
                <span>{SITE_CONFIG.loveLetterScreen.openButtonLabel}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Unfolded Luxury Rose-Blush & Gold Filigree Letter Sheet with Letter-by-Letter Writing */
          <motion.div
            key="unfolded-letter"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="w-full"
          >
            {/* Outer Velvet Crimson & Gold Frame */}
            <div className="p-2 sm:p-3 rounded-[2rem] bg-gradient-to-br from-champagne/60 via-rose/45 to-burgundy-mid/80 shadow-gold-glow">
              <div className="relative w-full paper-texture rounded-[1.6rem] p-6 sm:p-11 md:p-14 text-burgundy border-2 border-champagne/80 overflow-hidden">
                {/* Inner Double Gold & Rose Ornamental Border */}
                <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-champagne/65 pointer-events-none" />
                <div className="absolute inset-4 sm:inset-5 rounded-xl border border-rose/40 pointer-events-none" />

                {/* 4 Vintage Gold Filigree Corner Flourishes */}
                <svg
                  className="absolute top-5 left-5 w-10 h-10 text-champagne/80 pointer-events-none"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M2 38V10C2 5.58 5.58 2 10 2H38"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="10" cy="10" r="3" fill="#E8A0AD" />
                </svg>
                <svg
                  className="absolute top-5 right-5 w-10 h-10 text-champagne/80 pointer-events-none rotate-90"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M2 38V10C2 5.58 5.58 2 10 2H38"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="10" cy="10" r="3" fill="#E8A0AD" />
                </svg>
                <svg
                  className="absolute bottom-5 left-5 w-10 h-10 text-champagne/80 pointer-events-none -rotate-90"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M2 38V10C2 5.58 5.58 2 10 2H38"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="10" cy="10" r="3" fill="#E8A0AD" />
                </svg>
                <svg
                  className="absolute bottom-5 right-5 w-10 h-10 text-champagne/80 pointer-events-none rotate-180"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M2 38V10C2 5.58 5.58 2 10 2H38"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="10" cy="10" r="3" fill="#E8A0AD" />
                </svg>

                {/* Subtle Romantic Watermark Heart in Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
                  <Heart className="w-72 h-72 fill-burgundy text-burgundy" />
                </div>

                {/* Top Wax Seal Emblem & Skip Animation Option */}
                <div className="flex items-center justify-between mb-6 relative z-10 px-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-burgundy to-burgundy-mid text-ivory text-xs font-medium tracking-wider uppercase shadow-sm border border-champagne/50">
                    <Heart className="w-3.5 h-3.5 fill-rose text-rose" />
                    <span>November 4 • Love Note</span>
                  </div>

                  {!isFinishedWriting && (
                    <button
                      type="button"
                      onClick={handleInstantRevealAll}
                      className="text-xs font-medium text-burgundy/75 hover:text-burgundy underline underline-offset-4 cursor-pointer"
                    >
                      Show full letter
                    </button>
                  )}
                </div>

                {/* Handwritten Title (Written Letter by Letter) */}
                {titleState.isStarted && (
                  <div className="mb-6 px-2 relative z-10">
                    <h1 className="font-handwriting text-4xl sm:text-5xl font-bold text-burgundy leading-tight drop-shadow-sm">
                      {titleState.text}
                      {titleState.isWritingNow && (
                        <span className="inline-block w-0.5 h-8 bg-burgundy/80 ml-1 animate-pulse align-middle" />
                      )}
                    </h1>
                    <div className="w-28 h-0.5 bg-gradient-to-r from-burgundy via-rose-deep to-transparent mt-1.5 rounded-full" />
                  </div>
                )}

                {/* Handwritten Salutation (Written Letter by Letter) */}
                {salutationState.isStarted && (
                  <p className="font-handwriting text-2xl sm:text-3xl font-semibold text-burgundy-mid mb-5 px-2 relative z-10">
                    {salutationState.text}
                    {salutationState.isWritingNow && (
                      <span className="inline-block w-0.5 h-6 bg-burgundy/80 ml-1 animate-pulse align-middle" />
                    )}
                  </p>
                )}

                {/* Letter-by-Letter Handwritten Paragraphs */}
                <div className="space-y-5 font-handwriting text-2xl sm:text-[27px] leading-[1.6] text-burgundy px-2 relative z-10">
                  {letterSegments.paragraphRanges.map((range, idx) => {
                    const seg = sliceSegment(range);
                    if (!seg.isStarted) return null;
                    return (
                      <p key={idx}>
                        {seg.text}
                        {seg.isWritingNow && (
                          <span className="inline-block w-0.5 h-6 bg-burgundy/85 ml-1 animate-pulse align-middle" />
                        )}
                      </p>
                    );
                  })}
                </div>

                {/* Letter-by-Letter Closing Sign-off ("I Love You❤️") & Signature Below ("Your X") */}
                {signOffState.isStarted && (
                  <div className="mt-8 pt-5 border-t border-burgundy/15 flex flex-col items-end text-right px-2 relative z-10 space-y-1">
                    <span className="font-handwriting text-xl sm:text-2xl font-semibold text-burgundy/90 tracking-wide block">
                      {signOffState.text}
                      {signOffState.isWritingNow && (
                        <span className="inline-block w-0.5 h-5 bg-burgundy/85 ml-1 animate-pulse align-middle" />
                      )}
                    </span>

                    {signatureState.isStarted && (
                      <div className="relative inline-block">
                        <span className="font-handwriting text-xl sm:text-2xl font-bold text-burgundy tracking-wider block">
                          {signatureState.text}
                          {signatureState.isWritingNow && (
                            <span className="inline-block w-0.5 h-5 bg-burgundy/85 ml-1 animate-pulse align-middle" />
                          )}
                        </span>
                        {isFinishedWriting && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.65 }}
                            className="h-0.5 bg-gradient-to-r from-transparent via-burgundy to-rose-deep mt-0.5 rounded-full"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div ref={letterBottomRef} />
              </div>
            </div>

            {/* Delayed Gift Surprise Transition Button */}
            <AnimatePresence>
              {showFinalButton && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-8 flex justify-center"
                >
                  <motion.button
                    type="button"
                    onClick={onCompleteLetter}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50 inline-flex items-center justify-center gap-2.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{SITE_CONFIG.loveLetterScreen.continueButtonLabel}</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
