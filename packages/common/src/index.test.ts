import { reverseStr } from '.';

describe('common test', () => {
  describe('reverse', () => {
    it('should reverse given string', () => {
      expect(reverseStr('hello')).toEqual('olleh');
    });
  });
});
