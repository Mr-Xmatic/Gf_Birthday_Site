import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Heart,
  Sparkles,
  MailOpen,
} from 'lucide-react';
import { MEMORY_PHOTOS, MemoryPhoto } from '../../data/photos';
import { SITE_CONFIG, SecretNote } from '../../data/configuration';
import { SecretMessageModal } from '../SecretMessages/SecretMessageModal';
import { triggerSubtleSparkleBurst } from '../Confetti/CelebrationConfetti';

interface LoopingCarouselMediaProps {
  src: string;
  alt: string;
  isActiveOrNear: boolean;
}

/**
 * Hardware-accelerated GIF-mode media component:
 * Loops MP4 clips silently like a GIF while pausing back-facing cards so the 3D carousel stays 60fps smooth.
 */
const LoopingCarouselMedia: React.FC<LoopingCarouselMediaProps> = ({
  src,
  alt,
  isActiveOrNear,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    if (isActiveOrNear) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActiveOrNear, isVideo]);

  if (isVideo) {
    return (
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full h-full select-none"
        style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
      >
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
        {/* Transparent Long-Press Shield so Mobile Browsers Never Trigger Download Menu */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 z-10"
        />
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full select-none"
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full object-cover select-none pointer-events-none"
      />
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 z-10"
      />
    </div>
  );
};

interface PhotoMemoryGalleryScreenProps {
  onContinueToLetter: () => void;
  onPlayClick: () => void;
  onPlaySecret: () => void;
}

export const PhotoMemoryGalleryScreen: React.FC<
  PhotoMemoryGalleryScreenProps
> = ({ onContinueToLetter, onPlayClick, onPlaySecret }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<MemoryPhoto | null>(null);
  const [activeSecret, setActiveSecret] = useState<SecretNote | null>(null);
  const [discoveredSecrets, setDiscoveredSecrets] = useState<string[]>([]);

  const totalPhotos = MEMORY_PHOTOS.length;
  const angleStep = 360 / totalPhotos;

  // Touch & Pointer Drag State
  const dragStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const rotateBySteps = (steps: number) => {
    onPlayClick();
    setRotationAngle((prev) => prev - steps * angleStep);
    setActiveIndex((prev) => (prev + steps + totalPhotos * 10) % totalPhotos);
  };

  const handleSelectPhotoIndex = (targetIdx: number) => {
    if (targetIdx === activeIndex) {
      onPlayClick();
      setLightboxPhoto(MEMORY_PHOTOS[targetIdx]);
      return;
    }

    // Calculate shortest circular path around the 3D ring
    let diff = targetIdx - activeIndex;
    if (diff > totalPhotos / 2) diff -= totalPhotos;
    if (diff < -totalPhotos / 2) diff += totalPhotos;

    rotateBySteps(diff);
  };

  const handlePointerDown = (clientX: number) => {
    dragStartXRef.current = clientX;
    isDraggingRef.current = false;
  };

  const handlePointerMove = (clientX: number) => {
    if (dragStartXRef.current === null) return;
    const deltaX = clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 42) {
      isDraggingRef.current = true;
      if (deltaX < 0) {
        rotateBySteps(1);
      } else {
        rotateBySteps(-1);
      }
      dragStartXRef.current = clientX;
    }
  };

  const handlePointerUp = () => {
    dragStartXRef.current = null;
  };

  const handleOpenSecret = (secret: SecretNote) => {
    onPlaySecret();
    triggerSubtleSparkleBurst();
    setActiveSecret(secret);
    if (!discoveredSecrets.includes(secret.id)) {
      setDiscoveredSecrets((prev) => [...prev, secret.id]);
    }
  };

  const currentPhoto = MEMORY_PHOTOS[activeIndex];
  const secrets = SITE_CONFIG.galleryScreen.secretNotes;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-between min-h-[90dvh]"
    >
      {/* Hidden Clickable Secret Heart #1 (Top-Left Ambient Glow) */}
      {secrets[0] && (
        <motion.button
          type="button"
          onClick={() => handleOpenSecret(secrets[0])}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Hidden secret heart 1"
          title="Psst... click me"
          className="absolute top-6 left-4 sm:left-8 z-30 p-2 rounded-full bg-rose/10 hover:bg-rose/25 border border-rose/30 text-rose/65 hover:text-rose transition-all shadow-rose-glow"
        >
          <Heart className="w-4 h-4 fill-rose/60" />
        </motion.button>
      )}

      {/* Header Section */}
      <div className="text-center max-w-xl mx-auto mb-2 sm:mb-4 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card border border-champagne/30 text-champagne text-xs uppercase tracking-[0.2em] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>3D Memory Carousel</span>
          {/* Hidden Clickable Secret Heart #3 (Inside Header Badge) */}
          {secrets[2] && (
            <button
              type="button"
              onClick={() => handleOpenSecret(secrets[2])}
              aria-label="Hidden secret heart 3"
              title="Another little secret..."
              className="ml-1 text-rose/75 hover:text-rose hover:scale-125 transition-transform"
            >
              <Heart className="w-3.5 h-3.5 fill-rose/70" />
            </button>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ivory leading-tight mb-2.5">
          {SITE_CONFIG.galleryScreen.heading}
        </h1>

        <p className="text-blush/85 text-sm sm:text-base leading-relaxed">
          {SITE_CONFIG.galleryScreen.supportingText}
        </p>
      </div>

      {/* 3D Circular Carousel Stage (Tuned for 9:16 Vertical Clips) */}
      <div
        className="relative w-full h-[365px] sm:h-[420px] flex items-center justify-center perspective-stage my-1 select-none cursor-grab active:cursor-grabbing overflow-visible"
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      >
        {/* Ambient Pedestal Floor Glow */}
        <div className="absolute bottom-3 w-64 sm:w-80 h-12 rounded-full bg-champagne/15 blur-2xl pointer-events-none" />

        {/* Rotating 3D Cylinder Ring (True 9:16 Aspect Ratio Cards) */}
        <div
          className="relative w-[178px] h-[316px] sm:w-[205px] sm:h-[364px] preserve-3d transition-transform duration-700 ease-out"
          style={{
            transform: `translateZ(-250px) rotateY(${rotationAngle}deg)`,
          }}
        >
          {MEMORY_PHOTOS.map((photo, idx) => {
            const itemAngle = idx * angleStep;
            const isFront = idx === activeIndex;

            // Compute shortest angular distance for depth styling & smart playback
            let angularDiff = Math.abs(idx - activeIndex);
            if (angularDiff > totalPhotos / 2) {
              angularDiff = totalPhotos - angularDiff;
            }

            const radius =
              typeof window !== 'undefined' && window.innerWidth < 640
                ? 235
                : 290;

            return (
              <div
                key={photo.id}
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => {
                  if (!isDraggingRef.current) {
                    handleSelectPhotoIndex(idx);
                  }
                }}
                style={{
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${
                    isFront ? 1.05 : angularDiff === 1 ? 0.88 : 0.76
                  })`,
                  opacity: isFront
                    ? 1
                    : angularDiff === 1
                    ? 0.78
                    : angularDiff === 2
                    ? 0.45
                    : 0.22,
                  filter: isFront ? 'brightness(1.03)' : 'brightness(0.65)',
                }}
                className={`absolute inset-0 rounded-2xl overflow-hidden transition-all duration-700 cursor-pointer bg-burgundy-deep select-none ${
                  isFront
                    ? 'border-2 border-champagne shadow-gold-glow z-20'
                    : 'border border-rose/30 shadow-romantic z-10'
                }`}
              >
                <LoopingCarouselMedia
                  src={photo.src}
                  alt={photo.caption || `Memory ${idx + 1}`}
                  isActiveOrNear={angularDiff <= 1}
                />

                {/* Expand Icon Indicator on Front Card */}
                {isFront && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayClick();
                      setLightboxPhoto(photo);
                    }}
                    aria-label="Open memory in full view"
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-burgundy-deep/75 border border-champagne/45 flex items-center justify-center text-champagne hover:scale-110 transition-transform"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Hidden Clickable Secret Heart #2 (Bottom-Right Stage Corner) */}
        {secrets[1] && (
          <motion.button
            type="button"
            onClick={() => handleOpenSecret(secrets[1])}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Hidden secret heart 2"
            title="Wait... what's this?"
            className="absolute bottom-2 right-3 sm:right-8 z-30 p-2 rounded-full bg-champagne/10 hover:bg-champagne/25 border border-champagne/35 text-champagne/70 hover:text-champagne transition-all shadow-gold-glow"
          >
            <Heart className="w-4 h-4 fill-champagne/60" />
          </motion.button>
        )}
      </div>

      {/* Carousel Controls */}
      <div className="w-full max-w-lg mx-auto text-center space-y-4">
        {/* Navigation Controls + Dots */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => rotateBySteps(-1)}
            aria-label="Previous memory"
            className="w-11 h-11 rounded-full glass-card border border-champagne/35 flex items-center justify-center text-ivory hover:border-champagne transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {MEMORY_PHOTOS.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => handleSelectPhotoIndex(idx)}
                aria-label={`Go to memory ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? 'w-6 bg-champagne'
                    : 'w-2 bg-rose/35 hover:bg-rose/60'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => rotateBySteps(1)}
            aria-label="Next memory"
            className="w-11 h-11 rounded-full glass-card border border-champagne/35 flex items-center justify-center text-ivory hover:border-champagne transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] text-blush/60 tracking-wide">
          Swipe or drag to spin • Tap front card to enlarge •{' '}
          <span className="text-rose/90">
            {discoveredSecrets.length}/{secrets.length} hidden hearts found
          </span>
        </p>

        {/* Continue to Love Letter Button */}
        <div className="pt-1">
          <motion.button
            type="button"
            onClick={onContinueToLetter}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/45 inline-flex items-center justify-center gap-2.5"
          >
            <MailOpen className="w-4 h-4" />
            <span>{SITE_CONFIG.galleryScreen.continueButtonLabel}</span>
          </motion.button>
        </div>
      </div>

      {/* Fullscreen Romantic 9:16 Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-dark/90 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm glass-card-blush rounded-3xl overflow-hidden border border-champagne/50 shadow-gold-glow"
            >
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                aria-label="Close lightbox"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-burgundy-deep/80 border border-champagne/40 flex items-center justify-center text-ivory"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                onContextMenu={(e) => e.preventDefault()}
                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
                className="relative w-full aspect-[9/16] max-h-[82dvh] bg-burgundy-deep select-none"
              >
                {/\.(mp4|webm|mov)$/i.test(lightboxPhoto.src) ? (
                  <video
                    src={lightboxPhoto.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    disableRemotePlayback
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                ) : (
                  <img
                    src={lightboxPhoto.src}
                    alt={lightboxPhoto.caption || 'Memory'}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                )}
                {/* Transparent Long-Press Shield over Lightbox Media */}
                <div
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute inset-0 z-10"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Note Popup Modal */}
      <SecretMessageModal
        secret={activeSecret}
        onClose={() => setActiveSecret(null)}
      />
    </motion.section>
  );
};
