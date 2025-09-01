/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ink: { 900: '#0B1220', 800: '#111A2B' },
        mag: { 500: '#EC1361', 400: '#FF3B8D' },
        cyan: { 400: '#00D4FF' },
        text: { base: '#E6EEF8', mute: '#9FB0C6' },
        success: '#22C55E',
        warning: '#F59E0B'
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,.35)',
        glow: '0 0 0 3px rgba(236,19,97,.25)'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
}