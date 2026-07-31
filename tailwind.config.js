/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F1E9DA', alt: '#E8DDC7', deep: '#DED0B0' },
        ink: { DEFAULT: '#232019', soft: '#4A4436' },
        navy: { DEFAULT: '#1F3B4D', light: '#2E5468' },
        brass: { DEFAULT: '#A8763E', light: '#C79B5E' },
      },
      fontFamily: {
        'display-en': ['var(--font-fraunces)', 'serif'],
        'display-bn': ['var(--font-tiro-bangla)', 'serif'],
        'body-en': ['var(--font-inter)', 'sans-serif'],
        'body-bn': ['var(--font-hind-siliguri)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      backgroundImage: {
        'ledger-lines':
          'repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(35,32,25,0.06) 32px)',
      },
    },
  },
  plugins: [],
};
