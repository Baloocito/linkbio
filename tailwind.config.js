/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/pages/**/*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        magenta: '#E6007E',
        teal: '#12A19A',
        black: '#000000',
        white: '#FFFFFF',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeSlideUp: 'fadeSlideUp 0.7s ease-out forwards',
        modalIn: 'modalIn 0.35s ease-out forwards',
      },
    },
  },

  plugins: [],
}
