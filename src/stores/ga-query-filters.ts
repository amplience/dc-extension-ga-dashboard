import { derived } from 'svelte/store';
import { editionIdMapping } from './google-analytics';
import { selectedEdition } from './selected-edition';
import { writable } from 'svelte/store';

export const contentItemFilter = writable<string>(null);
export const editionFilter = writable<string>(null);
export const slotFilter = writable<string>(null);

export const gaQueryFilter = derived(
  [selectedEdition, editionIdMapping],
  ([$selectedEdition, $editionIdMapping]) => {
    if ($selectedEdition) {
      return $editionIdMapping + '==' + $selectedEdition.id;
    }
    return null;
  }
);

export function constructFilter(
  customFilter: string,
  queryFilter: string
): string {
  if (customFilter) {
    return queryFilter ? `${queryFilter};${customFilter}` : customFilter;
  }

  return queryFilter;
}
