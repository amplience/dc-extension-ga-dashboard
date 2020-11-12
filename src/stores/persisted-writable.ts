import { writable as svelteWritable, Writable } from 'svelte/store';

export const PREFIX = 'dc-dashboard-ga.';

export function persistedWritable<T>(key: string, value: T): Writable<T> {
  const svelteStore = svelteWritable(value);

  const storageKey = PREFIX + key;

  const newValue = sessionStorage.getItem(storageKey);
  if (newValue) {
    svelteStore.set(JSON.parse(newValue));
  }

  svelteStore.subscribe((value) => {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  });

  return svelteStore;
}
