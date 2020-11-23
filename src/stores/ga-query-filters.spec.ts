import { joinFilters } from './ga-query-filters';

describe('ga-query-filters', () => {
  it('should return both filters', () => {
    const retVal = joinFilters('abc', 'def');
    expect(retVal).toEqual('abc;def');
  });

  it('should return null when both filters not used', () => {
    const retVal = joinFilters(null, '');
    expect(retVal).toEqual(null);
  });

  it('should ignore null', () => {
    const retVal = joinFilters(null, 'abc');
    expect(retVal).toEqual('abc');
  });

  it('should ignore multiple nulls', () => {
    const retVal = joinFilters(null, 'abc', null, 'def');
    expect(retVal).toEqual('abc;def');
  });

  it('should ignore undefined', () => {
    const retVal = joinFilters(undefined, 'abc');
    expect(retVal).toEqual('abc');
  });
  it('should ignore multiple undefineds', () => {
    const retVal = joinFilters(undefined, 'abc', undefined, 'def');
    expect(retVal).toEqual('abc;def');
  });

  it('should return first filter only', () => {
    const retVal = joinFilters('abc', null);
    expect(retVal).toEqual('abc');
  });
});
