import getTopHits, { getTopHitsForCsv } from './get-top-hits.service';
import type { SearchIndex } from 'dc-management-sdk-js';
import topHitsFixture from '../__fixtures__/top-hits-single-item-list';

describe('getTopHits service', () => {
  it('should list top hits for a given search index and params', async () => {
    const mockedGetItems = jest.fn().mockImplementation(() => topHitsFixture);
    const mockedTopResultsGet = jest.fn().mockImplementation(() => {
      return {
        getItems: mockedGetItems,
      };
    });
    const mockedSearchIndex = {
      related: {
        'top-hits': {
          get: mockedTopResultsGet,
        },
      },
    };
    const params = {
      limit: 5,
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getTopHits(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(mockedTopResultsGet).toHaveBeenCalledWith({
      clickAnalytics: true,
      ...params,
    });
    expect(mockedGetItems).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });
});

describe('getTopHitsForCsv service', () => {
  it('should list csv formatted top hits for a given search index', async () => {
    const mockedGetItems = jest.fn().mockImplementation(() => topHitsFixture);
    const mockedTopResultsGet = jest.fn().mockImplementation(() => {
      return {
        getItems: mockedGetItems,
      };
    });
    const mockedSearchIndex = {
      related: {
        'top-hits': {
          get: mockedTopResultsGet,
        },
      },
    };
    const params = {
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getTopHitsForCsv(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(result).toMatchSnapshot();
  });
});
