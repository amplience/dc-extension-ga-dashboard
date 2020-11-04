import type {
  SearchIndex,
  SearchIndexSearchesWithNoResults,
} from 'dc-management-sdk-js';

interface SearchesWithNoResults {
  limit?: number;
  includeReplicas?: boolean;
  startDate: string;
  endDate: string;
}

export default async function getSearchesWithNoResults(
  searchIndex: SearchIndex,
  params: SearchesWithNoResults
): Promise<SearchIndexSearchesWithNoResults[]> {
  const searchesWithNoResults = await searchIndex.related[
    'searches-with-no-results'
  ].get(params);
  return searchesWithNoResults.getItems();
}

export async function getSearchesWithNoResultsForCsv(
  searchIndex: SearchIndex,
  params: SearchesWithNoResults
): Promise<SearchIndexSearchesWithNoResults[]> {
  return await getSearchesWithNoResults(searchIndex, {
    limit: 1000,
    ...params,
  });
}
