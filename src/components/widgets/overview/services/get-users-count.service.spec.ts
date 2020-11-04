import getUsersCount from './get-users-count.service';
import type { SearchIndex } from 'dc-management-sdk-js';

describe('getUsersCount', () => {
  it('should get users count for a given search index and params', async () => {
    const mockedGet = jest.fn().mockImplementation(() => ({
      count: 1,
      dates: [
        {
          count: 1,
          date: '2020-08-01',
        },
      ],
    }));
    const mockedSearchIndex = {
      related: {
        'users-count': {
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

    const result = await getUsersCount(
      (mockedSearchIndex as unknown) as SearchIndex,
      params
    );

    expect(mockedGet).toHaveBeenCalled();
    expect(result).toMatchInlineSnapshot(`
      Object {
        "count": 1,
        "dates": Array [
          Object {
            "count": 1,
            "date": "2020-08-01",
          },
        ],
      }
    `);
  });
});
