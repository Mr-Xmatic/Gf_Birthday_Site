export interface SecretNote {
  id: string;
  badgeLabel: string;
  title: string;
  lines: string[];
  positionHint: string;
}

export interface SiteConfiguration {
  // Core Identity & Personalization
  projectName: string;
  projectCodename: string;
  girlfriendNickname: string;
  girlfriendPetName: string;
  envelopeInitials: string;
  senderSignature: string;

  // Birthday & Timezone Gate Configuration
  targetBirthdayISO: string; // Africa/Douala is UTC+01:00
  timezone: string;
  birthdayMonth: number; // 11 (November)
  birthdayDay: number;   // 4

  // Password Screen Configuration (DD/MM/YYYY)
  password: string;
  allowAnyYearOnBirthdayDayMonth: boolean;
  passwordErrorText: string;

  // Screen 1: Mystery Landing Page (Before Nov 4)
  landingScreen: {
    heading: string;
    supportingText: string;
    buttonLabel: string;
    playfulMessages: string[];
  };

  // Screen 2: Birthday Unlock (On/After Nov 4)
  birthdayUnlockScreen: {
    heading: string;
    supportingText: string;
    buttonLabel: string;
  };

  // Screen 3: Password Verification
  passwordScreen: {
    heading: string;
    supportingText: string;
    instruction: string;
    placeholder: string;
    submitButtonLabel: string;
  };

  // Screen 5: Quiz Introduction
  quizIntroScreen: {
    heading: string;
    paragraphs: string[];
    buttonLabel: string;
  };

  // Screen 7: Quiz Completion Celebration
  quizCompletionScreen: {
    heading: string;
    supportingText: string;
    buttonLabel: string;
  };

  // Screen 8: 3D Photo Memory Gallery & Secret Hearts
  galleryScreen: {
    heading: string;
    supportingText: string;
    continueButtonLabel: string;
    secretNotes: SecretNote[];
  };

  // Screen 9: Interactive Love Letter
  loveLetterScreen: {
    envelopePrompt: string;
    openButtonLabel: string;
    title: string;
    salutation: string;
    paragraphs: string[];
    signOff: string;
    signature: string;
    continueButtonLabel: string;
  };

  // Screen 9B: Gift Box & 3D Bracelet Reveal Experience
  giftBoxExperience: {
    firstGift: {
      introHeading: string;
      introSupportingText: string;
      openButtonLabel: string;
      imagePath: string;
      giftTitle?: string;
      revealedHeading: string;
      revealedSupportingText: string;
      loveItButtonLabel: string;
    };
    secondGiftBracelet: {
      teaseHeading: string;
      teaseSupportingText: string;
      boxHeading: string;
      openButtonLabel: string;
      videoPath: string;
      appreciationHeading: string;
      appreciationSupportingText: string;
      loveItButtonLabel: string;
      closingAffectionateNote: string;
      continueToFinaleButtonLabel: string;
    };
  };

  // Screen 10: Final Gift Reveal & Sean Paul Live Performance Surprise
  finalRevealScreen: {
    initialTeaseHeading: string;
    initialButtonLabel: string;
    progressiveLines: string[];
    cheekyHighlightLine: string;
    finalButtonLabel: string;
    finalUnlockedNote: string;
    concertSurprise: {
      teaseButtonLabel: string;
      badge: string;
      title: string;
      songTitle: string;
      artist: string;
      description: string;
      dressCode: string;
      showTime: string;
      encoreNote: string;
      claimButtonLabel: string;
    };
    replayExperienceLabel: string;
  };

  // Audio & Music Configuration
  audio: {
    backgroundMusicPath: string;
    fallbackMusicTitle: string;
    defaultVolume: number;
    enableSoundEffects: boolean;
    unmutePromptText: string;
  };
}

