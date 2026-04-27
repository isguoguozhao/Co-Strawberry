import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        field: {
          950: '#031111',
          900: '#061a17',
          800: '#0b2922',
          700: '#124137'
        },
        leaf: {
          500: '#44d17d',
          400: '#70f2a1',
          300: '#a9ffd0'
        },
        berry: {
          500: '#ff4e72',
          400: '#ff7590'
        },
        pollen: {
          400: '#f5ce5b'
        },
        skytech: {
          400: '#51d6ff'
        }
      },
      boxShadow: {
        panel: '0 18px 70px rgba(0, 0, 0, 0.35)',
        glow: '0 0 32px rgba(68, 209, 125, 0.26)'
      },
      backgroundImage: {
        grid:
          'linear-gradient(rgba(112,242,161,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(112,242,161,0.06) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
} satisfies Config;
