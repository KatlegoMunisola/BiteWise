const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');

// @expo/metro-config (not plain @react-native/metro-config) is required here —
// it's what actually implements EXPO_PUBLIC_* .env inlining, in both dev
// (via a serializer) and production (via a babel plugin) modes. Plain
// @react-native/metro-config + babel-preset-expo alone only gets the
// production half, silently leaving dev builds unconfigured.
//
// @expo/metro-config only knows HOW to substitute EXPO_PUBLIC_* references —
// it doesn't load .env into process.env itself (that's normally the Expo
// CLI's job via `expo start`, which we bypass by using the plain RN CLI).
// @expo/env is the same loader Expo CLI uses internally, so call it directly.
require('@expo/env').load(__dirname);

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
