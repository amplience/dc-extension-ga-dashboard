import { writable as svelteWritable, Writable } from 'svelte/store';

export const PREFIX = 'dc-dashboard-ga.';

export function persistedWritable<T>(key: string, value: T): Writable<T> {
  const svelteStore = svelteWritable(value);

  const localStorageKey = PREFIX + key;

  const newValue = localStorage.getItem(localStorageKey);
  if (newValue) {
    svelteStore.set(JSON.parse(newValue));
  }

  svelteStore.subscribe((value) => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  });

  return svelteStore;
}
