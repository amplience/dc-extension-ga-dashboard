import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';
import { gapiRequestGuard } from './gapi-request-guard.service';
import { ChartType, insertDataChart } from './insert-data-chart.service';

jest.mock('./gapi-request-guard.service');

describe('insertDataChart', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a temporary chart element and insert a chart when gapi request guard resolves', async () => {
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(({ appendChild: jest.fn() } as unknown) as HTMLElement);
    jest.spyOn(document, 'createElement');

    (gapiRequestGuard as jest.Mock).mockImplementation((gapi, fn) => fn());
    const onceSuccessMock = jest.fn();
    const onceFailureMock = jest.fn();
    const executeMock = jest.fn();

    const gapi = ({
      analytics: {
        googleCharts: {
          DataChart: jest.fn().mockImplementation(() => ({
            once: onceSuccessMock.mockImplementation((status, resolve) => ({
              once: onceFailureMock.mockImplementation(() => ({
                execute: executeMock.mockImplementation(() => {
                  resolve();
                }),
              })),
            })),
          })),
        },
      },
    } as unknown) as GoogleAnalyticsEmbedAPI;
    await insertDataChart(
      gapi,
      'test-container-id',
      ChartType.LINE,
      {
        ids: 'ga:test-id',
        metrics: 'ga:test-metric',
        dimensions: 'ga:test-dimension',
        'start-date': '2020-01-02',
        'end-date': '2020-01-02',
        filters: undefined,
      },
      {}
    );

    expect(document.getElementById).toHaveBeenCalledWith('test-container-id');
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(
      (gapi.analytics.googleCharts.DataChart as jest.Mock).mock.calls
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
  });

  it('should reject when gapi request fails', async () => {
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(({ appendChild: jest.fn() } as unknown) as HTMLElement);
    jest.spyOn(document, 'createElement');
    const removeMock = jest.fn();
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(({ appendChild: jest.fn() } as unknown) as HTMLElement);
    jest
      .spyOn(document, 'createElement')
      .mockReturnValue(({ remove: removeMock } as unknown) as HTMLElement);
    (gapiRequestGuard as jest.Mock).mockImplementation((gapi, fn) => fn());
    const onceSuccessMock = jest.fn();
    const onceFailureMock = jest.fn();
    const executeMock = jest.fn();

    const gapi = ({
      analytics: {
        googleCharts: {
          DataChart: jest.fn().mockImplementation(() => ({
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
    const promise = insertDataChart(
      gapi,
      'test-container-id',
      ChartType.LINE,
      {
        ids: 'ga:test-id',
        metrics: 'ga:test-metric',
        dimensions: 'ga:test-dimension',
        'start-date': '2020-01-02',
        'end-date': '2020-01-02',
        filters: undefined,
      },
      {}
    );
    await expect(() => promise).rejects.toMatchInlineSnapshot(
      `[Error: Gapi request error]`
    );
    expect(removeMock).toHaveBeenCalledTimes(1);
  });

  it('should remove temporary chart elements and reject if auth guard fails', async () => {
    const gapi = ({
      analytics: {
        googleCharts: {
          DataChart: jest.fn(),
        },
      },
    } as unknown) as GoogleAnalyticsEmbedAPI;
    const removeMock = jest.fn();
    jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(({ appendChild: jest.fn() } as unknown) as HTMLElement);
    jest
      .spyOn(document, 'createElement')
      .mockReturnValue(({ remove: removeMock } as unknown) as HTMLElement);

    (gapiRequestGuard as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('Gapi auth guard error'))
    );

    const promise = insertDataChart(
      gapi,
      'test-container-id',
      ChartType.LINE,
      {
        ids: 'ga:test-id',
        metrics: 'ga:test-metric',
        dimensions: 'ga:test-dimension',
        'start-date': '2020-01-02',
        'end-date': '2020-01-02',
        filters: undefined,
      },
      {}
    );

    await expect(() => promise).rejects.toMatchInlineSnapshot(
      `[Error: Gapi auth guard error]`
    );
    expect(removeMock).toHaveBeenCalledTimes(1);
  });
});
