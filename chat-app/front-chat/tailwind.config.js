/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode using a class like <html class="dark">
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Looks inside all JS/TS/React files in src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode:"class",
};

