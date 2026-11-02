import React from 'react';
import { motion } from 'framer-motion';
import { BraceletEmergence } from './BraceletEmergence';

interface GiftBoxExperienceScreenProps {
  onCompleteAllGifts: () => void;
  onPlayClickSound: () => void;
  onPlayOpenSound: () => void;
  onPlaySuccessSound: () => void;
}

export const GiftBoxExperienceScreen: React.FC<GiftBoxExperienceScreenProps> = ({
  onCompleteAllGifts,
  onPlayClickSound,
  onPlayOpenSound,
  onPlaySuccessSound,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[88dvh]"
    >
      <BraceletEmergence
        onCompleteBraceletExperience={onCompleteAllGifts}
        onPlayClickSound={onPlayClickSound}
        onPlayOpenSound={onPlayOpenSound}
        onPlaySuccessSound={onPlaySuccessSound}
      />
    </motion.section>
  );
};
