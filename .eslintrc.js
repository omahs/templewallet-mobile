module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:jest/recommended'],
  plugins: ['jest'],
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-void': 'off'
  }
};
