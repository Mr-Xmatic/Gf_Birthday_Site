import React from 'react';
import { motion } from 'framer-motion';

export type GiftBoxPhase =
  | 'idle'
  | 'shaking'
  | 'ribbon-loosening'
  | 'lid-opening'
  | 'opened'
  | 'fading-out';

interface GiftBoxProps {
  phase: GiftBoxPhase;
  variant?: 'first' | 'second';
  onClick?: () => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({
  phase,
  variant = 'first',
  onClick,
}) => {
  const isRibbonGone =
    phase === 'ribbon-loosening' ||
    phase === 'lid-opening' ||
    phase === 'opened' ||
    phase === 'fading-out';

  const isLidOpen =
    phase === 'lid-opening' || phase === 'opened' || phase === 'fading-out';

  return (
    <motion.div
      onClick={phase === 'idle' ? onClick : undefined}
      animate={
        phase === 'idle'
          ? { y: [0, -8, 0] }
          : phase === 'shaking'
          ? {
              rotate: [0, -3, 3, -3.5, 3.5, -2, 2, 0],
              scale: [1, 1.03, 1],
              y: 0,
            }
          : phase === 'fading-out'
          ? { opacity: 0, scale: 0.88, y: 48 }
          : { y: 0, opacity: 1, scale: 1 }
      }
      transition={
        phase === 'idle'
          ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
          : phase === 'shaking'
          ? { duration: 0.55, ease: 'easeInOut' }
          : phase === 'fading-out'
          ? { duration: 1.35, ease: 'easeInOut' }
          : { duration: 0.5 }
      }
      className={`relative w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-end select-none ${
        phase === 'idle' ? 'cursor-pointer' : ''
      }`}
    >
      {/* Ambient Golden & Rose Luxury Glow Behind Box */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{
          background: isLidOpen
            ? 'radial-gradient(circle, rgba(255, 232, 165, 0.55) 0%, rgba(216, 184, 120, 0.25) 55%, transparent 75%)'
            : 'radial-gradient(circle, rgba(216, 184, 120, 0.26) 0%, rgba(232, 160, 173, 0.12) 55%, transparent 75%)',
        }}
      />

      {/* Floating Small Golden Particles Around Box */}
      <div className="absolute -inset-6 pointer-events-none">
        {[
          { left: '8%', top: '18%', delay: '0s', size: 5 },
          { left: '88%', top: '14%', delay: '0.6s', size: 6 },
          { left: '14%', top: '76%', delay: '1.2s', size: 4 },
          { left: '86%', top: '72%', delay: '1.8s', size: 5 },
          { left: '50%', top: '4%', delay: '0.9s', size: 6 },
        ].map((p, idx) => (
          <motion.span
            key={idx}
            animate={{
              y: [0, -10, 0],
              opacity: [0.35, 0.9, 0.35],
              scale: [0.85, 1.2, 0.85],
            }}
            transition={{
              duration: 2.6,
              delay: idx * 0.35,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
            }}
            className="absolute rounded-full bg-[#FCEAB8] shadow-[0_0_10px_#D8B878]"
          />
        ))}
      </div>

      {/* Warm Golden Interior Light Shining Upward When Lid Opens */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.2 }}
        animate={
          isLidOpen
            ? { opacity: 1, scaleY: 1.15, scaleX: 1.1 }
            : { opacity: 0, scaleY: 0.2 }
        }
        transition={{ duration: 0.75, ease: 'easeOut' }}
        style={{
          transformOrigin: 'bottom center',
          background:
            'radial-gradient(ellipse at 50% 85%, rgba(255, 246, 210, 0.95) 0%, rgba(216, 184, 120, 0.55) 42%, rgba(232, 160, 173, 0.15) 70%, transparent 100%)',
        }}
        className="absolute bottom-24 w-56 h-44 rounded-full blur-md pointer-events-none z-20"
      />

      {/* GIFT BOX LID + BOW */}
      <motion.div
        animate={
          isLidOpen
            ? {
                y: -78,
                x: variant === 'second' ? 0 : 28,
                rotate: variant === 'second' ? -8 : 16,
                opacity: phase === 'fading-out' ? 0 : 0.92,
              }
            : { y: 0, x: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-30 w-48 sm:w-56 flex flex-col items-center -mb-1"
      >
        {/* Sculpted 3D Champagne-Gold Decorative Bow on Top */}
        <motion.div
          animate={
            isRibbonGone
              ? { scale: 1.25, opacity: 0, y: -18 }
              : { scale: 1, opacity: 1, y: 0 }
          }
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative flex items-center justify-center -mb-2 z-20"
        >
          {/* Left Bow Loop */}
          <div
            className="w-12 h-8 sm:w-14 sm:h-9 rounded-tl-full rounded-bl-full -mr-1.5 transform -rotate-12 border border-[#FFF6D6]/80 shadow-md"
            style={{
              background:
                'linear-gradient(135deg, #FFF5D6 0%, #D8B878 50%, #966D25 100%)',
            }}
          />
          {/* Right Bow Loop */}
          <div
            className="w-12 h-8 sm:w-14 sm:h-9 rounded-tr-full rounded-br-full -ml-1.5 transform rotate-12 border border-[#FFF6D6]/80 shadow-md"
            style={{
              background:
                'linear-gradient(225deg, #FFF5D6 0%, #D8B878 50%, #966D25 100%)',
            }}
          />
          {/* Center Bow Knot */}
          <div
            className="absolute w-6 h-6 rounded-md border border-[#FFF8E1] shadow-lg z-10"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, #FFF8E1 0%, #D8B878 60%, #8C631E 100%)',
            }}
          />
        </motion.div>

        {/* 3D Box Lid Body */}
        <div
          className="relative w-full h-11 sm:h-12 rounded-xl overflow-hidden border border-[#F5E1A4]/75 shadow-[0_10px_24px_rgba(12,2,6,0.75)] flex items-center justify-center"
          style={{
            background:
              'linear-gradient(90deg, #2B0814 0%, #56182E 28%, #6D203B 50%, #56182E 72%, #2B0814 100%)',
          }}
        >
          {/* Top Lid Specular Highlight */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#FFF5D6]/45 to-transparent" />

          {/* Lid Vertical Gold Ribbon Band */}
          <motion.div
            animate={
              isRibbonGone ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }
            }
            transition={{ duration: 0.4 }}
            className="w-8 sm:w-9 h-full border-x border-[#FFF6D6]/80 shadow-sm"
            style={{
              background:
                'linear-gradient(90deg, #B58938 0%, #F7E5AE 50%, #B58938 100%)',
            }}
          />
        </div>
      </motion.div>

      {/* GIFT BOX BASE BODY */}
      <div
        className="relative z-10 w-44 sm:w-52 h-36 sm:h-40 rounded-b-2xl rounded-t-sm overflow-hidden border border-[#D8B878]/65 flex items-center justify-center"
        style={{
          background:
            'linear-gradient(90deg, #1E050D 0%, #441224 25%, #591930 50%, #441224 75%, #1E050D 100%)',
          boxShadow:
            '0 28px 55px -10px rgba(8, 1, 4, 0.92), inset 0 6px 18px rgba(0, 0, 0, 0.55)',
        }}
      >
        {/* Subtle Damask Filigree Watermark on Burgundy Wrapping */}
        <div
          className="absolute inset-2 rounded-xl border border-[#D8B878]/25 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(216, 184, 120, 0.16) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />

        {/* Vertical Champagne-Gold Ribbon */}
        <motion.div
          animate={
            isRibbonGone
              ? { y: 40, opacity: 0, scaleX: 0.5 }
              : { y: 0, opacity: 1, scaleX: 1 }
          }
          transition={{ duration: 0.45 }}
          className="relative z-10 w-8 sm:w-9 h-full border-x border-[#FFF6D6]/75 shadow-md"
          style={{
            background:
              'linear-gradient(90deg, #A87C2D 0%, #F5E1A4 50%, #A87C2D 100%)',
          }}
        />

        {/* Horizontal Champagne-Gold Ribbon */}
        <motion.div
          animate={
            isRibbonGone
              ? { scaleY: 0.4, opacity: 0 }
              : { scaleY: 1, opacity: 1 }
          }
          transition={{ duration: 0.45 }}
          className="absolute inset-x-0 h-7 sm:h-8 border-y border-[#FFF6D6]/75 shadow-md"
          style={{
            background:
              'linear-gradient(180deg, #A87C2D 0%, #F5E1A4 50%, #A87C2D 100%)',
          }}
        />

        {/* Luxury Gold Crest Tag on Box Center */}
        <motion.div
          animate={isRibbonGone ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute z-20 px-3 py-1 rounded-full border border-[#FFF6D6] shadow-md"
          style={{
            background:
              'linear-gradient(135deg, #2B0814 0%, #4E1529 100%)',
          }}
        >
          <span className="font-serif text-[10px] font-bold tracking-[0.22em] text-[#F5E1A4] uppercase">
            {variant === 'second' ? 'BB • II' : 'FOR BB'}
          </span>
        </motion.div>
      </div>

      {/* Realistic Floor Shadow */}
      <div className="w-48 sm:w-56 h-5 -mt-2 rounded-full bg-black/65 blur-md pointer-events-none" />
    </motion.div>
  );
};
