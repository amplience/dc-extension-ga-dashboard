import { decimalFractionToPercentage } from './percentages';

describe('percentages', () => {
  describe('decimalFractionToPercentage', () => {
    it('should return a precentage', () => {
      expect(decimalFractionToPercentage(0.12)).toEqual('12.00');
    });
  });
});
