import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';

interface QuizIntroScreenProps {
  onStartQuiz: () => void;
}

export const QuizIntroScreen: React.FC<QuizIntroScreenProps> = ({
  onStartQuiz,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55 }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[88dvh] text-center"
    >
      <div className="w-full glass-card-blush rounded-3xl p-7 sm:p-11 border border-champagne/35 shadow-romantic">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose/20 border border-champagne/45 flex items-center justify-center shadow-gold-glow">
          <Heart className="w-7 h-7 fill-rose text-rose" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-burgundy-deep/60 border border-champagne/25 text-champagne text-xs uppercase tracking-[0.2em] mb-4">
          <Sparkles className="w-3 h-3" />
          <span>8 Playful Questions</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory mb-6 tracking-tight">
          {SITE_CONFIG.quizIntroScreen.heading}
        </h1>

        <div className="space-y-4 text-blush/95 text-base sm:text-lg max-w-md mx-auto mb-9 leading-relaxed">
          {SITE_CONFIG.quizIntroScreen.paragraphs.map((p, index) => (
            <p key={index}>{p}</p>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={onStartQuiz}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow border border-ivory/50"
        >
          {SITE_CONFIG.quizIntroScreen.buttonLabel}
        </motion.button>
      </div>
    </motion.section>
  );
};
