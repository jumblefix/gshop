export const multiplyAll = (...args: number[]) =>
  args.reduce((c, p) => c * p, 1);
