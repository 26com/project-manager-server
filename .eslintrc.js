module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 0,
    'react/button-has-type': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-console': 0,
  },
};
