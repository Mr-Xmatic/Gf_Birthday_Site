import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBirthdayGate } from './hooks/useBirthdayGate';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { AmbientBackground } from './components/Shared/AmbientBackground';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { MysteryLandingScreen } from './components/Countdown/MysteryLandingScreen';
import { BirthdayUnlockScreen } from './components/BirthdayUnlock/BirthdayUnlockScreen';
import { PasswordScreen } from './components/PasswordScreen/PasswordScreen';
import { ThreeSecondCountdownScreen } from './components/Countdown/ThreeSecondCountdownScreen';
import { BirthdayCakeScreen } from './components/BirthdayUnlock/BirthdayCakeScreen';
import { QuizIntroScreen } from './components/Quiz/QuizIntroScreen';
import { PersonalizedQuizScreen } from './components/Quiz/PersonalizedQuizScreen';
import { QuizCompletionScreen } from './components/Quiz/QuizCompletionScreen';
import { PhotoMemoryGalleryScreen } from './components/PhotoCarousel/PhotoMemoryGalleryScreen';
import { InteractiveLoveLetterScreen } from './components/LoveLetter/InteractiveLoveLetterScreen';
import { GiftBoxExperienceScreen } from './components/GiftExperience/GiftBoxExperienceScreen';
import { FinalGiftRevealScreen } from './components/FinalReveal/FinalGiftRevealScreen';

export type ExperienceStage =
  | 'birthday-unlock'
  | 'password'
  | 'countdown-321'
  | 'cake-candles'
  | 'quiz-intro'
  | 'quiz'
  | 'quiz-completion'
  | 'photo-gallery'
  | 'love-letter'
  | 'gift-experience'
  | 'final-reveal';

const SESSION_STAGE_KEY = 'project_bb_current_stage';

