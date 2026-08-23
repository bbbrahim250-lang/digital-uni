import type { Config } from 'tailwindcss';

// Design tokens — Section 5 (Visual Design) and Section 24 (Accessibility)
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef1f6',
          100: '#d4dbe8',
          400: '#2c3e63',
          600: '#1a2947',
          800: '#0f1a30',
          900: '#0a1120' // primary deep navy
        },
        gold: {
          200: '#f3e3b3',
          400: '#d9b559',
          500: '#c99c33', // primary gold accent
          600: '#a97e22'
        },
        highlight: {
          turquoise: '#2fb6a8',
          electric: '#2f6fed'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '0.75rem'
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(10 17 32 / 0.08), 0 1px 2px -1px rgb(10 17 32 / 0.06)'
      }
    }
  },
  plugins: []
};

export default config;
