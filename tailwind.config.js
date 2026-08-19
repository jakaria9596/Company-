/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1A1A1A', soft: '#6B6B6B' },
        accent: { DEFAULT: '#0C6B4F', light: '#12885F' },
        line: '#EDEDED',
        cardbg: '#F3F3F1',
      },
      fontFamily: {
        'display-en': ['var(--font-fraunces)', 'serif'],
        'display-bn': ['var(--font-tiro-bangla)', 'serif'],
        'body-en': ['var(--font-inter)', 'sans-serif'],
        'body-bn': ['var(--font-hind-siliguri)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
