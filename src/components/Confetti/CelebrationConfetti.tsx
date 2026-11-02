import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ROMANTIC_CONFETTI_COLORS = [
  '#E8A0AD', // Rose pink
  '#D8B878', // Champagne gold
  '#F8E6E8', // Warm blush
  '#FFF8F0', // Warm ivory
  '#EAD3A3', // Soft gold highlight
];

export function triggerGrandCelebrationConfetti() {
  // Respect reduced motion preference
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.6 },
      colors: ROMANTIC_CONFETTI_COLORS,
    });
    return;
  }

  // Initial center burst
  confetti({
    particleCount: 70,
    spread: 80,
    origin: { y: 0.58 },
    colors: ROMANTIC_CONFETTI_COLORS,
    scalar: 1.05,
  });

  // Elegant side cannons over 2.2 seconds
  const end = Date.now() + 2200;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ROMANTIC_CONFETTI_COLORS,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ROMANTIC_CONFETTI_COLORS,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
}

export function triggerSubtleSparkleBurst() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  confetti({
    particleCount: 18,
    spread: 55,
    startVelocity: 22,
    gravity: 0.7,
    scalar: 0.75,
    origin: { y: 0.68 },
    colors: ['#E8A0AD', '#D8B878', '#FFF8F0'],
  });
}

interface CelebrationConfettiProps {
  active: boolean;
}

export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({
  active,
}) => {
  useEffect(() => {
    if (active) {
      triggerGrandCelebrationConfetti();
    }
  }, [active]);

  return null;
};
