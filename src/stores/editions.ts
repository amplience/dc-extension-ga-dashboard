import { get, writable } from 'svelte/store';
import { client } from './dynamic-content';

function createEditions() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    fetch: async (id) => {
      const cachedEdition = get(editions).find((item) => item.id === id);
      if (cachedEdition) {
        return cachedEdition;
      }
      const edition = await get(client).editions.get(id);
      update((n) => [...n, ...[edition]]);
      return edition;
    },
    reset: () => set([]),
  };
}

export const editions = createEditions();
