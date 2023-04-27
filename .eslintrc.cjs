module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["next/core-web-vitals", "airbnb", "airbnb/hooks", "airbnb-typescript", "plugin:storybook/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json']
  },
  plugins: ['react'],
  rules: {
    "react/react-in-jsx-scope": "off"
  }
};