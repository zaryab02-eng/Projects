/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Ink surfaces — the "gym floor at night" backdrop
        ink: {
          50: '#F2F1ED',
          950: '#0B0C10',
          900: '#12141A',
          800: '#1A1D24',
          700: '#242832',
          600: '#333844',
          500: '#4A5060'
        },
        // Forged copper — the primary brand accent (heated metal, not clay)
        copper: {
          50: '#FDF1EA',
          100: '#FAE0CE',
          300: '#E89A6C',
          400: '#DD7C48',
          500: '#C1622B',
          600: '#A34E20',
          700: '#7F3C18'
        },
        // Cool steel — secondary accent for verified badges / links
        steel: {
          300: '#8FB4C7',
          400: '#649BB4',
          500: '#4A7A96',
          600: '#396078'
        },
        // Membership validity scale (functional, not brand)
        vitality: {
          full: '#1B6E4C',
          good: '#3C9A5C',
          fair: '#8FBF4E',
          warn: '#E0B93B',
          soon: '#DE8A3A',
          critical: '#C6462F',
          expired: '#5B616E'
        }
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(193,98,43,0.25), 0 0 24px -4px rgba(193,98,43,0.35)'
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite'
      }
    }
  },
  plugins: []
}
