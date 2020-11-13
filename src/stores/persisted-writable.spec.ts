import type { Hub } from 'dc-management-sdk-js';
import { get } from 'svelte/store';
import { hub } from './dynamic-content';
import { persistedWritable, PREFIX } from './persisted-writable';

const testHub = {
  name: 'hubName',
} as Hub;

describe('persisted writable', () => {
  beforeEach(() => {
    hub.set(testHub);
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('should return a svelte writeable', () => {
    const result = persistedWritable('a-key', null);
    expect(result.set).toBeDefined();
    expect(result.update).toBeDefined();
    expect(result.subscribe).toBeDefined();
  });

  it('should load the value using the sessionStorage - null', () => {
    const key = 'a-key';

    const store = persistedWritable(key, null);
    expect(get(store)).toEqual(null);
    expect(sessionStorage.getItem).toHaveBeenLastCalledWith(
      `${PREFIX}${testHub.name}-${key}`
    );
  });

  it('should load the value using the sessionStorage - string', () => {
    setAndGetFromStore('a string');
  });

  it('should load the value using the sessionStorage - bool (true)', () => {
    setAndGetFromStore(true);
  });

  it('should load the value using the sessionStorage - bool (false)', () => {
    setAndGetFromStore(false);
  });

  it('should load the value using the sessionStorage - number', () => {
    setAndGetFromStore(123);
  });

  it('should load the value using the sessionStorage - array', () => {
    setAndGetFromStore(['a', 123, false, true, {}, []]);
  });

  it('should load the value using the sessionStorage - object', () => {
    setAndGetFromStore({ a: 'a', b: 123, c: false });
  });
});

function setAndGetFromStore(value: unknown) {
  const key = 'test-key';
  persistedWritable(key, value);
  const store = persistedWritable(key, null);
  expect(get(store)).toEqual(value);
  expect(sessionStorage.getItem).toHaveBeenCalledWith(
    `${PREFIX}${testHub.name}-${key}`
  );

  expect(sessionStorage.setItem).toHaveBeenCalledWith(
    `${PREFIX}${testHub.name}-${key}`,
    JSON.stringify(value)
  );
  expect(sessionStorage.getItem).toHaveBeenCalledWith(
    `${PREFIX}${testHub.name}-${key}`
  );
}
