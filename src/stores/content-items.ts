import { get, writable } from 'svelte/store';
import { client } from './dynamic-content';

function createContentItems() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    fetch: async (id) => {
      const cachedContentItem = get(contentItems).find(
        (item) => item.id === id
      );
      if (cachedContentItem) {
        return cachedContentItem;
      }
      const contentItem = await get(client).contentItems.get(id);
      update((n) => [...n, ...[contentItem]]);
      return contentItem;
    },
    reset: () => set([]),
  };
}

export const contentItems = createContentItems();
