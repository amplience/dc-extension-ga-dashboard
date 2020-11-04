import type {
  SearchIndex,
  SearchIndexTopFiltersNoResultSearch,
} from 'dc-management-sdk-js';

interface GetTopSearchParams {
  search: string;
  limit?: number;
  offset?: number;
  includeReplicas?: boolean;
  startDate: string;
  endDate: string;
}

export default async function getTopFiltersNoResultSearch(
  index: SearchIndex,
  params: GetTopSearchParams
): Promise<SearchIndexTopFiltersNoResultSearch[]> {
  const topFilters = await index.related['top-filters-no-result-search'].get(
    params
  );
  return topFilters.getItems();
}

export async function getTopFiltersNoResultSearchForCsv(
  index: SearchIndex,
  params: GetTopSearchParams
): Promise<{ [key: string]: unknown }[]> {
  const topFilters = await getTopFiltersNoResultSearch(index, {
    ...params,
    offset: 0,
    limit: 1000,
  });
  let maxLengthOfValues = 0;
  for (const filter of topFilters) {
    if (filter.values.length > maxLengthOfValues) {
      maxLengthOfValues = filter.values.length;
    }
  }

  return topFilters.map((filter) => {
    const csvValue = { Count: filter.count };
    for (let i = 0; i < maxLengthOfValues; i++) {
      csvValue[`Filter attribute ${i + 1}`] = filter.values[i]
        ? `${filter.values[i].attribute}${filter.values[i].operator}${filter.values[i].value}`
        : '';
    }
    return csvValue;
  });
}
