/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './index.html'],
  theme: {
    extend: {
      colors: {
        herbalife: {
          green: '#007044',
          dark: '#005232',
          light: '#4CAF50',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
