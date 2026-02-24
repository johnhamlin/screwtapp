/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  testRunner: 'jest',
  checkers: [],
  coverageAnalysis: 'perTest',
  ignorePatterns: ['build', 'ios', 'android', '.maestro', '.expo', '.specify', 'specs'],
  incremental: true,
  mutate: [
    'src/styles/utils/rgbStringToRgbaString.ts',
    'src/features/mixtapeList/slices/mixtapeListApi.ts',
  ],
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },
  jest: {
    configFile: 'jest.config.ts',
  },
  timeoutMS: 30000,
  thresholds: {
    high: 80,
    low: 60,
    break: 60,
  },
};

export default config;
