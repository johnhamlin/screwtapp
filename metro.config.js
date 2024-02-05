// This replaces `const { getDefaultConfig } = require('expo/metro-config');`
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// This replaces `const config = getDefaultConfig(__dirname);`
// eslint-disable-next-line no-undef
const config = getSentryExpoConfig(__dirname);

module.exports = config;
