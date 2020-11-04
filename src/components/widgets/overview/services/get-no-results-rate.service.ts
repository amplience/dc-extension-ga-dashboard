import type {
  SearchIndex,
  SearchIndexNoResultsRate,
} from 'dc-management-sdk-js';

export interface GetNoResultsRateParams {
  includeReplicas?: boolean;
  startDate: string;
  endDate: string;
}

export default async function getNoResultsRate(
  searchIndex: SearchIndex,
  params: GetNoResultsRateParams
): Promise<SearchIndexNoResultsRate> {
  const results = await searchIndex.related['no-results-rate'].get({
    ...params,
  });

  return results;
}
