module.exports = {
  plugins: ['@typescript-eslint'],
  root: true,
  extends: '@extensionengine/eslint-config/base',
  rules: {
    'no-control-regex': 0
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
};
