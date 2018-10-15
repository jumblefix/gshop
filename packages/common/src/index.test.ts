import { addAll, reverseStr } from './index';

describe('common test', () => {
  describe('reverse', () => {
    it('should reverse given string', () => {
      expect(reverseStr('hello')).toEqual('olleh');
    });
  });
  describe('addAll', () => {
    it('should add all args passed', () => {
      expect(addAll(2, 2, 3)).toEqual(7);
    });
  });
});
