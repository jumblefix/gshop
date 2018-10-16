import { multiplyAll } from './utils';

describe('utils', () => {
  describe('multiply', () => {
    it('should multiply args passed', () => {
      expect(multiplyAll(1, 2, 3)).toEqual(6);
    });
  });
});
