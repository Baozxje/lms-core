/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#16213E',
          light: '#233258',
          dark: '#0E1529',
        },
        ivory: '#F5F3EE',
        amber: {
          DEFAULT: '#D9A24B',
          dark: '#B8823A',
        },
        success: '#3E7C59',
        danger: '#C1443C',
        slate: {
          soft: '#6B7280',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}