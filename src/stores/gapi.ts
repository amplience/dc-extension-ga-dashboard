import { get, writable } from 'svelte/store';
import type {
  DataReportResponse,
  DataReportRow,
  GoogleAnalyticsEmbedAPI,
  Query,
} from '../definitions/google-analytics-embed-api';
import type { DateRange } from './date-range';

export class RequestTimeout extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type ReportData = [
  string,
  number,
  number,
  number,
  number,
  number,
  number
];

const TIMEOUT_MS = Number('__GOOGLE_ANALYTICS_TIMEOUT__') || 2000;

const gapi = writable<GoogleAnalyticsEmbedAPI>(null);

export const initGapi = (): Promise<void> => {
  return new Promise((resolve) => {
    const gaEmbedApi: GoogleAnalyticsEmbedAPI = window['gapi'] || undefined;
    gaEmbedApi.analytics.ready(function () {
      gapi.set(gaEmbedApi);
      resolve();
    });
  });
};

const getGapi = (): GoogleAnalyticsEmbedAPI => {
  return get(gapi) as GoogleAnalyticsEmbedAPI;
};

export const buildDataReportQuery = (
  gaViewId: string,
  dimension: string,
  limit: number,
  dateRange: DateRange,
  gaQueryFilter: string = undefined,
  cacheBust: number = undefined
): Query => {
  return {
    ids: gaViewId,
    metrics: 'ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue',
    dimensions: dimension,
    sort: '-ga:totalEvents',
    'max-results': limit,
    'start-date': dateRange.from,
    'end-date': dateRange.to,
    filters: gaQueryFilter,
    z: cacheBust,
  };
};

export const getDataReport = (
  gaViewId: string,
  dimension: string,
  limit: number,
  dateRange: DateRange,
  gaQueryFilter?: string
): Promise<DataReportResponse> => {
  const query = buildDataReportQuery(
    gaViewId,
    dimension,
    limit,
    dateRange,
    gaQueryFilter,
    new Date().valueOf()
  );
  return new Promise(function (resolve, reject) {
    const requestTimeout = setTimeout(
      () =>
        reject(
          new RequestTimeout(
            `GAPI failed to respond within ${TIMEOUT_MS}ms second`
          )
        ),
      TIMEOUT_MS
    );
    new (getGapi().analytics.report.Data)({ query })
      .once('success', function (response) {
        clearTimeout(requestTimeout);
        resolve(response);
      })
      .once('error', function (response) {
        clearTimeout(requestTimeout);
        reject(response);
      })
      .execute();
  });
};

export const processReportData = (
  response: DataReportResponse
): ReportData[] => {
  const {
    rows = [],
    totalsForAllResults: {
      'ga:totalEvents': allTotalEvents,
      'ga:uniqueEvents': allUniqueEvents,
    },
  } = response;

  return rows.map(
    (row: DataReportRow): ReportData => {
      const [
        dimension,
        totalEvents,
        uniqueEvents,
        eventValue,
        avgEventValue,
      ] = row;

      return [
        dimension,
        totalEvents,
        Math.round((totalEvents / allTotalEvents) * 100) || 0,
        uniqueEvents,
        Math.round((uniqueEvents / allUniqueEvents) * 100) || 0,
        eventValue,
        avgEventValue,
      ];
    }
  );
};

export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
}
export const insertDataChart = (
  query: Query,
  containerId: string,
  type: ChartType,
  options: Record<string, unknown>
): Promise<void> => {
  return new Promise(function (resolve, reject) {
    let timedOut = false;
    const requestTimeout = setTimeout(() => {
      timedOut = true;
      reject(
        new RequestTimeout(
          `GAPI failed to respond within ${TIMEOUT_MS}ms second`
        )
      );
    }, TIMEOUT_MS);
    const chart = new (getGapi().analytics.googleCharts.DataChart)({
      query: {
        ...query,
        z: new Date().valueOf(), // cache-bust
      },
      chart: {
        type: type,
        container: containerId,
        options: {
          chartArea: {
            left: 50,
            right: 20,
          },
          fontSize: 12,
          fontName: 'Roboto',
          width: '100%',
          animation: {
            startup: true,
          },
          vAxis: {
            textPosition: 'out',
            textStyle: {
              color: '#999',
            },
          },
          hAxis: {
            textStyle: {
              color: '#999',
            },
          },
          ...options,
        },
      },
    });

    chart
      .once('success', (response) => {
        if (timedOut) {
          return;
        }
        clearTimeout(requestTimeout);
        resolve(response);
      })
      .once('error', (response) => {
        if (timedOut) {
          return;
        }
        clearTimeout(requestTimeout);
        reject(response);
      })
      .execute();
  });
};

export default gapi;
