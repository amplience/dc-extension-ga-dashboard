import { writable, derived } from 'svelte/store';
import type {
  SearchIndexUsersCount,
  SearchIndexSearchesCount,
  SearchIndexNoResultsRate,
} from 'dc-management-sdk-js';

export interface Counts {
  usersCount?: SearchIndexUsersCount;
  searchesCount?: SearchIndexSearchesCount;
  noResultsRate?: SearchIndexNoResultsRate;
}

export const counts = writable<Counts>({});

export const searchesPerUser = derived(counts, ($counts) => {
  return $counts?.usersCount?.count && $counts?.searchesCount?.count
    ? Math.round(
        ($counts?.searchesCount?.count / $counts?.usersCount?.count) * 1e1
      ) / 1e1
    : 0;
});
