// This replaces `const { getDefaultConfig } = require('expo/metro-config');`
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

// This replaces `const config = getDefaultConfig(__dirname);`
const config = getSentryExpoConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
