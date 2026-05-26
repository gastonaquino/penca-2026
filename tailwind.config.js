/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        wc: {
          green: '#1a472a',
          red: '#8b1a1a',
          blue: '#0d1b2a',
          gold: '#d4a017',
        },
      },
    },
  },
  plugins: [],
};
