/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: v("ink-50"),
          100: v("ink-100"),
          200: v("ink-200"),
          300: v("ink-300"),
          500: v("ink-500"),
          600: v("ink-600"),
          700: v("ink-700"),
          800: v("ink-800"),
          900: v("ink-900"),
          950: v("ink-950"),
        },
        copper: {
          50: "#FFF3EA",
          100: "#FFE1CC",
          300: "#FFB17A",
          400: v("copper-400"),
          500: "#E85D12",
          600: "#C44A0A",
          700: "#9A3A08",
        },
        steel: {
          300: v("steel-300"),
          400: "#649BB4",
          500: "#4A7A96",
          600: "#396078",
        },
        vitality: {
          full: v("ok"),
          good: "#3C9A5C",
          fair: "#8FBF4E",
          warn: v("warn"),
          soon: "#DE8A3A",
          critical: "#E0422F",
          expired: "#5B616E",
        },
      },
      fontFamily: {
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "Inter",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "Inter",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "Inter",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        glow: "none",
        sheet: "0 24px 64px -12px rgba(0,0,0,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "sheet-up": {
          "0%": { opacity: 0, transform: "translateY(32px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s cubic-bezier(0.22,1,0.36,1) both",
        "sheet-up": "sheet-up 0.34s cubic-bezier(0.32,0.72,0,1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
