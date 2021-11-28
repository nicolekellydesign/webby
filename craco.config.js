const path = require("path");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    alias: {
      "@Components": path.resolve(__dirname, "src/components/"),
      "@Icons": path.resolve(__dirname, "src/icons/"),
      "@Pages": path.resolve(__dirname, "src/pages/"),
      "@Services": path.resolve(__dirname, "src/services/"),
    },
  },
};
