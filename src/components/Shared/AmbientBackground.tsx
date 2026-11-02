import React, { useMemo } from 'react';

interface FloatingParticle {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  driftX: string;
  rotEnd: string;
  maxOpacity: number;
  type: 'heart' | 'sparkle';
}

export const AmbientBackground: React.FC = () => {
  const particles = useMemo<FloatingParticle[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 5.7 + 3) % 94}%`,
      size: i % 3 === 0 ? 18 : i % 2 === 0 ? 14 : 10,
      duration: `${14 + (i % 7) * 2.5}s`,
      delay: `${-(i * 1.7)}s`,
      driftX: `${i % 2 === 0 ? 28 : -28}px`,
      rotEnd: `${i % 2 === 0 ? 24 : -24}deg`,
      maxOpacity: i % 3 === 0 ? 0.28 : 0.18,
      type: i % 3 === 0 ? 'sparkle' : 'heart',
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Ambient Radial Luxury Glows */}
      <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full bg-rose/10 blur-3xl animate-pulse-glow" />
      <div
        className="absolute top-1/3 -right-32 w-[26rem] h-[26rem] rounded-full bg-champagne/10 blur-3xl animate-pulse-glow"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-blush/5 blur-3xl animate-pulse-glow"
        style={{ animationDelay: '3.5s' }}
      />

      {/* Subtle Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 55%, rgba(16, 2, 7, 0.55) 100%)',
        }}
      />

      {/* Floating Hearts & Sparkles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 animate-float-up select-none"
          style={
            {
              left: p.left,
              '--duration': p.duration,
              '--delay': p.delay,
              '--drift-x': p.driftX,
              '--rot-end': p.rotEnd,
              '--max-opacity': p.maxOpacity,
            } as React.CSSProperties
          }
        >
          {p.type === 'heart' ? (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-rose/70 drop-shadow-[0_0_8px_rgba(232,160,173,0.4)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-champagne/80 drop-shadow-[0_0_8px_rgba(216,184,120,0.5)]"
            >
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};
