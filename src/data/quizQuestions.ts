export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  feedback: string;
  reactionType: 'hearts' | 'sparkles' | 'both';
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle?: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      'Be honest, baby. Which of these do you think has me completely distracted?',
    subtitle: 'Choose wisely... though let’s be honest, there are no wrong answers here.',
    options: [
      {
        id: 'A',
        text: 'Those beautiful eyes.',
        feedback:
          'One look from those eyes and I immediately forget whatever serious point I was trying to make. ❤️',
        reactionType: 'sparkles',
      },
      {
        id: 'B',
        text: 'Those soft lips.',
        feedback:
          'Those lips deserve their own appreciation ceremony. 😂',
        reactionType: 'hearts',
      },
      {
        id: 'C',
        text: 'That gorgeous backside.',
        feedback:
          "Well, I see somebody knows exactly what I'm talking about. 😭❤️",
        reactionType: 'both',
      },
      {
        id: 'D',
        text: 'Honestly, why would you make me choose? 😂❤️',
        feedback:
          'Exactly! Asking me to pick just one feature is basically a trap. I want all of it. 😂❤️',
        reactionType: 'both',
      },
    ],
  },
  {
    id: 2,
    question: "What's one thing about your smile that I absolutely love?",
    subtitle: 'Every time it appears, my whole day resets.',
    options: [
      {
        id: 'A',
        text: 'How it makes your whole face light up.',
        feedback:
          'And that smile? You have no idea what it does to me.',
        reactionType: 'sparkles',
      },
      {
        id: 'B',
        text: 'How it makes me smile too.',
        feedback:
          'It is 100% contagious, baby. Even when I try to act serious around you, I lose in three seconds.',
        reactionType: 'hearts',
      },
      {
        id: 'C',
        text: "How beautiful you look when you're genuinely happy.",
        feedback:
          'Seeing you genuinely happy is hands down my favourite view in the world. ❤️',
        reactionType: 'both',
      },
      {
        id: 'D',
        text: 'Everything about it.',
        feedback:
          'And that smile? You have no idea what it does to me. Every single detail of it is magic. ❤️',
        reactionType: 'both',
      },
    ],
  },
  {
    id: 3,
    question:
      'Remember when you used to be against love? What happened to that girl?',
    subtitle: 'Former president of the anti-love club, step up to the microphone...',
    options: [
      {
        id: 'A',
        text: 'She retired.',
        feedback:
          'Officially retired with full benefits! Look at you now — what a beautiful change of heart. ❤️',
        reactionType: 'sparkles',
      },
      {
        id: 'B',
        text: 'She changed her mind.',
        feedback:
          'Look at you now! What a beautiful change of heart.',
        reactionType: 'hearts',
      },
      {
        id: 'C',
        text: "She met someone she couldn't resist.",
        feedback:
          'I mean... can we really blame her? Resistance never stood a chance against us, baby. 😉❤️',
        reactionType: 'both',
      },
      {
        id: 'D',
        text: "She's still pretending to fight it. 😂",
        feedback:
          'Pretending is the keyword here! Your cover is completely blown, my love. 😂❤️',
        reactionType: 'both',
      },
    ],
  },
  {
    id: 4,
    question: 'Between the two of us, who is more stubborn?',
    subtitle: 'Think carefully... I am watching your answer in real time.',
    options: [
      {
        id: 'A',
        text: 'You.',
        feedback:
          'Me?! Bold accusation on your birthday, princess. I will let it slide just for today. 😂❤️',
        reactionType: 'sparkles',
      },
      {
        id: 'B',
        text: 'Me.',
        feedback:
          'Whoa, self-awareness on your birthday?! Screenshot taken for future reference! 😂❤️',
        reactionType: 'both',
      },
      {
        id: 'C',
        text: 'Both of us. Unfortunately. 😂',
        feedback:
          'We might need professional intervention. Neither of us is surrendering. 😂',
        reactionType: 'both',
      },
      {
        id: 'D',
        text: "Let's not start another argument today.",
        feedback:
          'Smart move, baby. Diplomatic immunity granted because it is your special day! 😂❤️',
        reactionType: 'hearts',
      },
    ],
  },
  {
    id: 5,
    question: "What is one of my favourite things to do when we're together?",
    subtitle: 'Every moment counts, but some are non-negotiable.',
    options: [
      {
        id: 'A',
        text: 'Kiss you.',
        feedback:
          'Honestly, kissing you is my favourite addiction. One is never enough. 😘❤️',
        reactionType: 'hearts',
      },
      {
        id: 'B',
        text: 'Make you laugh.',
        feedback:
          'Hearing you laugh is my personal soundtrack. I will gladly be a clown just to hear it.',
        reactionType: 'hearts',
      },
      {
        id: 'C',
        text: 'Hold you close.',
        feedback:
          'My favourite place to be is right there, holding you close. ❤️',
        reactionType: 'both',
      },
      {
        id: 'D',
        text: 'All of the above and more 😏',
        feedback:
          'Emphasis on the "and more"... you already know how we get when the doors close, baby. 😏🔥❤️',
        reactionType: 'both',
      },
    ],
  },
  {
    id: 6,
    question: "What's something about you that I find particularly irresistible?",
    subtitle: 'As if I have any self-control around you...',
    options: [
      {
        id: 'A',
        text: 'Your lips.',
        feedback:
          'Those lips deserve their own appreciation ceremony. Seriously, how am I supposed to focus? 😂❤️',
        reactionType: 'hearts',
      },
      {
        id: 'B',
        text: 'Your soft derrière',
        feedback:
          'The way you move your body makes my mind go crazy 😩',
        reactionType: 'both',
      },
      {
        id: 'C',
        text: 'Your smile.',
        feedback:
          'And that smile? You have no idea what it does to me. Instant weakness.',
        reactionType: 'sparkles',
      },
      {
        id: 'D',
        text: 'The entire package, baby. ❤️',
        feedback:
          'Head to toe, inside and out. You are dangerously irresistible and you know it. ❤️',
        reactionType: 'both',
      },
    ],
  },
  {
    id: 7,
    question: "What's one thing I especially love doing before we fall asleep?",
    subtitle: 'When the world gets quiet and it’s just the two of us...',
    options: [
      {
        id: 'A',
        text: 'Talking.',
        feedback:
          'Those late-night conversations with you where we talk about everything and nothing at all... priceless. ❤️',
        reactionType: 'sparkles',
      },
      {
        id: 'B',
        text: 'Watching something.',
        feedback:
          'Even though half the time I end up watching you instead of the screen. 😂❤️',
        reactionType: 'hearts',
      },
      {
        id: 'C',
        text: 'Holding you close.',
        feedback:
          'My favourite place to be is right there, holding you close. ❤️',
        reactionType: 'both',
      },
      {
        id: 'D',
        text: 'Stealing a few more kisses.',
        feedback:
          'Because one goodnight kiss is never enough when it comes to you, baby. ❤️',
        reactionType: 'both',
      },
    ],
  },
  {
    id: 8,
    question:
      'After all our teasing, stubbornness, laughter and beautiful moments, what do you think I would choose?',
    subtitle: 'The final question, my love.',
    options: [
      {
        id: 'A',
        text: 'Another argument with you.',
        feedback:
          'Even our little debates end with me wanting to pull you closer. I would still pick you every time. 😂❤️',
        reactionType: 'sparkles',
      },
      {
        id: 'B',
        text: 'Another day of teasing you.',
        feedback:
          'A lifetime subscription of teasing you sounds elite, not gonna lie! 😂❤️',
        reactionType: 'hearts',
      },
      {
        id: 'C',
        text: 'More beautiful memories together.',
        feedback:
          'Every memory with you is my favourite chapter, and we are just getting started. ❤️',
        reactionType: 'both',
      },
      {
        id: 'D',
        text: 'You. Every single time. ❤️',
        feedback:
          "Now that's my girl. You already know.",
        reactionType: 'both',
      },
    ],
  },
];
