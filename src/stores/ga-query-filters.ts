import { derived } from 'svelte/store';
import {
  contentItemIdMapping,
  editionIdMapping,
  slotIdMapping,
} from './google-analytics';
import { writable } from 'svelte/store';
import { selectedEdition } from './filter/selected-edition';
import { selectedContentItems } from './filter/selected-content-items';
import { selectedSlots } from './filter/selected-slots';
import { FILTERS, selectedFilter } from './filter/selected-filter';

export const contentItemFilter = writable<string>(null);
export const editionFilter = writable<string>(null);
export const slotFilter = writable<string>(null);

export const gaQueryFilter = derived(
  [
    selectedFilter,
    selectedEdition,
    editionIdMapping,
    selectedContentItems,
    contentItemIdMapping,
    selectedSlots,
    slotIdMapping,
  ],
  ([
    $selectedFilter,
    $selectedEdition,
    $editionIdMapping,
    $selectedContentItems,
    $contentItemIdMapping,
    $selectedSlots,
    $slotIdMapping,
  ]) => {
    if ($selectedFilter) {
      const handlers: Record<FILTERS, () => string> = {
        EDITION: () => `${$editionIdMapping}==${$selectedEdition?.id}`,
        CONTENT: () =>
          $selectedContentItems
            .map((contentItem) => `${$contentItemIdMapping}==${contentItem.id}`)
            .join(','),
        SLOT: () =>
          $selectedSlots
            .map((contentItem) => `${$slotIdMapping}==${contentItem.id}`)
            .join(','),
      };
      return handlers[$selectedFilter]();
    }
    return undefined;
  }
);

export const joinFilters = (...filters: string[]): string | null =>
  filters
    .filter((filter) => typeof filter === 'string' && filter.length > 0)
    .join(';') || null;
