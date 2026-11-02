import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizOption } from '../../data/quizQuestions';
import { triggerSubtleSparkleBurst } from '../Confetti/CelebrationConfetti';

interface PersonalizedQuizScreenProps {
  onCompleteQuiz: () => void;
  onPlaySelectSound: () => void;
}

export const PersonalizedQuizScreen: React.FC<PersonalizedQuizScreenProps> = ({
  onCompleteQuiz,
  onPlaySelectSound,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [reactionBurstKey, setReactionBurstKey] = useState(0);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const handleOptionSelect = (option: QuizOption) => {
    onPlaySelectSound();
    setSelectedOption(option);
    setReactionBurstKey((prev) => prev + 1);

    if (option.reactionType === 'sparkles' || option.reactionType === 'both') {
      triggerSubtleSparkleBurst();
    }
  };

  const handleContinue = () => {
    onPlaySelectSound();
    if (currentIndex + 1 < totalQuestions) {
      setSelectedOption(null);
      setCurrentIndex((prev) => prev + 1);
    } else {
      onCompleteQuiz();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45 }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 py-6 sm:py-8 flex flex-col justify-center min-h-[88dvh]"
    >
      {/* Top Progress Header */}
      <div className="w-full mb-5">
        <div className="flex items-center justify-between text-xs sm:text-sm uppercase tracking-[0.18em] text-champagne font-medium mb-2.5">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-burgundy-deep/80 border border-champagne/25 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-rose via-champagne to-rose"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className="w-full glass-card rounded-3xl p-6 sm:p-9 border border-rose/25 shadow-romantic relative overflow-hidden"
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory leading-snug mb-2">
            {currentQuestion.question}
          </h2>

          {currentQuestion.subtitle && (
            <p className="text-xs sm:text-sm text-blush/70 italic mb-6">
              {currentQuestion.subtitle}
            </p>
          )}

          {/* Answer Option Cards */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose/30 via-champagne/25 to-rose/20 border-champagne shadow-gold-glow text-ivory'
                      : 'bg-burgundy-deep/65 border-rose/20 hover:border-champagne/50 text-blush/95'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-champagne text-burgundy-deep'
                        : 'bg-rose/15 text-champagne border border-champagne/30'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="text-sm sm:text-base font-medium leading-snug flex-1">
                    {option.text}
                  </span>
                  {isSelected && (
                    <Heart className="w-4 h-4 fill-rose text-rose shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Personalized Contextual Feedback Drawer */}
          <AnimatePresence mode="wait">
            {selectedOption && (
              <motion.div
                key={`${currentQuestion.id}-${selectedOption.id}`}
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.32 }}
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-champagne/20 via-rose/15 to-burgundy-deep/90 border border-champagne/45 mb-5 relative">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-champagne/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-champagne" />
                    </div>
                    <p className="text-ivory text-sm sm:text-base font-medium leading-relaxed">
                      {selectedOption.feedback}
                    </p>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleContinue}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow flex items-center justify-center gap-2 border border-ivory/40"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle Floating Hearts Reaction on Option Selection */}
          <AnimatePresence>
            {selectedOption && (
              <div
                key={reactionBurstKey}
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                {[...Array(6)].map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{
                      opacity: 0.9,
                      y: 260,
                      x: (idx - 2.5) * 42,
                      scale: 0.6,
                    }}
                    animate={{
                      opacity: 0,
                      y: 40,
                      x: (idx - 2.5) * 55,
                      scale: 1.15,
                    }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="absolute left-1/2 bottom-0"
                  >
                    <Heart className="w-5 h-5 fill-rose/80 text-rose" />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
};