export const SITE_CONFIG: SiteConfiguration = {
  projectName: 'FOR YOUR EYES ONLY',
  projectCodename: 'PROJECT BB',
  girlfriendNickname: 'BB',
  girlfriendPetName: 'my baby',
  envelopeInitials: 'B.B.',
  senderSignature: 'YOUR X. ❤️',

  // November 4, 2026 at 00:00:00 in Africa/Douala (UTC+1)
  targetBirthdayISO: '2026-11-04T00:00:00+01:00',
  timezone: 'Africa/Douala',
  birthdayMonth: 11,
  birthdayDay: 4,

  // Her exact birthday: 4th of November 2004
  password: '04/11/2004',
  allowAnyYearOnBirthdayDayMonth: false,
  passwordErrorText: "Are you sure that's your birthday? 😂 Try again, baby.",

  landingScreen: {
    heading: 'I have a special surprise just for you...',
    supportingText: 'But good things come to those who wait. ❤️',
    buttonLabel: 'OPEN YOUR SURPRISE',
    playfulMessages: [
      'Easy there, impatient princess. 😂',
      'I said November 4, not {TODAY}.',
      'Somebody clearly cannot wait.',
      'Patience, baby. Your time will come.',
      'Nice try. But rules are rules. ❤️',
      'Are you trying to hack your birthday surprise?',
    ],
  },

  birthdayUnlockScreen: {
    heading: 'HAPPY BIRTHDAY, MY BABY! ❤️🎂',
    supportingText:
      'Today is all about you. So sit back, relax, and allow me to spoil you a little.',
    buttonLabel: "LET'S BEGIN ❤️",
  },

  passwordScreen: {
    heading: 'Before we proceed...',
    supportingText: 'I need to make sure this surprise reaches the right person.',
    instruction: 'Enter your birthday in DD/MM/YYYY format.',
    placeholder: 'DD/MM/YYYY',
    submitButtonLabel: 'VERIFY IDENTITY ❤️',
  },

  quizIntroScreen: {
    heading: 'THE BB EXPERIENCE ❤️',
    paragraphs: [
      'This surprise is intended for one person only.',
      'If you are really my baby, this little test should be easy.',
    ],
    buttonLabel: "LET'S SEE HOW WELL YOU KNOW US",
  },

  quizCompletionScreen: {
    heading: 'HEY! SO YOU REALLY ARE MY BABY! ❤️',
    supportingText:
      'Well, I never doubted you. But it was fun putting you through that little test. 😂',
    buttonLabel: 'SHOW ME OUR MEMORIES',
  },

  galleryScreen: {
    heading: 'A few moments, a thousand feelings. ❤️',
    supportingText:
      "If I could keep a collection of my favourite moments, you'd be in every single one.",
    continueButtonLabel: 'READ YOUR BIRTHDAY LETTER ❤️',
    secretNotes: [
      {
        id: 'secret-1',
        badgeLabel: 'Secret Note #1',
        title: 'Psst... I have a little secret.',
        lines: [
          "You're my favourite person.",
          "Don't tell anyone. 🤫❤️",
        ],
        positionHint: 'Top-left ambient glow',
      },
      {
        id: 'secret-2',
        badgeLabel: 'Secret Note #2',
        title: 'Wait... you found the second secret too? 👀',
        lines: [
          'Every single time I look at you, I still wonder how I got this lucky.',
          'Even when you are being stubborn. Especially then. 😂❤️',
        ],
        positionHint: 'Bottom-right carousel pedestal',
      },
      {
        id: 'secret-3',
        badgeLabel: 'Secret Note #3',
        title: 'Curiosity looks good on you, baby.',
        lines: [
          'Behind every photo here is a moment where I quietly thought to myself:',
          '"Yeah... this girl has me completely wrapped around her finger." ❤️',
        ],
        positionHint: 'Near the gallery header crest',
      },
    ],
  },

  loveLetterScreen: {
    envelopePrompt: 'A little something from me to you...',
    openButtonLabel: 'OPEN YOUR LETTER ❤️',
    title: 'To My Beautiful BB ❤️',
    salutation: 'My baby,',
    paragraphs: [
      'Happy birthday! ❤️',
      "You know, I've tried calculating exactly how much you mean to me, but every equation seems to produce an answer beyond the limits of my calculator. I guess some things aren't meant to be quantified.",
      'From your incredibly soft lips to those beautiful curves, and especially that smile you wear when you\'re genuinely happy, you have quite an impressive collection of distractions. I sometimes wonder how you expect me to maintain normal cognitive functioning. 😂',
      "And then there's you, the former president of the anti-love movement, who somehow became its biggest contradiction. I told you, baby, resistance was never going to win this particular battle. Just enjoy it. ❤️",
      'Jokes aside, I love the little things about us, especially those moments when I get to hold you close before falling asleep. I hope we get to create many more memories like those.',
      'May this new year bring you happiness, growth, beautiful opportunities, and everything your heart desires.',
      'Keep being you, beautiful.',
    ],
    signOff: 'I Love You❤️',
    signature: 'Your X',
    continueButtonLabel: 'OPEN YOUR BIRTHDAY GIFTS 🎁❤️',
  },

  giftBoxExperience: {
    firstGift: {
      introHeading: 'Well, baby... I have another surprise for you. ❤️',
      introSupportingText: 'And this one comes in a little package.',
      openButtonLabel: 'OPEN YOUR GIFT 🎁',
      // Replace your first gift photo in public/gifts/first-gift.svg (or .png / .jpg)
      imagePath: '/gifts/first-gift.svg',
      revealedHeading: 'Do you like it, baby? ❤️',
      revealedSupportingText: 'I hope you do. I saw it and thought of you.',
      loveItButtonLabel: 'I LOVE IT! ❤️',
    },
    secondGiftBracelet: {
      teaseHeading: 'Well... I have one more surprise for you. 👀',
      teaseSupportingText: "Because one surprise wasn't quite enough.",
      boxHeading: "There's something else I want you to see, baby. ❤️",
      openButtonLabel: 'OPEN YOUR SECOND GIFT',
      // Your supplied 6-second 3D bracelet rotation video
      videoPath: '/videos/bracelet-reveal.mp4',
      appreciationHeading: 'A little something for my beautiful girl. ❤️',
      appreciationSupportingText:
        'I hope you like it, baby. You deserve beautiful things.',
      loveItButtonLabel: 'I LOVE IT! ❤️',
      closingAffectionateNote:
        "Seeing you happy is my favourite reward. Wear it and think of me every single day, my love. ❤️✨",
      continueToFinaleButtonLabel: 'WAIT... ONE LAST CHEEKY SURPRISE 👀🔥',
    },
  },

  finalRevealScreen: {
    initialTeaseHeading: "Hey... I've got one more gift for you. 👀",
    initialButtonLabel: 'ONE MORE GIFT?',
    progressiveLines: [
      "Yes, baby. But this one's a little different.",
      "It's not something you can unwrap, wear, or put on a shelf.",
      "It's something you'll have to take in 🫣.",
    ],
    cheekyHighlightLine: 'Preferably with me. 😉❤️',
    finalButtonLabel: 'I THINK I KNOW WHAT YOU MEAN... 😂',
    finalUnlockedNote:
      "Happy Birthday, my love. Claim your gift in person tonight — no wrapping paper required. 🔥❤️",
    concertSurprise: {
      teaseButtonLabel: 'WAIT... YOUR EVENING PERFORMANCE PASS 🎤✨',
      badge: 'VIP FRONT-ROW ACCESS • NOVEMBER 4 EVENING',
      title: 'Private Live Performance For My Baby',
      songTitle: '“Hold My Hand”',
      artist: 'Sean Paul (Performed Live by Your Man 😎🎤)',
      description:
        "You said you wanted me to sing your favourite song for you on your birthday evening... so tonight, I'm getting dressed up and performing 'Hold My Hand' by Sean Paul live — strictly for you.",
      dressCode: 'Full Stage Fit • Dressed to Impress',
      showTime: 'Tonight (Birthday Evening Special)',
      encoreNote:
        "And right after the performance? We move straight to that other gift you have to take in... 😉🔥❤️",
      claimButtonLabel: "I CAN'T WAIT FOR MY CONCERT TONIGHT! 🎤❤️",
    },
    replayExperienceLabel: 'Relive the Experience from the Start',
  },

  audio: {
    backgroundMusicPath: '/music/hold-my-hand.mp3',
    fallbackMusicTitle: 'Hold My Hand — Sean Paul',
    defaultVolume: 0.65,
    enableSoundEffects: true,
    unmutePromptText: 'Unmute the sound to get the full birthday experience 🎶❤️',
  },
};
