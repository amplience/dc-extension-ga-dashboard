import { constructFilter } from './ga-query-filters';

describe('ga-query-filters', () => {
  it('should return both filters', () => {
    const retVal = constructFilter('abc', 'def');
    expect(retVal).toEqual('abc;def');
  });

  it('should return null when both filters not used', () => {
    const retVal = constructFilter(null, '');
    expect(retVal).toEqual(null);
  });

  it('should return second filter only', () => {
    const retVal = constructFilter(null, 'def');
    expect(retVal).toEqual('def');
  });

  it('should return first filter only', () => {
    const retVal = constructFilter('abc', null);
    expect(retVal).toEqual('abc');
  });
});
