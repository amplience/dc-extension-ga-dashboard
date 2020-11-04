import getTopSearches, {
  getTopSearchesForCsv,
} from './get-top-searches.service';
import type { SearchIndex } from 'dc-management-sdk-js';
import topSearchesFixture from '../__fixtures__/top-search-single-item-list';

describe('getTopSearches', () => {
  it('should list top hits for a given search index and params', async () => {
    const mockedGetItems = jest
      .fn()
      .mockImplementation(() => topSearchesFixture);
    const mockedTopSearchesGet = jest.fn().mockImplementation(() => {
      return {
        getItems: mockedGetItems,
      };
    });
    const mockedSearchIndex = {
      related: {
        'top-searches': {
          get: mockedTopSearchesGet,
        },
      },
    };
    const params = {
      limit: 5,
      clickAnalytics: true,
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getTopSearches(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(mockedTopSearchesGet).toHaveBeenCalledWith(params);
    expect(mockedGetItems).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });
});

describe('getTopSearchesForCsv', () => {
  it('should only list csv specific properties for top searches for a given search index and params', async () => {
    const mockedGetItems = jest
      .fn()
      .mockImplementation(() => topSearchesFixture);
    const mockedTopSearchesGet = jest.fn().mockImplementation(() => {
      return {
        getItems: mockedGetItems,
      };
    });
    const mockedSearchIndex = {
      related: {
        'top-searches': {
          get: mockedTopSearchesGet,
        },
      },
    };
    const params = {
      clickAnalytics: true,
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getTopSearchesForCsv(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(result).toMatchSnapshot();
  });
});
