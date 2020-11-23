import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';
import { gapiRequestGuard } from './gapi-request-guard.service';
import { getReportData } from './get-report-data.service';
import { ChartType, insertDataChart } from './insert-data-chart.service';

jest.mock('./gapi-request-guard.service');

describe('getReportData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return report data when gapi request guard resolves', async () => {
    (gapiRequestGuard as jest.Mock).mockImplementation((gapi, fn) => fn());
    const onceSuccessMock = jest.fn();
    const onceFailureMock = jest.fn();
    const executeMock = jest.fn();

    const gapi = ({
      analytics: {
        report: {
          Data: jest.fn().mockImplementation(() => ({
            once: onceSuccessMock.mockImplementation((status, resolve) => ({
              once: onceFailureMock.mockImplementation(() => ({
                execute: executeMock.mockImplementation(() => {
                  resolve({
                    rows: [['test-dimension', 1, 2, 3, 4]],
                    totalsForAllResults: {
                      'ga:totalEvents': 3,
                      'ga:uniqueEvents': 2,
                    },
                  });
                }),
              })),
            })),
          })),
        },
      },
    } as unknown) as GoogleAnalyticsEmbedAPI;
    const query = {
      gaViewId: 'ga:test-id',
      dimension: 'ga:test-dimension',
      limit: 100,
      dateRange: { to: '2020-01-01', from: '2020-01-01' },
      gaQueryFilter: undefined,
    };

    const result = await getReportData(gapi, query);

    expect(
      (gapi.analytics.report.Data as jest.Mock).mock.calls
    ).toMatchSnapshot();
    expect(onceSuccessMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "success",
          [Function],
        ],
      ]
    `);
    expect(onceFailureMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "error",
          [Function],
        ],
      ]
    `);
    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchInlineSnapshot(`
      Array [
        Array [
          "test-dimension",
          1,
          33,
          2,
          100,
          3,
          4,
        ],
      ]
    `);
  });

  it('should throw an error if gapi request rejects', async () => {
    (gapiRequestGuard as jest.Mock).mockImplementation((gapi, fn) => fn());
    const onceSuccessMock = jest.fn();
    const onceFailureMock = jest.fn();
    const executeMock = jest.fn();

    const gapi = ({
      analytics: {
        report: {
          Data: jest.fn().mockImplementation(() => ({
            once: onceSuccessMock.mockImplementation(() => ({
              once: onceFailureMock.mockImplementation((status, reject) => ({
                execute: executeMock.mockImplementation(() => {
                  reject(new Error('Gapi request error'));
                }),
              })),
            })),
          })),
        },
      },
    } as unknown) as GoogleAnalyticsEmbedAPI;
    const query = {
      gaViewId: 'ga:test-id',
      dimension: 'ga:test-dimension',
      limit: 100,
      dateRange: { to: '2020-01-01', from: '2020-01-01' },
      gaQueryFilter: undefined,
    };

    const promise = getReportData(gapi, query);

    await expect(() => promise).rejects.toMatchInlineSnapshot(
      `[Error: Gapi request error]`
    );
  });

  it('should throw an error if request guard rejects', async () => {
    const gapi = ({
      analytics: {
        report: {
          Data: jest.fn(),
        },
      },
    } as unknown) as GoogleAnalyticsEmbedAPI;

    (gapiRequestGuard as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('Gapi auth guard error'))
    );

    const query = {
      gaViewId: 'ga:test-id',
      dimension: 'ga:test-dimension',
      limit: 100,
      dateRange: { to: '2020-01-01', from: '2020-01-01' },
      gaQueryFilter: undefined,
    };

    const promise = getReportData(gapi, query);

    await expect(() => promise).rejects.toMatchInlineSnapshot(
      `[Error: Gapi auth guard error]`
    );
  });
});
