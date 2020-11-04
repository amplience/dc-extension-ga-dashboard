import { formatDateAsISOString } from './date-format';

describe('date-format', () => {
  describe('formatDateAsISOString', () => {
    it('should return an ISO string formatted date', () => {
      expect(formatDateAsISOString(new Date('2020-08-01T03:24:00'))).toEqual(
        '2020-08-01'
      );
    });
  });
});
