import { floatToMilliunits } from './float-to-milliunits';

describe('floatToMilliunits', () => {
  it('converts float amount to milliunit integer', () => {
    const inputOutputs: [number, number][] = [
      [0, 0],
      [0.0017, 0],
      [0.002, 0],
      [0.006, 10],
      [0.049, 50],
      [0.05, 50],
      [0.37, 370],
      [0.4, 400],
      [4.3, 4300],
      [6, 6000],
      [74, 74000],
      [80, 80000],
      [180, 180000],
      [900, 900000],
    ];
    for (const [input, output] of inputOutputs) {
      expect(floatToMilliunits(input)).toBe(output);
      expect(floatToMilliunits(input * -1)).toBe(output * -1);
    }
  });

  it('converts missing values to 0', () => {
    const inputOutputs = [
      [null, 0],
      [undefined, 0],
    ];
    for (const [input, output] of inputOutputs) {
      expect(floatToMilliunits(input)).toBe(output);
    }
  });
});
