/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        f1black: '#0A0A0A',
        f1red: '#E10600',
        f1silver: '#C0C0C0',
      },
      fontFamily: {
        exo: ['Exo 2', 'ui-monospace'],
      }
    },
  },
  plugins: [],
}
