export const reverseStr = (str: string) =>
  str
    .split('')
    .reverse()
    .join('');

export const addAll = (...args: number[]) => args.reduce((c, p) => c + p, 0);
