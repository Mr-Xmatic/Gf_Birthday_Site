import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../data/configuration';
import { triggerSubtleSparkleBurst } from '../Confetti/CelebrationConfetti';

interface PasswordScreenProps {
  onVerified: () => void;
  onPlaySuccess: () => void;
  onPlayError: () => void;
}

export const PasswordScreen: React.FC<PasswordScreenProps> = ({
  onVerified,
  onPlaySuccess,
  onPlayError,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  // Auto-format DD/MM/YYYY for effortless mobile typing while allowing normal editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setErrorMessage(null);

    // If user is deleting or typing slashes manually, keep it smooth
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 8);
    let formatted = digitsOnly;
    if (digitsOnly.length > 4) {
      formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
    } else if (digitsOnly.length > 2) {
      formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }
    setInputValue(formatted);
  };

  const verifyPassword = (value: string): boolean => {
    const cleaned = value.trim();
    if (cleaned === SITE_CONFIG.password) {
      return true;
    }

    if (SITE_CONFIG.allowAnyYearOnBirthdayDayMonth) {
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(cleaned);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        if (
          day === SITE_CONFIG.birthdayDay &&
          month === SITE_CONFIG.birthdayMonth &&
          year >= 1970 &&
          year <= 2026
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuccess) return;

    if (verifyPassword(inputValue)) {
      setIsSuccess(true);
      setErrorMessage(null);
      onPlaySuccess();
      triggerSubtleSparkleBurst();

      window.setTimeout(() => {
        onVerified();
      }, 1350);
    } else {
      onPlayError();
      setErrorMessage(SITE_CONFIG.passwordErrorText);
      setShakeKey((prev) => prev + 1);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55 }}
      className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[88dvh] text-center"
    >
      <motion.div
        key={shakeKey}
        animate={
          errorMessage
            ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.4 }}
        className="w-full glass-card rounded-3xl p-7 sm:p-10 border border-champagne/30 shadow-romantic relative overflow-hidden"
      >
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-rose/15 border border-champagne/40 flex items-center justify-center shadow-gold-glow">
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7 text-champagne" />
          ) : (
            <KeyRound className="w-6 h-6 text-champagne" />
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ivory mb-3">
          {SITE_CONFIG.passwordScreen.heading}
        </h1>

        <p className="text-blush/90 text-base sm:text-lg mb-6 leading-relaxed">
          {SITE_CONFIG.passwordScreen.supportingText}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label
              htmlFor="birthday-password-input"
              className="block text-xs sm:text-sm uppercase tracking-[0.16em] text-champagne font-medium mb-3"
            >
              {SITE_CONFIG.passwordScreen.instruction}
            </label>

            <input
              id="birthday-password-input"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder={SITE_CONFIG.passwordScreen.placeholder}
              value={inputValue}
              onChange={handleInputChange}
              disabled={isSuccess}
              maxLength={10}
              className="w-full text-center font-serif text-2xl sm:text-3xl tracking-[0.2em] py-4 px-5 rounded-2xl bg-burgundy-deep/85 border border-champagne/40 text-ivory placeholder:text-ivory/25 focus:outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/30 transition-all"
            />
          </div>

          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-2xl bg-rose/15 border border-rose/45 text-ivory text-sm sm:text-base font-medium shadow-rose-glow"
              >
                {errorMessage}
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-champagne/20 border border-champagne/50 text-ivory text-sm sm:text-base font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-champagne" />
                <span>Identity confirmed! Welcome, my baby ❤️</span>
                <Heart className="w-4 h-4 fill-rose text-rose" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isSuccess || inputValue.length < 8}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-champagne via-rose to-champagne text-burgundy-deep font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow disabled:opacity-45 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            <span>{SITE_CONFIG.passwordScreen.submitButtonLabel}</span>
          </motion.button>
        </form>

        {/* Floating Hearts Burst on Success */}
        <AnimatePresence>
          {isSuccess && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{
                    opacity: 1,
                    y: 220,
                    x: (idx - 4.5) * 35,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 0,
                    y: -60,
                    x: (idx - 4.5) * 48,
                    scale: 1.25,
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute left-1/2 bottom-0"
                >
                  <Heart className="w-6 h-6 fill-rose text-rose" />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};
