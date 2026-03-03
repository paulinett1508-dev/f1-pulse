/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core F1 branding
        f1black: '#0A0A0A',
        f1red: '#E10600',
        f1silver: '#C0C0C0',

        // Race flag states (semantic)
        flag: {
          green: '#43B02A',
          yellow: '#F5C623',
          red: '#E10600',
        },

        // Tyre compounds
        tyre: {
          soft: '#E10600',
          medium: '#F5C623',
          hard: '#EBEBEB',
          inter: '#43B02A',
          wet: '#0072CE',
        },

        // Telemetry indicators
        telemetry: {
          throttle: '#22C55E',
          brake: '#E10600',
          bar: '#525252',
        },

        // Connection / data status
        status: {
          live: '#4ADE80',
          connected: '#60A5FA',
          warning: '#FBBF24',
          offline: '#A3A3A3',
        },
      },
      fontFamily: {
        exo: ['Exo 2', 'ui-monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'glow-red': '0 0 12px 2px rgba(225, 6, 0, 0.2)',
        'glow-green': '0 0 12px 2px rgba(67, 176, 42, 0.2)',
      },
    },
  },
  plugins: [],
}
