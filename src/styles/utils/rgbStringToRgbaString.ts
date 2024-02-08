export function rgbStringToRgbaString(
  rgbString: string,
  alpha: number,
): string {
  // Match numbers in the rgb string
  const regex = /\d+/g;
  const numberStrings = rgbString.match(regex);

  if (!numberStrings) {
    throw new Error('Invalid RGB string');
  }

  // Convert matched strings to numbers
  const rgbNumbers = numberStrings.map(num => parseInt(num, 10));

  return `rgba(${rgbNumbers.join(', ')}, ${alpha})`;
}
