import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base surfaces
        iron: '#0B0C0E', // primary background
        charcoal: '#15171B', // panel background
        gunmetal: '#2A2E35', // borders / raised surfaces
        // Brass accent family (the brand's signature metal)
        brass: {
          DEFAULT: '#B08D57',
          light: '#D6B37B',
          dark: '#8A6B3E',
        },
        // Secondary warm accent, drawn from walnut gunstock wood
        walnut: {
          DEFAULT: '#4A2F22',
          light: '#6B4530',
        },
        // Text
        ivory: '#EDE7DA',
        ash: '#9A968D',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Public Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'brass-gradient': 'linear-gradient(135deg, #D6B37B 0%, #B08D57 45%, #8A6B3E 100%)',
        'vignette': 'radial-gradient(120% 120% at 50% 0%, rgba(11,12,14,0) 0%, rgba(11,12,14,0.9) 100%)',
      },
      boxShadow: {
        brass: '0 0 0 1px rgba(176,141,87,0.35), 0 8px 30px -8px rgba(176,141,87,0.25)',
        soft: '0 20px 60px -20px rgba(0,0,0,0.6)',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
