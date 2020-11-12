import { writable as svelteWritable, Writable } from 'svelte/store';
import { hub } from './dynamic-content';

export const PREFIX = 'dc-dashboard-ga.';

export function persistedWritable<T>(key: string, value: T): Writable<T> {
  const svelteStore = svelteWritable(value);
  hub.subscribe((selectedHub) => {
    if (selectedHub === null) {
      return;
    }

    const localStorageKey = `${PREFIX}${selectedHub?.name}-${key}`;

    const newValue = localStorage.getItem(localStorageKey);
    if (newValue) {
      svelteStore.set(JSON.parse(newValue));
    }

    svelteStore.subscribe((value) => {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    });
  });

  return svelteStore;
}
