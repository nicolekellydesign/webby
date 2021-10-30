module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontWeight: {
        lighter: "lighter",
      },
      height: {
        70: "70px",
        80: "80px",
        nav: "150px",
      },
      lineHeight: {
        70: "70px",
      },
      maxWidth: {
        logo: "115px",
        thumb: "256px",
      },
      maxHeight: {
        logo: "115px",
        thumb: "128px",
      },
      minWidth: {
        textLarge: "425px",
      },
      minHeight: {
        60: "60px",
        textLarge: "250px",
      },
      padding: {
        "2/3": "66.67%",
      },
      width: {
        70: "70px",
        email: "425px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
