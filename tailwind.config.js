/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './pages/**/*.html', './src/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF5A1F',
          secondary: '#0F172A',
        },
      },
    },
  },
  plugins: [],
}
