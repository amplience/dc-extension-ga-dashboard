import { derived } from 'svelte/store';
import { contentItemIdMapping, editionIdMapping } from './google-analytics';
import { selectedContentItems } from './selected-content-items';
import { selectedEdition } from './selected-edition';
import { writable } from 'svelte/store';

export const contentItemFilter = writable<string>(null);
export const editionFilter = writable<string>(null);
export const slotFilter = writable<string>(null);

export const gaQueryFilter = derived(
  [
    selectedEdition,
    editionIdMapping,
    selectedContentItems,
    contentItemIdMapping,
  ],
  ([
    $selectedEdition,
    $editionIdMapping,
    $selectedContentItems,
    $contentItemIdMapping,
  ]) => {
    if ($selectedEdition) {
      return $editionIdMapping + '==' + $selectedEdition.id;
    } else if ($selectedContentItems.length > 0) {
      return $selectedContentItems
        .map((contentItem) => $contentItemIdMapping + '==' + contentItem.id)
        .join(',');
    }
    return undefined;
  }
);

export const joinFilters = (...filters: string[]): string | null =>
  filters
    .filter((filter) => typeof filter === 'string' && filter.length > 0)
    .join(';') || null;
