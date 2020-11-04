import type { SearchIndex, SearchIndexUsersCount } from 'dc-management-sdk-js';

export interface GetUsersCountParams {
  includeReplicas?: boolean;
  startDate: string;
  endDate: string;
}

export default async function getUsersCount(
  searchIndex: SearchIndex,
  params: GetUsersCountParams
): Promise<SearchIndexUsersCount> {
  const results = await searchIndex.related['users-count'].get({
    ...params,
  });
  return results;
}
