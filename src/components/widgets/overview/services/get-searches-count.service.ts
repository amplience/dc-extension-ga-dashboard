import type {
  SearchIndex,
  SearchIndexSearchesCount,
} from 'dc-management-sdk-js';

export interface GetSearchesCountParams {
  includeReplicas?: boolean;
  startDate: string;
  endDate: string;
}

export default async function getSearchesCount(
  searchIndex: SearchIndex,
  params: GetSearchesCountParams
): Promise<SearchIndexSearchesCount> {
  const results = await searchIndex.related['searches-count'].get({
    ...params,
  });
  return results;
}
