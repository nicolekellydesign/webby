module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaScript: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: ["plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:@typescript-eslint/recommended"],
  settings: {
    react: {
      version: "detect",
    },
  },
};
