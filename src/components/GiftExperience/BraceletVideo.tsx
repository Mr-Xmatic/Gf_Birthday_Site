import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface BraceletVideoProps {
  videoPath: string;
  shouldPlay: boolean;
  onRotationComplete: () => void;
}

export const BraceletVideo: React.FC<BraceletVideoProps> = ({
  videoPath,
  shouldPlay,
  onRotationComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sampledBgColor, setSampledBgColor] = useState<string>('#21050E');

  // Store callback & state in refs so parent 1-second clock ticks never reset the video
  const onRotationCompleteRef = useRef(onRotationComplete);
  const hasStartedPlaybackRef = useRef(false);
  const hasTriggeredCompleteRef = useRef(false);

  useEffect(() => {
    onRotationCompleteRef.current = onRotationComplete;
  }, [onRotationComplete]);

  const markComplete = useCallback(() => {
    setHasCompleted(true);
    if (!hasTriggeredCompleteRef.current) {
      hasTriggeredCompleteRef.current = true;
      onRotationCompleteRef.current();
    }
  }, []);

  // Sample the corner pixel of the video's first frame so the surrounding stage blends seamlessly
  const handleLoadedData = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 4;
      canvas.height = 4;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, 4, 4);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        if (pixel[3] > 0) {
          setSampledBgColor(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
        }
      }
    } catch {
      // Ignore canvas errors
    }
  }, []);

  // Trigger inline playback strictly ONCE when shouldPlay becomes true, plus a 6.2s fallback timer
  useEffect(() => {
    if (!shouldPlay || hasStartedPlaybackRef.current) return;
    hasStartedPlaybackRef.current = true;

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {
            markComplete();
          });
        });
      }
    }

    // Guaranteed safety timer after 6.2 seconds so the next screen always unlocks after the 6s rotation
    const fallbackTimer = window.setTimeout(() => {
      markComplete();
    }, 6200);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [shouldPlay, markComplete]);

  const handleVideoEnded = () => {
    markComplete();
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    setHasCompleted(false);
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Subtle Champagne-Gold & Burgundy Illumination Behind the Emerging Bracelet */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(216, 184, 120, 0.28) 0%, rgba(59, 16, 31, 0.45) 55%, transparent 80%)',
        }}
      />

      {/* Seamless Floating Container (Transitions into gentle idle float after rotation completes) */}
      <motion.div
        animate={
          hasCompleted
            ? { y: [0, -7, 0], scale: [1, 1.012, 1] }
            : { y: 0, scale: 1 }
        }
        transition={
          hasCompleted
            ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.4 }
        }
        style={{
          backgroundColor: sampledBgColor,
          boxShadow:
            '0 30px 70px -10px rgba(8, 1, 4, 0.9), 0 0 55px rgba(216, 184, 120, 0.22)',
        }}
        className="relative w-full max-w-2xl aspect-video rounded-[2rem] overflow-hidden flex items-center justify-center border border-champagne/40"
      >
        {/* Soft Vignette Edge Feathering so the video blends organically into the luxury stage */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            boxShadow: `inset 0 0 38px 14px ${sampledBgColor}, inset 0 0 80px rgba(36, 7, 17, 0.55)`,
          }}
        />

        {!hasError ? (
          <video
            ref={videoRef}
            src={videoPath}
            muted
            playsInline
            preload="auto"
            onLoadedData={handleLoadedData}
            onEnded={handleVideoEnded}
            onError={() => {
              setHasError(true);
              markComplete();
            }}
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        ) : (
          <div className="p-8 text-center text-champagne font-serif italic">
            Your luxury bracelet reveal video (`{videoPath}`) will play here.
          </div>
        )}

        {/* Discreet Replay Control After Completion */}
        {hasCompleted && !hasError && (
          <motion.button
            type="button"
            onClick={handleReplay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Replay bracelet 3D rotation"
            title="Replay 3D rotation"
            className="absolute bottom-3.5 right-3.5 z-20 px-3.5 py-1.5 rounded-full bg-burgundy-deep/80 backdrop-blur-md border border-champagne/45 text-champagne text-[11px] uppercase tracking-wider font-medium flex items-center gap-1.5 hover:border-champagne transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay 3D View</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
