import getSearchesWithNoResults, {
  getSearchesWithNoResultsForCsv,
} from './get-searches-with-no-results.service';
import type { SearchIndex } from 'dc-management-sdk-js';
import searchWithNoResults from '../__fixtures__/search-with-no-results';

describe('getSearchesWithNoResults service', () => {
  it('should list top hits for a given search index and params', async () => {
    const mockedSearchesWithNoResults = jest
      .fn()
      .mockImplementation(() => searchWithNoResults);
    const mockedSearchesWithNoResultsGet = jest.fn().mockImplementation(() => {
      return {
        getItems: mockedSearchesWithNoResults,
      };
    });
    const mockedSearchIndex = {
      related: {
        'searches-with-no-results': {
          get: mockedSearchesWithNoResultsGet,
        },
      },
    };
    const params = {
      limit: 5,
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getSearchesWithNoResults(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(mockedSearchesWithNoResultsGet).toHaveBeenCalledWith(params);
    expect(mockedSearchesWithNoResults).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });
});

describe('getSearchesWithNoResultsForCsv service', () => {
  it('should list csv formatted top hits for a given search index', async () => {
    const mockedSearchesWithNoResults = jest
      .fn()
      .mockImplementation(() => searchWithNoResults);
    const mockedSearchesWithNoResultsGet = jest.fn().mockImplementation(() => {
      return {
        getItems: mockedSearchesWithNoResults,
      };
    });
    const mockedSearchIndex = {
      related: {
        'searches-with-no-results': {
          get: mockedSearchesWithNoResultsGet,
        },
      },
    };

    const result = await getSearchesWithNoResultsForCsv(
      (mockedSearchIndex as unknown) as SearchIndex,
      { startDate: '2020-01-01', endDate: '2020-01-01' }
    );

    expect(result).toMatchSnapshot();
  });
});
