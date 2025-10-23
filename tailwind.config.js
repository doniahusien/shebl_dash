/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      border: "#D1DEE1",
      line: "#D1DEE1",
      primary: "#D39A6B",
      error: "#FF445B",
      secondary: "#F88C43",
      success: "#0FB015",
      text: "#3A3A3A",
      sub: "#8D8D8D",
      transparent:"transparent",
      white: colors.white,
      placeholder:"#3D4C5E",
      error: "#DC3545",
      black: colors.black,
      gray: colors.gray,
      green: colors.green,
      orange:colors.orange,
      red: colors.red


    },
    screens: {
      xs: '425px',

      sm: "576px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1400px",
      "3xl": "1600px",
      // => @media (min-width: 1536px) { ... }
    },

    minHeight: {
      "3/4": "75vh",
    },
    border: {
      "1/2": "0.5px",
    },

    extend: {
      boxShadow: {
        card: "0 4px 4px  rgba(35, 40, 105, 0.08)",
        'base-shadow':"0px 6px 20px 0px #FDB93378",
        'base-shadow1':"0px 6px 20px 0px #F5F6FF",



      },
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      switzer: ["Switzer", "sans-serif"],
      "neo-sans": ["NeoSans", "sans-serif"],
      din: ["Din", "sans-serif"],
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
