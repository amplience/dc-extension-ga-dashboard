import type { SearchIndex, SearchIndexTopHits } from 'dc-management-sdk-js';

interface ListTopHitsParams {
  clickAnalytics?: boolean;
  limit?: number;
  search?: string;
  includeReplicas?: boolean;
  startDate: string;
  endDate: string;
}

export default async function getTopHits(
  searchIndex: SearchIndex,
  params: ListTopHitsParams
): Promise<SearchIndexTopHits[]> {
  const topHits = await searchIndex.related['top-hits'].get({
    clickAnalytics: true,
    ...params,
  });
  return topHits.getItems();
}

export interface SearchIndexTopHitsForCsv {
  contentItemId: string;
  count: number;
}

export async function getTopHitsForCsv(
  searchIndex: SearchIndex,
  params: ListTopHitsParams
): Promise<SearchIndexTopHitsForCsv[]> {
  return (await getTopHits(searchIndex, { limit: 1000, ...params })).map(
    ({ hit: contentItemId, count: count }) => ({
      contentItemId,
      count,
    })
  );
}
