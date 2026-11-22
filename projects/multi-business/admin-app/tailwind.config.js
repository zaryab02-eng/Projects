/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colours (taken from the Natusz logo). Change here and the whole site follows.
        ink: "#062A2E",      // deepest teal, used for dark sections
        deep: "#0A3C42",     // slightly lighter dark teal
        brand: "#059EA9",    // logo teal
        "brand-dark": "#047983", // teal for text on light backgrounds (better contrast)
        mist: "#E9F3F2",     // pale teal-grey section background
        paper: "#F8FBFA",    // page background
        rose: "#ED1C24",     // logo red, use sparingly
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
    },
  },
  plugins: [],
};
