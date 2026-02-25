test('jest is configured correctly', () => {
  expect(1 + 1).toBe(2);
});

test('path alias @/ resolves', () => {
  const { rgbStringToRgbaString } = require('@/styles/utils/rgbStringToRgbaString');
  expect(typeof rgbStringToRgbaString).toBe('function');
});