export const App: React.FC = () => {
  const {
    isBirthdayReached,
    isSimulatingBirthday,
    setSimulateBirthday,
    countdown,
    doualaFormattedTime,
  } = useBirthdayGate();

  const {
    isPlaying,
    toggleMusic,
    startMusicOnInteraction,
    playSoundEffect,
  } = useBackgroundMusic();

  const [stage, setStage] = useState<ExperienceStage>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STAGE_KEY) as ExperienceStage | null;
      if (saved && saved !== 'countdown-321') {
        return saved;
      }
    } catch {}
    return 'birthday-unlock';
  });

  // Save stage to sessionStorage so accidental mobile browser refreshes don't lose her place
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STAGE_KEY, stage);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  const handleBeginFromBirthdayUnlock = useCallback(() => {
    startMusicOnInteraction();
    playSoundEffect('click');
    setStage('password');
  }, [playSoundEffect, startMusicOnInteraction]);

  const handlePasswordVerified = useCallback(() => {
    startMusicOnInteraction();
    setStage('countdown-321');
  }, [startMusicOnInteraction]);

  const handleCountdownComplete = useCallback(() => {
    setStage('cake-candles');
  }, []);

  const handleCakeCandlesComplete = useCallback(() => {
    playSoundEffect('click');
    setStage('quiz-intro');
  }, [playSoundEffect]);

  const handleStartQuiz = useCallback(() => {
    playSoundEffect('click');
    setStage('quiz');
  }, [playSoundEffect]);

  const handleQuizComplete = useCallback(() => {
    setStage('quiz-completion');
  }, []);

  const handleShowMemories = useCallback(() => {
    playSoundEffect('click');
    setStage('photo-gallery');
  }, [playSoundEffect]);

  const handleContinueToLetter = useCallback(() => {
    playSoundEffect('click');
    setStage('love-letter');
  }, [playSoundEffect]);

  const handleCompleteLetter = useCallback(() => {
    playSoundEffect('click');
    setStage('gift-experience');
  }, [playSoundEffect]);

  const handleCompleteGiftExperience = useCallback(() => {
    playSoundEffect('click');
    setStage('final-reveal');
  }, [playSoundEffect]);

  const handleRestartExperience = useCallback(() => {
    playSoundEffect('click');
    setStage('birthday-unlock');
  }, [playSoundEffect]);

  return (
    <div className="relative min-h-dvh w-full romantic-bg text-ivory overflow-x-hidden flex flex-col justify-between">
      {/* Persistent Floating Hearts & Sparkles Ambient Layer */}
      <AmbientBackground />

      {/* Persistent Global Music Control */}
      <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />

      {/* Main Experience Stage Router */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full">
        <AnimatePresence mode="wait">
          {!isBirthdayReached && (
            /* SCREEN 1: MYSTERY LANDING PAGE (Before Nov 4) */
            <MysteryLandingScreen
              key="screen-1-mystery-landing"
              countdown={countdown}
              doualaTime={doualaFormattedTime}
              onPlayDodgeSound={() => {
                startMusicOnInteraction();
                playSoundEffect('dodge');
              }}
              onSimulateBirthdayUnlock={() => {
                startMusicOnInteraction();
                setSimulateBirthday(true);
                setStage('birthday-unlock');
              }}
            />
          )}

          {isBirthdayReached && stage === 'birthday-unlock' && (
            /* SCREEN 2: BIRTHDAY UNLOCK (On Nov 4) */
            <BirthdayUnlockScreen
              key="screen-2-birthday-unlock"
              onBegin={handleBeginFromBirthdayUnlock}
              onPlayConfettiSound={() => playSoundEffect('confetti')}
              isSimulatingBirthday={isSimulatingBirthday}
              onExitSimulation={() => setSimulateBirthday(false)}
            />
          )}

          {isBirthdayReached && stage === 'password' && (
            /* SCREEN 3: PASSWORD VERIFICATION */
            <PasswordScreen
              key="screen-3-password"
              onVerified={handlePasswordVerified}
              onPlaySuccess={() => playSoundEffect('success')}
              onPlayError={() => playSoundEffect('error')}
            />
          )}

          {isBirthdayReached && stage === 'countdown-321' && (
            /* SCREEN 4: THREE-SECOND COUNTDOWN */
            <ThreeSecondCountdownScreen
              key="screen-4-countdown"
              onComplete={handleCountdownComplete}
              onPlayTick={() => playSoundEffect('countdown')}
            />
          )}

          {isBirthdayReached && stage === 'cake-candles' && (
            /* SCREEN 4B: 3D BIRTHDAY CAKE & CANDLE BLOWING (22 + CANDLES) */
            <BirthdayCakeScreen
              key="screen-4b-cake-candles"
              onComplete={handleCakeCandlesComplete}
              onPlayBlowSound={() => playSoundEffect('blow')}
              onPlayCelebrationSound={() => playSoundEffect('confetti')}
            />
          )}

          {isBirthdayReached && stage === 'quiz-intro' && (
            /* SCREEN 5: QUIZ INTRODUCTION */
            <QuizIntroScreen
              key="screen-5-quiz-intro"
              onStartQuiz={handleStartQuiz}
            />
          )}

          {isBirthdayReached && stage === 'quiz' && (
            /* SCREEN 6: PERSONALIZED QUIZ */
            <PersonalizedQuizScreen
              key="screen-6-quiz"
              onCompleteQuiz={handleQuizComplete}
              onPlaySelectSound={() => playSoundEffect('success')}
            />
          )}

          {isBirthdayReached && stage === 'quiz-completion' && (
            /* SCREEN 7: QUIZ COMPLETION CELEBRATION */
            <QuizCompletionScreen
              key="screen-7-quiz-completion"
              onShowMemories={handleShowMemories}
              onPlayConfettiSound={() => playSoundEffect('confetti')}
            />
          )}

          {isBirthdayReached && stage === 'photo-gallery' && (
            /* SCREEN 8: 3D PHOTO MEMORY GALLERY */
            <PhotoMemoryGalleryScreen
              key="screen-8-photo-gallery"
              onContinueToLetter={handleContinueToLetter}
              onPlayClick={() => playSoundEffect('click')}
              onPlaySecret={() => playSoundEffect('secret')}
            />
          )}

          {isBirthdayReached && stage === 'love-letter' && (
            /* SCREEN 9: INTERACTIVE LOVE LETTER */
            <InteractiveLoveLetterScreen
              key="screen-9-love-letter"
              onCompleteLetter={handleCompleteLetter}
              onPlayEnvelopeSound={() => playSoundEffect('envelope')}
            />
          )}

          {isBirthdayReached && stage === 'gift-experience' && (
            /* SCREEN 9B: GIFT BOX & 3D BRACELET REVEAL EXPERIENCE */
            <GiftBoxExperienceScreen
              key="screen-9b-gift-experience"
              onCompleteAllGifts={handleCompleteGiftExperience}
              onPlayClickSound={() => playSoundEffect('click')}
              onPlayOpenSound={() => playSoundEffect('gift-open')}
              onPlaySuccessSound={() => playSoundEffect('confetti')}
            />
          )}

          {isBirthdayReached && stage === 'final-reveal' && (
            /* SCREEN 10: FINAL GIFT REVEAL */
            <FinalGiftRevealScreen
              key="screen-10-final-reveal"
              onPlayClick={() => playSoundEffect('click')}
              onPlaySuccess={() => playSoundEffect('confetti')}
              onEnsureMusicPlaying={startMusicOnInteraction}
              onNavigateToGallery={() => setStage('photo-gallery')}
              onNavigateToLetter={() => setStage('love-letter')}
              onRestartExperience={handleRestartExperience}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
