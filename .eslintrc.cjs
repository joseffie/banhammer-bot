module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['airbnb-base'],
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'no-console': 'off',
    'no-continue': 'off',
    'no-underscore-dangle': 'off',
    'operator-linebreak': ['error', 'before'],
    'import/extensions': ['error', 'always'],
  },
};
