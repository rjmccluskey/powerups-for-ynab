export function floatToMilliunits(floatAmount?: number): number {
  if (!(typeof floatAmount === 'number')) {
    floatAmount = 0;
  }
  return Math.round(floatAmount * 1000);
}
