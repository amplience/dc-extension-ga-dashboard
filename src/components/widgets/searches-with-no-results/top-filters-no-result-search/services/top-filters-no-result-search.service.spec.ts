import topFiltersNoResultSearch from './__fixtures__/top-filter-no-results-search';
import getTopFiltersNoResultSearch, {
  getTopFiltersNoResultSearchForCsv,
} from './top-filters-no-result-search.service';
import type { SearchIndex } from 'dc-management-sdk-js';

describe('getTopFiltersNoResultSearch', () => {
  it('should getTopFiltersNoResultSearch return data', async () => {
    const mockedGetItems = jest
      .fn()
      .mockImplementation(() => topFiltersNoResultSearch);
    const mockedTopFiltersNotResultSearchesGet = jest
      .fn()
      .mockImplementation(() => {
        return {
          getItems: mockedGetItems,
        };
      });
    const mockedSearchIndex = {
      related: {
        'top-filters-no-result-search': {
          get: mockedTopFiltersNotResultSearchesGet,
        },
      },
    };
    const params = {
      search: 'q0',
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getTopFiltersNoResultSearch(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(mockedTopFiltersNotResultSearchesGet).toHaveBeenCalledWith(params);
    expect(mockedGetItems).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });
});

describe('getTopFiltersNoResultSearchForCsv', () => {
  it('should getTopFiltersNoResultSearchForCsv return data', async () => {
    const mockedGetItems = jest
      .fn()
      .mockImplementation(() => topFiltersNoResultSearch);
    const mockedTopFiltersNotResultSearchesGet = jest
      .fn()
      .mockImplementation(() => {
        return {
          getItems: mockedGetItems,
        };
      });
    const mockedSearchIndex = {
      related: {
        'top-filters-no-result-search': {
          get: mockedTopFiltersNotResultSearchesGet,
        },
      },
    };
    const params = {
      search: 'q0',
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getTopFiltersNoResultSearchForCsv(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(mockedTopFiltersNotResultSearchesGet).toHaveBeenCalledWith({
      ...params,
      offset: 0,
      limit: 1000,
    });
    expect(mockedGetItems).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });
});
