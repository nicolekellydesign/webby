module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontWeight: {
        lighter: 'lighter',
      },
      height: {
        50: '50px',
        70: '70px',
        80: '80px',
        nav: '150px',
      },
      lineHeight: {
        70: '70px',
      },
      maxWidth: {
        logo: '115px',
      },
      maxHeight: {
        logo: '115px',
      },
      width: {
        70: '70px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
