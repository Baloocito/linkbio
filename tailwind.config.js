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
    },
  },
  plugins: [],
}
