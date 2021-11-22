module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontWeight: {
        lighter: "lighter",
      },
      height: {
        80: "80px",
        192: "48rem",
        nav: "150px",
      },
      maxWidth: {
        fit: "fit-content",
        logo: "115px",
        thumb: "256px",
      },
      maxHeight: {
        logo: "115px",
        thumb: "128px",
      },
      minHeight: {
        36: "9rem",
        60: "60px",
        64: "16rem",
      },
      padding: {
        "2/3": "66.67%",
      },
      width: {
        "6xl": "72rem",
        "7xl": "80rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        nicolekellydesign: {
          primary: "#a991f7" /* Primary color */,
          "primary-focus": "#8462f4" /* Primary color - focused */,
          "primary-content": "#ffffff" /* Foreground content color to use on primary color */,

          secondary: "#f6d860" /* Secondary color */,
          "secondary-focus": "#f3cc30" /* Secondary color - focused */,
          "secondary-content": "#ffffff" /* Foreground content color to use on secondary color */,

          accent: "#37cdbe" /* Accent color */,
          "accent-focus": "#2aa79b" /* Accent color - focused */,
          "accent-content": "#ffffff" /* Foreground content color to use on accent color */,

          neutral: "#3d4451" /* Neutral color */,
          "neutral-focus": "#2a2e37" /* Neutral color - focused */,
          "neutral-content": "#ffffff" /* Foreground content color to use on neutral color */,

          "base-100": "#000000" /* Base color of page, used for blank backgrounds */,
          "base-200": "#333333" /* Base color, a little lighter */,
          "base-300": "#4d4d4d" /* Base color, even more lighter */,
          "base-content": "#ffffff" /* Foreground content color to use on base color */,

          info: "#2094f3" /* Info */,
          success: "#009485" /* Success */,
          warning: "#ff9900" /* Warning */,
          error: "#ff5724" /* Error */,

          ".btn": {
            "text-transform": "none",
          },
        },
      },
    ],
  },
};
