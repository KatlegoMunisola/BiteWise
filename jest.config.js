module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|firebase|@firebase/.*)',
  ],
  setupFiles: ['./__tests__/setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '__tests__/setup.js', '__tests__/helpers/'],
};
