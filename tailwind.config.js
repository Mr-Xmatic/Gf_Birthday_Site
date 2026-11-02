/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#3B101F',
          deep: '#240711',
          dark: '#19040B',
          mid: '#4E172B',
          soft: '#5D1E34',
        },
        blush: {
          DEFAULT: '#F8E6E8',
          soft: '#FCEFF1',
          muted: '#E8CDD1',
        },
        rose: {
          DEFAULT: '#E8A0AD',
          glow: '#F2B8C2',
          deep: '#C97A88',
        },
        champagne: {
          DEFAULT: '#D8B878',
          light: '#EAD3A3',
          dark: '#B59252',
        },
        ivory: {
          DEFAULT: '#FFF8F0',
          muted: '#F3E8DC',
        },
        cream: {
          DEFAULT: '#FFF5EA',
          warm: '#F7E7D6',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'romantic': '0 20px 50px -12px rgba(20, 3, 9, 0.65), 0 0 25px rgba(232, 160, 173, 0.12)',
        'gold-glow': '0 0 25px rgba(216, 184, 120, 0.28), 0 10px 30px rgba(20, 3, 9, 0.5)',
        'rose-glow': '0 0 30px rgba(232, 160, 173, 0.35)',
        'envelope': '0 30px 60px -15px rgba(10, 2, 5, 0.8), 0 0 40px rgba(216, 184, 120, 0.15)',
      }
    },
  },
  plugins: [],
}
