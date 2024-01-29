module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    env: {
      production: {
        plugins: [
          'react-native-paper/babel',
          [
            '@babel/plugin-transform-react-jsx',
            {
              runtime: 'automatic',
              importSource: 'nativewind',
            },
          ],
        ],
      },
    },
  };
};
