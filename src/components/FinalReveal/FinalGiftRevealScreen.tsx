import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Sparkles,
  Heart,
  RotateCcw,
  Images,
  MailOpen,
  Mic2,
  Music,
  Ticket,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import {
  triggerGrandCelebrationConfetti,
  triggerSubtleSparkleBurst,
} from '../Confetti/CelebrationConfetti';

interface FinalGiftRevealScreenProps {
  onPlayClick: () => void;
  onPlaySuccess: () => void;
  onEnsureMusicPlaying?: () => void;
  onNavigateToGallery: () => void;
  onNavigateToLetter: () => void;
  onRestartExperience: () => void;
}

export const FinalGiftRevealScreen: React.FC<FinalGiftRevealScreenProps> = ({
  onPlayClick,
  onPlaySuccess,
  onEnsureMusicPlaying,
  onNavigateToGallery,
  onNavigateToLetter,
  onRestartExperience,
}) => {
  const [hasClickedInitialButton, setHasClickedInitialButton] = useState(false);
  const [visibleLinesCount, setVisibleLinesCount] = useState(0);
  const [showCheekyHighlight, setShowCheekyHighlight] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [hasAcknowledgedFinalJoke, setHasAcknowledgedFinalJoke] = useState(false);
  const [showConcertTicket, setShowConcertTicket] = useState(false);
  const [concertClaimed, setConcertClaimed] = useState(false);
  const [ticketDownloaded, setTicketDownloaded] = useState(false);

  const lines = SITE_CONFIG.finalRevealScreen.progressiveLines;
  const concert = SITE_CONFIG.finalRevealScreen.concertSurprise;

  useEffect(() => {
    if (!hasClickedInitialButton) return;

    const timers: number[] = [];

    lines.forEach((_, idx) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleLinesCount(idx + 1);
        }, 500 + idx * 1700)
      );
    });

    const cheekyTime = 500 + lines.length * 1700 + 300;
    timers.push(
      window.setTimeout(() => {
        setShowCheekyHighlight(true);
        triggerSubtleSparkleBurst();
      }, cheekyTime)
    );

    timers.push(
      window.setTimeout(() => {
        setShowFinalButton(true);
      }, cheekyTime + 1200)
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [hasClickedInitialButton, lines]);

  const handleOpenOneMoreGift = () => {
    onPlayClick();
    setHasClickedInitialButton(true);
  };

  const handleFinalCheekyAcknowledge = () => {
    onPlaySuccess();
    triggerGrandCelebrationConfetti();
    setHasAcknowledgedFinalJoke(true);
  };

  const handleRevealConcertTicket = () => {
    onPlaySuccess();
    if (onEnsureMusicPlaying) onEnsureMusicPlaying();
    triggerSubtleSparkleBurst();
    setShowConcertTicket(true);
  };

  const handleClaimConcert = () => {
    onPlaySuccess();
    if (onEnsureMusicPlaying) onEnsureMusicPlaying();
    triggerGrandCelebrationConfetti();
    setConcertClaimed(true);
  };

  // Generate and download a high-resolution luxury VIP Concert Ticket PNG
  const handleDownloadTicket = useCallback(() => {
    onPlaySuccess();
    triggerSubtleSparkleBurst();

    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 620;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Deep Velvet Burgundy Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#2B0814');
    bgGrad.addColorStop(0.5, '#461224');
    bgGrad.addColorStop(1, '#1E040C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Gold & Rose Glows
    const glowGrad = ctx.createRadialGradient(420, 260, 20, 420, 260, 480);
    glowGrad.addColorStop(0, 'rgba(216, 184, 120, 0.22)');
    glowGrad.addColorStop(0.6, 'rgba(232, 160, 173, 0.08)');
    glowGrad.addColorStop(1, 'rgba(30, 4, 12, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Outer Metallic Gold Foil Border
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#F5E1A4');
    goldGrad.addColorStop(0.5, '#D8B878');
    goldGrad.addColorStop(1, '#B5893D');

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 5;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    ctx.strokeStyle = 'rgba(248, 230, 232, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // 4. Ticket Semicircle Cutout Notches (Left, Right, & Stub Divider)
    const stubX = 875;
    ctx.fillStyle = '#140208';
    [
      [0, height / 2, 34],
      [width, height / 2, 34],
      [stubX, 0, 26],
      [stubX, height, 26],
    ].forEach(([cx, cy, r]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // 5. Perforated Gold Dashed Line for Ticket Stub
    ctx.save();
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = 'rgba(216, 184, 120, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(stubX, 42);
    ctx.lineTo(stubX, height - 42);
    ctx.stroke();
    ctx.restore();

    // 6. Main Ticket Content (Left Side)
    ctx.fillStyle = '#D8B878';
    ctx.font = 'bold 17px "DM Sans", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('★ VIP FRONT-ROW ACCESS • NOVEMBER 4 BIRTHDAY SPECIAL ★', 72, 92);

    ctx.fillStyle = '#FFF8F0';
    ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '0px';
    ctx.fillText('Private Live Performance For My Baby', 72, 152);

    // Song Highlight Box
    ctx.fillStyle = 'rgba(25, 4, 11, 0.78)';
    ctx.strokeStyle = 'rgba(216, 184, 120, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(72, 182, 750, 128, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F5E1A4';
    ctx.font = 'italic bold 38px "Playfair Display", Georgia, serif';
    ctx.fillText('“Hold My Hand” — Sean Paul', 102, 238);

    ctx.fillStyle = '#F8E6E8';
    ctx.font = '500 21px "DM Sans", sans-serif';
    ctx.fillText('Performed Live & Dressed to Impress by Your Man', 102, 278);

    // Details Grid
    ctx.fillStyle = '#D8B878';
    ctx.font = 'bold 15px "DM Sans", sans-serif';
    ctx.fillText('DRESS CODE', 72, 360);
    ctx.fillText('SHOWTIME', 380, 360);
    ctx.fillText('EXCLUSIVITY', 650, 360);

    ctx.fillStyle = '#FFF8F0';
    ctx.font = '600 20px "DM Sans", sans-serif';
    ctx.fillText('Full Stage Fit • Dressed Up', 72, 390);
    ctx.fillText('Nov 4 • Birthday Evening', 380, 390);
    ctx.fillText('For Your Eyes Only', 650, 390);

    // Cheeky Encore Line
    ctx.fillStyle = '#E8A0AD';
    ctx.font = 'italic 22px "Playfair Display", Georgia, serif';
    ctx.fillText(
      'Encore: Followed immediately by that other gift you have to take in... ;)',
      72,
      462
    );

    // Footer Signature
    ctx.fillStyle = '#D8B878';
    ctx.font = 'bold 26px "Caveat", cursive, serif';
    ctx.fillText('Signed with love: YOUR X. ♥', 72, 535);

    // 7. Right Ticket Stub Details + Red "X" Wax Seal
    const stubCenterX = stubX + (width - stubX) / 2;
    ctx.textAlign = 'center';

    ctx.fillStyle = '#D8B878';
    ctx.font = 'bold 16px "DM Sans", sans-serif';
    ctx.fillText('ADMIT ONE', stubCenterX, 100);

    ctx.fillStyle = '#FFF8F0';
    ctx.font = 'bold 34px "Playfair Display", Georgia, serif';
    ctx.fillText('MY BABY (BB)', stubCenterX, 145);

    ctx.fillStyle = '#E8A0AD';
    ctx.font = '600 18px "DM Sans", sans-serif';
    ctx.fillText('DATE: 04 / 11 / 2026', stubCenterX, 195);
    ctx.fillText('SEAT: FRONT ROW', stubCenterX, 225);

    // Red Wax Seal with "X" on Stub
    const sealY = 345;
    const sealGrad = ctx.createRadialGradient(
      stubCenterX - 10,
      sealY - 10,
      5,
      stubCenterX,
      sealY,
      58
    );
    sealGrad.addColorStop(0, '#D92B2B');
    sealGrad.addColorStop(0.55, '#9E1111');
    sealGrad.addColorStop(1, '#4D0303');

    ctx.beginPath();
    ctx.arc(stubCenterX, sealY, 56, 0, Math.PI * 2);
    ctx.fillStyle = sealGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F5E1A4';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(stubCenterX, sealY, 42, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 230, 180, 0.6)';
    ctx.stroke();

    ctx.fillStyle = '#FCE6B4';
    ctx.font = 'bold 42px "Playfair Display", Georgia, serif';
    ctx.fillText('X', stubCenterX, sealY + 15);

    // Ticket Number on Stub
    ctx.fillStyle = 'rgba(255, 248, 240, 0.65)';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('NO. 0411-2004-BB', stubCenterX, 465);

    ctx.fillStyle = '#D8B878';
    ctx.font = 'bold 14px "DM Sans", sans-serif';
    ctx.fillText('VIP BACKSTAGE PASS', stubCenterX, 505);

    // Trigger Browser Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'BB-VIP-Concert-Ticket-Nov4.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTicketDownloaded(true);
  }, [onPlaySuccess]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[88dvh] text-center"
    >
      <div className="w-full glass-card-blush rounded-3xl p-7 sm:p-11 border border-champagne/40 shadow-romantic relative overflow-hidden">
        {/* Ambient Intimate Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-rose/20 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne/30 via-rose/25 to-burgundy border border-champagne/55 flex items-center justify-center shadow-gold-glow"
        >
          {showConcertTicket ? (
            <Mic2 className="w-7 h-7 text-champagne" />
          ) : (
            <Gift className="w-7 h-7 text-champagne" />
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!hasClickedInitialButton ? (
            <motion.div
              key="tease-prompt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="space-y-8"
            >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-ivory leading-tight">
                {SITE_CONFIG.finalRevealScreen.initialTeaseHeading}
              </h1>

              <motion.button
                type="button"
                onClick={handleOpenOneMoreGift}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-9 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50 inline-flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{SITE_CONFIG.finalRevealScreen.initialButtonLabel}</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="progressive-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="space-y-5 py-2">
                {lines.slice(0, visibleLinesCount).map((line, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className={`font-serif ${
                      index === 2
                        ? 'text-2xl sm:text-3xl text-ivory font-semibold italic'
                        : 'text-xl sm:text-2xl text-blush/95'
                    } leading-relaxed`}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Cheeky Highlight Line */}
              <AnimatePresence>
                {showCheekyHighlight && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      type: 'spring',
                      stiffness: 180,
                    }}
                    className="py-4 px-6 rounded-2xl bg-gradient-to-r from-rose/20 via-champagne/25 to-rose/20 border border-champagne/55 shadow-gold-glow"
                  >
                    <p className="font-serif text-2xl sm:text-4xl font-bold text-champagne">
                      {SITE_CONFIG.finalRevealScreen.cheekyHighlightLine}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final Inside-Joke Button */}
              <AnimatePresence>
                {showFinalButton && !hasAcknowledgedFinalJoke && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="pt-4"
                  >
                    <motion.button
                      type="button"
                      onClick={handleFinalCheekyAcknowledge}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50"
                    >
                      {SITE_CONFIG.finalRevealScreen.finalButtonLabel}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Post-Click Intimate Finale Card + Evening Live Performance Surprise */}
              <AnimatePresence>
                {hasAcknowledgedFinalJoke && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="pt-4 space-y-6"
                  >
                    <div className="p-5 rounded-2xl bg-burgundy-deep/80 border border-rose/40 text-ivory space-y-2 shadow-rose-glow">
                      <div className="flex justify-center gap-1.5 text-rose mb-1">
                        <Heart className="w-5 h-5 fill-rose" />
                        <Sparkles className="w-5 h-5 text-champagne" />
                        <Heart className="w-5 h-5 fill-rose" />
                      </div>
                      <p className="text-base sm:text-lg font-medium text-blush leading-relaxed">
                        {SITE_CONFIG.finalRevealScreen.finalUnlockedNote}
                      </p>
                      <p className="font-handwriting text-2xl text-champagne pt-1">
                        {SITE_CONFIG.senderSignature}
                      </p>
                    </div>

                    {/* Bonus Surprise: Sean Paul "Hold My Hand" Evening Performance VIP Pass */}
                    {!showConcertTicket ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="pt-2"
                      >
                        <motion.button
                          type="button"
                          onClick={handleRevealConcertTicket}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-xs sm:text-sm tracking-wider uppercase shadow-gold-glow border border-ivory/60 flex items-center justify-center gap-2.5"
                        >
                          <Mic2 className="w-4 h-4 shrink-0" />
                          <span>{concert.teaseButtonLabel}</span>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.55, type: 'spring' }}
                        className="relative rounded-3xl p-6 sm:p-7 text-left border-2 border-champagne shadow-gold-glow overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(145deg, rgba(45, 10, 22, 0.96) 0%, rgba(78, 23, 43, 0.92) 55%, rgba(32, 6, 15, 0.98) 100%)',
                        }}
                      >
                        {/* Ticket Perforation Cutouts */}
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-burgundy-deep border-r-2 border-champagne/70" />
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-burgundy-deep border-l-2 border-champagne/70" />

                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne/20 border border-champagne/50 text-champagne text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase">
                            <Ticket className="w-3.5 h-3.5" />
                            <span>{concert.badge}</span>
                          </span>
                          <Music className="w-5 h-5 text-rose animate-bounce" />
                        </div>

                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ivory mb-1">
                          {concert.title}
                        </h3>

                        <div className="my-3 p-3.5 rounded-2xl bg-burgundy-dark/80 border border-champagne/40 flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-champagne to-rose flex items-center justify-center text-burgundy-deep shrink-0 shadow-gold-glow">
                            <Mic2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-serif text-xl sm:text-2xl font-bold text-champagne">
                              {concert.songTitle}
                            </p>
                            <p className="text-xs sm:text-sm text-blush/90">
                              {concert.artist}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm sm:text-base text-blush/95 leading-relaxed mb-4">
                          {concert.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs mb-4 pt-3 border-t border-champagne/25">
                          <div className="p-2.5 rounded-xl bg-burgundy-dark/60 border border-rose/25">
                            <span className="text-champagne uppercase tracking-wider block font-semibold mb-0.5">
                              Dress Code
                            </span>
                            <span className="text-ivory font-medium">
                              {concert.dressCode}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-burgundy-dark/60 border border-rose/25">
                            <span className="text-champagne uppercase tracking-wider block font-semibold mb-0.5">
                              Showtime
                            </span>
                            <span className="text-ivory font-medium">
                              {concert.showTime}
                            </span>
                          </div>
                        </div>

                        <p className="font-serif italic text-sm sm:text-base text-rose mb-5">
                          {concert.encoreNote}
                        </p>

                        {!concertClaimed ? (
                          <motion.button
                            type="button"
                            onClick={handleClaimConcert}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-xs sm:text-sm uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2"
                          >
                            <Mic2 className="w-4 h-4" />
                            <span>{concert.claimButtonLabel}</span>
                          </motion.button>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <div className="w-full py-3 px-4 rounded-2xl bg-champagne/15 border border-champagne/60 text-champagne font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 text-center">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>Front-Row Seat Reserved For Tonight! 🎤🔥</span>
                            </div>

                            <motion.button
                              type="button"
                              onClick={handleDownloadTicket}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              className="w-full py-4 px-5 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-xs sm:text-sm uppercase tracking-wider shadow-gold-glow border border-ivory/60 flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                              <Download className="w-4 h-4 shrink-0" />
                              <span>
                                {ticketDownloaded
                                  ? 'Download VIP Ticket Again 🎟️✨'
                                  : 'Download Your VIP Ticket 🎟️⬇️'}
                              </span>
                            </motion.button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Quick Revisit Buttons so she can admire the gallery or letter again */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onNavigateToGallery}
                        className="px-4 py-2.5 rounded-full glass-card border border-champagne/35 text-xs uppercase tracking-wider text-ivory hover:border-champagne inline-flex items-center gap-2"
                      >
                        <Images className="w-3.5 h-3.5 text-champagne" />
                        <span>3D Memories</span>
                      </button>

                      <button
                        type="button"
                        onClick={onNavigateToLetter}
                        className="px-4 py-2.5 rounded-full glass-card border border-champagne/35 text-xs uppercase tracking-wider text-ivory hover:border-champagne inline-flex items-center gap-2"
                      >
                        <MailOpen className="w-3.5 h-3.5 text-champagne" />
                        <span>Love Letter</span>
                      </button>

                      <button
                        type="button"
                        onClick={onRestartExperience}
                        className="px-4 py-2.5 rounded-full glass-card border border-rose/35 text-xs uppercase tracking-wider text-blush/85 hover:text-ivory inline-flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose" />
                        <span>Replay All</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
