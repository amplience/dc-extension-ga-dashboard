import getNoResultsRate from './get-no-results-rate.service';
import type { SearchIndex } from 'dc-management-sdk-js';

describe('getNoResultsRate', () => {
  it('should get no results rate for a given search index and params', async () => {
    const mockedGet = jest.fn().mockImplementation(() => ({
      rate: 0.42857142857142855,
      count: 14,
      noResultCount: 6,
      dates: [{ date: '2017-01-01', rate: 0.5, count: 10, noResultCount: 5 }],
    }));
    const mockedSearchIndex = {
      related: {
        'no-results-rate': {
          get: mockedGet,
        },
      },
    };
    const params = {
      clickAnalytics: true,
      includeReplicas: true,
      startDate: '2020-01-01',
      endDate: '2020-01-01',
    };

    const result = await getNoResultsRate(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(mockedGet).toHaveBeenCalled();
    expect(result).toMatchInlineSnapshot(`
      Object {
        "count": 14,
        "dates": Array [
          Object {
            "count": 10,
            "date": "2017-01-01",
            "noResultCount": 5,
            "rate": 0.5,
          },
        ],
        "noResultCount": 6,
        "rate": 0.42857142857142855,
      }
    `);
  });
});
