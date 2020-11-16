import { buildDataReportQuery } from './gapi';

describe('gapi', () => {
  describe('buildDataReportQuery', () => {
    it('should return a valid query with filter', () => {
      expect(
        buildDataReportQuery(
          'ga:123',
          'ga:dimension1',
          20,
          { from: '2020-01-01', to: '2020-12-31' },
          'ga:dimension1=123',
          123456
        )
      ).toMatchInlineSnapshot(`
        Object {
          "dimensions": "ga:ga:dimension1",
          "end-date": "2020-12-31",
          "filters": "ga:dimension1=123",
          "ids": "ga:ga:123",
          "max-results": 20,
          "metrics": "ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue",
          "sort": "-ga:totalEvents",
          "start-date": "2020-01-01",
          "z": 123456,
        }
      `);
    });

    it('should return a valid query without filter or cacheBust', () => {
      expect(
        buildDataReportQuery(
          'ga:123',
          'ga:dimension1',
          20,
          { from: '2020-01-01', to: '2020-12-31' },
          undefined,
          undefined
        )
      ).toMatchInlineSnapshot(`
        Object {
          "dimensions": "ga:ga:dimension1",
          "end-date": "2020-12-31",
          "filters": undefined,
          "ids": "ga:ga:123",
          "max-results": 20,
          "metrics": "ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue",
          "sort": "-ga:totalEvents",
          "start-date": "2020-01-01",
          "z": undefined,
        }
      `);
    });
  });
});
