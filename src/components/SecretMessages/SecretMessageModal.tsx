import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X } from 'lucide-react';
import { SecretNote } from '../../data/configuration';

interface SecretMessageModalProps {
  secret: SecretNote | null;
  onClose: () => void;
}

export const SecretMessageModal: React.FC<SecretMessageModalProps> = ({
  secret,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {secret && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-dark/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-card-blush rounded-3xl p-7 sm:p-9 border border-champagne/60 shadow-gold-glow text-center relative"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close secret message"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-burgundy-deep/70 border border-champagne/30 flex items-center justify-center text-ivory/80 hover:text-ivory"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose/25 border border-champagne/50 flex items-center justify-center shadow-rose-glow">
              <Heart className="w-6 h-6 fill-rose text-rose" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-deep/70 border border-champagne/35 text-champagne text-[11px] uppercase tracking-[0.2em] mb-3">
              <Sparkles className="w-3 h-3" />
              <span>{secret.badgeLabel}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory mb-4">
              {secret.title}
            </h3>

            <div className="space-y-3 text-blush/95 text-base sm:text-lg leading-relaxed mb-7">
              {secret.lines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-xs sm:text-sm uppercase tracking-wider shadow-gold-glow"
            >
              Keep Our Secret 🤫❤️
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
