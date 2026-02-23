import { rgbStringToRgbaString } from '../rgbStringToRgbaString';

describe('rgbStringToRgbaString', () => {
  it('converts rgb(255, 0, 128) with alpha 0.5 to rgba string', () => {
    expect(rgbStringToRgbaString('rgb(255, 0, 128)', 0.5)).toBe(
      'rgba(255, 0, 128, 0.5)',
    );
  });

  it('handles alpha of 0 (fully transparent)', () => {
    expect(rgbStringToRgbaString('rgb(100, 200, 50)', 0)).toBe(
      'rgba(100, 200, 50, 0)',
    );
  });

  it('handles alpha of 0.5 (half transparent)', () => {
    expect(rgbStringToRgbaString('rgb(0, 0, 0)', 0.5)).toBe(
      'rgba(0, 0, 0, 0.5)',
    );
  });

  it('handles alpha of 1 (fully opaque)', () => {
    expect(rgbStringToRgbaString('rgb(255, 255, 255)', 1)).toBe(
      'rgba(255, 255, 255, 1)',
    );
  });

  it('handles extra whitespace in the rgb string', () => {
    expect(rgbStringToRgbaString('rgb(  10 ,  20 ,  30  )', 0.8)).toBe(
      'rgba(10, 20, 30, 0.8)',
    );
  });

  it('throws on invalid input with no numbers', () => {
    expect(() => rgbStringToRgbaString('not a color', 0.5)).toThrow(
      'Invalid RGB string',
    );
  });

  it('throws on empty string', () => {
    expect(() => rgbStringToRgbaString('', 0.5)).toThrow('Invalid RGB string');
  });
});
