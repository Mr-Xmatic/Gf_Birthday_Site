import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Sparkles, Heart, Flame } from 'lucide-react';
import {
  triggerGrandCelebrationConfetti,
  triggerSubtleSparkleBurst,
} from '../Confetti/CelebrationConfetti';

interface BirthdayCakeScreenProps {
  onComplete: () => void;
  onPlayBlowSound: () => void;
  onPlayCelebrationSound: () => void;
}

const TEASING_BLOW_MESSAGES = [
  'Is that a breeze or a whisper, baby? Tap faster! 😂💨',
  'Put some lungs into it! The flames are just dancing! 😭🎂',
  'Too slow, princess! Tap-tap-tap fast to blow them out! 🔥',
  'Whoa, you slowed down and the flames stood right back up! 😂❤️',
  'Come on birthday girl, one big fast burst! 💨✨',
];

export const BirthdayCakeScreen: React.FC<BirthdayCakeScreenProps> = ({
  onComplete,
  onPlayBlowSound,
  onPlayCelebrationSound,
}) => {
  const [windPower, setWindPower] = useState<number>(0);
  const [isExtinguished, setIsExtinguished] = useState<boolean>(false);
  const [teaseMessage, setTeaseMessage] = useState<string | null>(null);
  const [tapBurstKey, setTapBurstKey] = useState<number>(0);
  const [flutterSeed, setFlutterSeed] = useState<number>(0);

  const lastTapTimeRef = useRef<number>(0);
  const slowTapCounterRef = useRef<number>(0);

  // Continuous physics decay loop: if she taps slowly, windPower drops back to 0 so the flames move but don't go out!
  useEffect(() => {
    if (isExtinguished) return;

    const interval = window.setInterval(() => {
      setFlutterSeed((prev) => (prev + 1) % 100);
      setWindPower((prev) => {
        if (prev <= 0) return 0;
        // Natural decay rate (-1.65 per 45ms = ~36% per second)
        const next = Math.max(0, prev - 1.65);
        return next;
      });
    }, 45);

    return () => window.clearInterval(interval);
  }, [isExtinguished]);

  const handleBlowTap = useCallback(() => {
    if (isExtinguished) return;

    onPlayBlowSound();
    setTapBurstKey((prev) => prev + 1);

    const now = Date.now();
    const deltaMs = now - lastTapTimeRef.current;
    lastTapTimeRef.current = now;

    // Detect if she is tapping slowly (> 330ms between taps) vs rapidly (< 240ms)
    const isFastTap = deltaMs > 0 && deltaMs < 250;

    if (!isFastTap) {
      slowTapCounterRef.current += 1;
      if (slowTapCounterRef.current >= 2) {
        const msgIndex =
          (slowTapCounterRef.current - 2) % TEASING_BLOW_MESSAGES.length;
        setTeaseMessage(TEASING_BLOW_MESSAGES[msgIndex]);
      }
    } else if (windPower > 45) {
      setTeaseMessage('Keep going! Almost blown out! 💨🔥');
    }

    setWindPower((prev) => {
      // Fast taps build momentum; slow taps give a small puff that decays before reaching 100
      const boost = isFastTap ? 14.5 : 8.5;
      const next = Math.min(100, prev + boost);

      if (next >= 100) {
        setIsExtinguished(true);
        setTeaseMessage(null);
        onPlayCelebrationSound();
        triggerGrandCelebrationConfetti();
        window.setTimeout(() => {
          triggerSubtleSparkleBurst();
        }, 700);
      }

      return next;
    });
  }, [isExtinguished, onPlayBlowSound, onPlayCelebrationSound, windPower]);

  // Calculate dynamic flame physics based on current windPower
  const windTiltDeg =
    windPower > 0
      ? Math.min(62, windPower * 0.58) + (flutterSeed % 2 === 0 ? 5 : -4)
      : flutterSeed % 2 === 0
      ? 2
      : -2;

  const flameScaleY =
    windPower > 0
      ? Math.max(0.38, 1 - windPower * 0.0055) +
        (flutterSeed % 3 === 0 ? 0.06 : -0.04)
      : 1;

  const flameScaleX = windPower > 0 ? 1 + windPower * 0.004 : 1;

  // 4 surrounding classic candles (2 on the left of "22", 2 on the right of "22")
  const sideCandles = [
    { id: 'c1', left: '16%', top: '8px', height: 44, threshold: 75 },
    { id: 'c2', left: '28%', top: '2px', height: 50, threshold: 85 },
    { id: 'c3', left: '72%', top: '2px', height: 50, threshold: 88 },
    { id: 'c4', left: '84%', top: '8px', height: 44, threshold: 78 },
  ];

  const renderFlameOrSmoke = (tempThreshold: number, keyId: string) => {
    // Only goes out permanently when isExtinguished is true; sputters briefly only at high wind
    const isTemporarilySputtering = !isExtinguished && windPower >= tempThreshold;

    if (isExtinguished) {
      return (
        <div
          key={`smoke-${keyId}`}
          className="relative flex flex-col items-center -mb-1 pointer-events-none"
        >
          {[0, 1, 2].map((sIdx) => (
            <motion.span
              key={sIdx}
              initial={{ opacity: 0.75, y: 0, x: 0, scale: 0.5 }}
              animate={{
                opacity: 0,
                y: -38 - sIdx * 12,
                x: (sIdx % 2 === 0 ? 1 : -1) * (10 + sIdx * 5),
                scale: 1.7,
              }}
              transition={{
                duration: 1.8,
                delay: sIdx * 0.22,
                repeat: Infinity,
                repeatDelay: 0.8,
              }}
              className="w-2.5 h-2.5 rounded-full bg-ivory/45 blur-[2px] block"
            />
          ))}
        </div>
      );
    }

    return (
      <div
        key={`flame-${keyId}`}
        style={{
          transform: `rotate(${windTiltDeg}deg) scaleX(${flameScaleX}) scaleY(${
            isTemporarilySputtering ? 0.22 : flameScaleY
          })`,
          transformOrigin: 'bottom center',
          opacity: isTemporarilySputtering ? 0.35 : 1,
        }}
        className="relative flex items-center justify-center transition-transform duration-75"
      >
        {/* Outer Warm Candlelight Halo */}
        <div className="absolute -inset-3 rounded-full bg-amber-400/40 blur-md animate-pulse" />
        {/* Outer Teardrop Flame */}
        <div
          className="w-4 h-6 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 75%, #FFF8F0 0%, #FFD166 40%, #F77F00 78%, rgba(214, 40, 40, 0) 100%)',
            borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
            boxShadow: '0 0 16px #FFB703, 0 0 28px rgba(247, 127, 0, 0.7)',
          }}
        />
        {/* Inner White-Hot Core */}
        <div className="absolute bottom-0.5 w-1.5 h-3 rounded-full bg-ivory" />
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.55 }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-between min-h-[88dvh] text-center select-none"
    >
      {/* Top Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card-blush border border-champagne/40 text-champagne text-xs uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chapter 22 • Make A Birthday Wish</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory leading-tight">
          {isExtinguished
            ? 'HAPPY 22ND BIRTHDAY, MY BABY! ❤️🎂'
            : 'Close your eyes & make a wish, baby... ✨'}
        </h1>

        <p className="text-blush/90 text-sm sm:text-base max-w-md mx-auto">
          {isExtinguished
            ? 'Every single candle is out! May all your birthday wishes come true this year. ❤️'
            : 'Tap the BLOW button super fast to blow out your 22nd birthday candles!'}
        </p>
      </div>

      {/* 3D Luxury Birthday Cake Stage */}
      <div className="relative w-full max-w-[350px] sm:max-w-[390px] pt-12 pb-4 my-2 flex flex-col items-center justify-center perspective-stage">
        {/* Ambient Candlelight Room Glow (Dims when candles are blown out!) */}
        <div
          className="absolute top-2 w-72 h-72 rounded-full pointer-events-none transition-all duration-1000 blur-3xl"
          style={{
            background: isExtinguished
              ? 'radial-gradient(circle, rgba(232,160,173,0.18) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,195,85,0.34) 0%, rgba(232,160,173,0.16) 55%, transparent 75%)',
          }}
        />

        {/* Animated Wind Gust Lines When Tapping */}
        <AnimatePresence>
          {windPower > 8 && !isExtinguished && (
            <motion.div
              key={tapBurstKey}
              initial={{ opacity: 0.85, x: -75 }}
              animate={{ opacity: 0, x: 85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
              className="absolute top-8 inset-x-8 flex flex-col items-center gap-2 pointer-events-none z-30"
            >
              <div className="w-28 h-0.5 rounded-full bg-gradient-to-r from-transparent via-ivory/75 to-transparent" />
              <div className="w-36 h-0.5 rounded-full bg-gradient-to-r from-transparent via-champagne/70 to-transparent ml-8" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP CROWN: 4 Classic Candles + Sculpted 3D Golden "22" Centerpiece */}
        <div className="relative w-[220px] sm:w-[245px] h-[92px] z-20 flex items-end justify-center -mb-4">
          {/* 4 Surrounding Classic Luxury Striped Candles */}
          {sideCandles.map((c) => (
            <div
              key={c.id}
              style={{ left: c.left, top: c.top }}
              className="absolute -translate-x-1/2 flex flex-col items-center"
            >
              {renderFlameOrSmoke(c.threshold, c.id)}
              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-[#1E1005]" />
              {/* 3D Cylindrical Candle Body */}
              <div
                style={{ height: `${c.height}px` }}
                className="w-3 sm:w-3.5 rounded-t-sm rounded-b-md border border-[#FFF3C4]/70 shadow-md overflow-hidden relative"
              >
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'repeating-linear-gradient(135deg, #FFF8F0 0px, #FFF8F0 5px, #D8B878 5px, #D8B878 10px, #8F1D3F 10px, #8F1D3F 14px)',
                  }}
                />
              </div>
            </div>
          ))}

          {/* Centerpiece Sculpted 3D Metallic Gold Number "22" Candles */}
          <div className="relative z-10 flex items-end justify-center gap-1.5 pb-1">
            {['first-2', 'second-2'].map((numId, idx) => (
              <div key={numId} className="flex flex-col items-center">
                {renderFlameOrSmoke(92 + idx * 5, numId)}
                {/* Wick */}
                <div className="w-0.5 h-2 bg-[#1E1005] -mb-1" />
                {/* 3D Extruded Gold Number "2" */}
                <div className="relative select-none">
                  {/* 3D Dark Espresso/Gold Extrusion Shadow Layer */}
                  <span
                    aria-hidden="true"
                    className="font-serif font-black text-5xl sm:text-[54px] leading-none block absolute top-[3px] left-[3px]"
                    style={{
                      color: '#2B1504',
                      WebkitTextStroke: '2px #1A0B02',
                    }}
                  >
                    2
                  </span>
                  {/* Front Brushed Metallic Gold Number "2" */}
                  <span
                    className="relative font-serif font-black text-5xl sm:text-[54px] leading-none block"
                    style={{
                      background:
                        'linear-gradient(180deg, #FFF7D6 0%, #F2D388 38%, #C89B42 75%, #8C6218 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 3px 6px rgba(15, 3, 8, 0.7))',
                    }}
                  >
                    2
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 1 (TOP TIER): Royal Dark Chocolate-Burgundy Velvet & Gold Glaze Drips */}
        <div className="relative w-[195px] sm:w-[215px] h-[68px] z-10">
          {/* 3D Top Frosting Elliptical Surface */}
          <div
            className="absolute -top-3.5 inset-x-0 h-7 rounded-full border border-[#FFF2C2]/70 z-20"
            style={{
              background:
                'radial-gradient(ellipse at center, #FFF5EA 0%, #F5D8DE 65%, #E0A6B4 100%)',
              boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.8)',
            }}
          />
          {/* Cylindrical Tier Body */}
          <div
            className="relative w-full h-full rounded-b-2xl overflow-hidden border-x-2 border-b-2 border-[#D8B878]"
            style={{
              background:
                'linear-gradient(90deg, #210610 0%, #4E1529 30%, #631C35 50%, #4E1529 70%, #210610 100%)',
              boxShadow: '0 10px 25px rgba(10, 2, 5, 0.75)',
            }}
          >
            {/* Metallic Gold Drip Glaze SVG */}
            <svg
              viewBox="0 0 200 45"
              preserveAspectRatio="none"
              className="w-full h-9"
            >
              <defs>
                <linearGradient id="goldDrip1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F9E8B2" />
                  <stop offset="55%" stopColor="#D8B878" />
                  <stop offset="100%" stopColor="#9E7329" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 L200,0 L200,14 Q190,28 182,14 Q174,6 165,26 Q156,42 148,16 Q138,6 128,22 Q118,35 108,14 Q98,5 88,30 Q78,44 68,16 Q58,6 48,25 Q38,38 28,14 Q18,6 10,24 Q4,30 0,14 Z"
                fill="url(#goldDrip1)"
              />
            </svg>
            {/* Gold Pearl Trim Along Base of Top Tier */}
            <div className="absolute bottom-1.5 inset-x-3 flex justify-between">
              {[...Array(13)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFF6D6] to-[#B88938] shadow-sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* TIER 2 (MIDDLE TIER): Warm Rose-Blush Cream with Gold & Espresso Filigree */}
        <div className="relative w-[255px] sm:w-[285px] h-[82px] -mt-2 z-[9]">
          {/* 3D Elliptical Top Rim */}
          <div
            className="absolute -top-3.5 inset-x-0 h-7 rounded-full border border-[#D8B878] z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, #FCEEF0 0%, #E8A0AD 85%, #C97A88 100%)',
            }}
          />
          <div
            className="relative w-full h-full rounded-b-2xl overflow-hidden border-x-2 border-b-2 border-[#D8B878]"
            style={{
              background:
                'linear-gradient(90deg, #C77B89 0%, #F3C6CF 25%, #FCECEF 50%, #F3C6CF 75%, #C77B89 100%)',
              boxShadow: '0 14px 30px rgba(12, 2, 6, 0.8)',
            }}
          >
            {/* Subtle Gold Swag Scallops & Dark Espresso Filigree Band */}
            <svg
              viewBox="0 0 280 70"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <path
                d="M0,18 Q35,38 70,18 Q105,38 140,18 Q175,38 210,18 Q245,38 280,18"
                fill="none"
                stroke="#231105"
                strokeWidth="1.8"
                strokeOpacity="0.65"
              />
              <path
                d="M0,22 Q35,42 70,22 Q105,42 140,22 Q175,42 210,22 Q245,42 280,22"
                fill="none"
                stroke="#B88938"
                strokeWidth="2"
              />
              {[35, 105, 175, 245].map((cx) => (
                <circle
                  key={cx}
                  cx={cx}
                  cy={30}
                  r="4"
                  fill="#5A1226"
                  stroke="#D8B878"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* TIER 3 (GRAND BASE TIER): Deep Burgundy Velvet & Gold Couture Plaque */}
        <div className="relative w-[315px] sm:w-[355px] h-[98px] -mt-2 z-[8]">
          {/* 3D Elliptical Top Rim */}
          <div
            className="absolute -top-4 inset-x-0 h-8 rounded-full border border-[#F5E1A4] z-10"
            style={{
              background:
                'radial-gradient(ellipse at center, #6B1D37 0%, #3B101F 80%, #1F050E 100%)',
            }}
          />
          <div
            className="relative w-full h-full rounded-b-3xl overflow-hidden border-x-2 border-b-2 border-[#F5E1A4] flex items-center justify-center"
            style={{
              background:
                'linear-gradient(90deg, #1A040B 0%, #3B101F 22%, #581930 50%, #3B101F 78%, #1A040B 100%)',
              boxShadow: '0 20px 45px rgba(8, 1, 4, 0.92)',
            }}
          >
            {/* Quilted Gold Diamond Pattern */}
            <svg
              viewBox="0 0 350 90"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full opacity-35"
            >
              <defs>
                <pattern
                  id="cakeQuilt"
                  width="35"
                  height="35"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M17.5 0 L35 17.5 L17.5 35 L0 17.5 Z"
                    fill="none"
                    stroke="#D8B878"
                    strokeWidth="1.2"
                  />
                  <circle cx="17.5" cy="17.5" r="2" fill="#F5E1A4" />
                </pattern>
              </defs>
              <rect width="350" height="90" fill="url(#cakeQuilt)" />
            </svg>

            {/* Luxury Black & Gold Royal Birthday Plaque on Front of Base Tier */}
            <div
              className="relative z-10 px-5 py-2 rounded-full border-2 border-[#F5E1A4] shadow-gold-glow flex items-center gap-2 mt-2"
              style={{
                background:
                  'linear-gradient(90deg, #160A03 0%, #2C1507 50%, #160A03 100%)',
              }}
            >
              <Heart className="w-3.5 h-3.5 fill-rose text-rose" />
              <span className="font-serif text-xs sm:text-sm font-bold tracking-[0.22em] text-[#F7E5AE] uppercase">
                HAPPY 22ND • MY BABY BB
              </span>
              <Heart className="w-3.5 h-3.5 fill-rose text-rose" />
            </div>

            {/* Bottom Gold Frosting Pearls */}
            <div className="absolute bottom-2 inset-x-4 flex justify-between">
              {[...Array(19)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFF6D6] to-[#B88938]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* LUXURY BRUSHED-GOLD 3D CAKE PEDESTAL STAND */}
        <div className="relative z-[7] flex flex-col items-center -mt-1">
          {/* Upper Platter Rim */}
          <div
            className="w-[345px] sm:w-[385px] h-4 rounded-full border border-[#FFF6D6]"
            style={{
              background:
                'linear-gradient(90deg, #9C7228 0%, #F7E5AE 35%, #FFF8E1 50%, #F7E5AE 65%, #9C7228 100%)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.85)',
            }}
          />
          {/* Pedestal Neck */}
          <div
            className="w-24 h-5 border-x border-[#F5E1A4]/60"
            style={{
              background:
                'linear-gradient(90deg, #7D5818 0%, #E5C578 50%, #7D5818 100%)',
            }}
          />
          {/* Pedestal Foot */}
          <div
            className="w-44 h-3.5 rounded-full border border-[#FFF4C8]/80 shadow-xl"
            style={{
              background:
                'linear-gradient(90deg, #8F6720 0%, #F5E1A4 50%, #8F6720 100%)',
            }}
          />
        </div>
      </div>

      {/* Controls & Wind Power Meter / Post-Wish Celebration */}
      <div className="w-full max-w-md mx-auto space-y-4">
        {!isExtinguished ? (
          <>
            {/* Wind Power Progress Bar */}
            <div className="glass-card rounded-2xl p-4 border border-champagne/35">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-champagne font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Blow Power</span>
                </span>
                <span>{Math.round(windPower)}%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-burgundy-deep/90 border border-champagne/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose via-champagne to-[#FFF5D6] transition-all duration-75"
                  style={{ width: `${windPower}%` }}
                />
              </div>

              {/* Playful Feedback Toast When She Taps Slowly */}
              <div className="min-h-[2rem] flex items-center justify-center mt-2">
                <AnimatePresence mode="wait">
                  {teaseMessage ? (
                    <motion.p
                      key={teaseMessage}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs sm:text-sm font-medium text-rose"
                    >
                      {teaseMessage}
                    </motion.p>
                  ) : (
                    <p className="text-[11px] sm:text-xs text-blush/70 italic">
                      If you tap slowly, the flames will only dance — tap super fast!
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Rapid-Tap BLOW Button */}
            <motion.button
              type="button"
              onClick={handleBlowTap}
              whileTap={{ scale: 0.92 }}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-extrabold text-base sm:text-lg tracking-wider uppercase shadow-gold-glow border-2 border-ivory/75 flex items-center justify-center gap-3 cursor-pointer select-none active:brightness-110"
            >
              <Wind className="w-5 h-5" />
              <span>BLOW! 💨 (TAP FAST!)</span>
              <Flame className="w-5 h-5 fill-burgundy-deep" />
            </motion.button>
          </>
        ) : (
          /* Celebration Card Once Candles Are Blown Out */
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl glass-card-blush border border-champagne/55 text-ivory">
              <p className="font-serif italic text-base sm:text-lg text-champagne">
                “22 never looked so effortlessly stunning. Your birthday wish is officially sealed, my love.” ✨
              </p>
            </div>

            <motion.button
              type="button"
              onClick={onComplete}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/60 flex items-center justify-center gap-2.5"
            >
              <span>CONTINUE TO YOUR SURPRISE ❤️</span>
              <Heart className="w-4 h-4 fill-burgundy-deep" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
