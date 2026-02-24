import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  fakeTimers: { enableGlobally: false },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@expo/vector-icons/(.*)$': '<rootDir>/src/test/__mocks__/expo-vector-icons.js',
    '^@expo/vector-icons$': '<rootDir>/src/test/__mocks__/expo-vector-icons.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      'react-native' +
      '|@react-native' +
      '|expo' +
      '|@expo' +
      '|expo-router' +
      '|expo-linking' +
      '|expo-constants' +
      '|expo-modules-core' +
      '|expo-image' +
      '|expo-file-system' +
      '|expo-asset' +
      '|expo-font' +
      '|expo-status-bar' +
      '|@shopify/flash-list' +
      '|react-native-paper' +
      '|react-native-track-player' +
      '|react-native-reanimated' +
      '|react-native-gesture-handler' +
      '|react-native-svg' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|react-native-mmkv' +
      '|react-native-nitro-modules' +
      '|react-native-worklets' +
      '|react-native-text-ticker' +
      '|@sentry/react-native' +
      '|@pchmn/expo-material3-theme' +
      '|@johnhamlin/redux-persist' +
      '|@reduxjs/toolkit' +
      '|@react-native-community/slider' +
      '|react-native-vector-icons' +
      '|@expo/vector-icons' +
      '|msw' +
      '|until-async' +
      '|@bundled-es-modules' +
      '|@mswjs' +
      ')/)',
  ],
};

export default config;
