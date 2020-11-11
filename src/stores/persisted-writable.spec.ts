import { get } from 'svelte/store';
import { persistedWritable, PREFIX } from './persisted-writable';

describe('persisted writable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should return a svelte writeable', () => {
    const result = persistedWritable('a-key', null);
    expect(result.set).toBeDefined();
    expect(result.update).toBeDefined();
    expect(result.subscribe).toBeDefined();
  });

  it('should load the value using the localstorage - null', () => {
    const key = 'a-key';

    const store = persistedWritable(key, null);
    expect(get(store)).toEqual(null);
    expect(localStorage.getItem).toHaveBeenLastCalledWith(PREFIX + key);
  });

  it('should load the value using the localstorage - string', () => {
    setAndGetFromStore('a string');
  });

  it('should load the value using the localstorage - bool (true)', () => {
    setAndGetFromStore(true);
  });

  it('should load the value using the localstorage - bool (false)', () => {
    setAndGetFromStore(false);
  });

  it('should load the value using the localstorage - number', () => {
    setAndGetFromStore(123);
  });

  it('should load the value using the localstorage - array', () => {
    setAndGetFromStore(['a', 123, false, true, {}, []]);
  });

  it('should load the value using the localstorage - object', () => {
    setAndGetFromStore({ a: 'a', b: 123, c: false });
  });
});

function setAndGetFromStore(value: unknown) {
  const key = 'test-key';
  persistedWritable(key, value);
  const store = persistedWritable(key, null);
  expect(get(store)).toEqual(value);
  expect(localStorage.getItem).toHaveBeenCalledWith(PREFIX + key);

  expect(localStorage.setItem).toHaveBeenCalledWith(
    PREFIX + key,
    JSON.stringify(value)
  );
  expect(localStorage.getItem).toHaveBeenCalledWith(PREFIX + key);
}
