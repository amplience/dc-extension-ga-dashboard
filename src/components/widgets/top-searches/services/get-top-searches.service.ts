import type {
  SearchIndex,
  SearchIndexTopSearches,
  SearchesOrderBy,
} from 'dc-management-sdk-js';

interface GetTopSearchParams {
  clickAnalytics?: boolean;
  orderBy?: SearchesOrderBy;
  direction?: 'asc' | 'desc';
  limit?: number;
  includeReplicas?: boolean;
  startDate: string;
  endDate: string;
}

export default async function getTopSearches(
  index: SearchIndex,
  params: GetTopSearchParams
): Promise<SearchIndexTopSearches[]> {
  const getParams = { clickAnalytics: true, ...params };
  const topSearches = await index.related['top-searches'].get(getParams);
  return topSearches.getItems();
}

export interface SearchIndexTopSearchesForCsv {
  query: string;
  count: number;
  clickThroughRate: number;
  conversionRate: number;
  averageClickPosition: number;
}

export async function getTopSearchesForCsv(
  index: SearchIndex,
  params: GetTopSearchParams
): Promise<SearchIndexTopSearchesForCsv[]> {
  return (await getTopSearches(index, { limit: 1000, ...params })).map(
    ({
      search: query,
      trackedSearchCount: count,
      clickThroughRate,
      conversionRate,
      averageClickPosition,
    }) => ({
      query,
      count,
      clickThroughRate,
      conversionRate,
      averageClickPosition,
    })
  );
}
