import { derived } from 'svelte/store';
import { editionIdMapping } from './google-analytics';
import { selectedEdition } from './selected-edition';

export const gaQueryFilter = derived(
  [selectedEdition, editionIdMapping],
  ([$selectedEdition, $editionIdMapping]) => {
    if ($selectedEdition) {
      return ['ga:' + $editionIdMapping + '==' + $selectedEdition.id];
    }
    return [];
  }
);
