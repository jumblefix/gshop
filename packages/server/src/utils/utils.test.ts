import { makeSlug } from './utils';

describe('utils', () => {
  describe('multiply', () => {
    it('should multiply args passed', () => {
      expect(makeSlug('Hello World')).toEqual('hello-world');
    });
  });
});
