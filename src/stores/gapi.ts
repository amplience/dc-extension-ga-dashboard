import type { HtmlTag } from 'svelte/internal';
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

const TIMEOUT_MS = Number('__GOOGLE_ANALYTICS_TIMEOUT__') || 30000;

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
    // 1. get the container
    const containerElement = document.getElementById(containerId);

    // 2. remove all child elements from the dom (calling .remove() for each element is async, innerHTML is synchronous)
    containerElement.innerHTML = '';

    // 3. create a new div element and add to the container
    const chartElement = document.createElement('div');

    // 4. give the child container to the gapi sdk to use
    containerElement.appendChild(chartElement);

    const requestTimeout = setTimeout(() => {
      timedOut = true;
      // 5b) gapi error - remove child element
      chartElement.remove();
      reject(
        new RequestTimeout(
          `GAPI failed to respond within ${TIMEOUT_MS}ms second`
        )
      );
    }, TIMEOUT_MS);
    const chart = new (getGapi().analytics.googleCharts.DataChart)({
      query: query,
      chart: {
        type: type,
        container: chartElement,
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
        // 5a) gapi success - renders the chart
        clearTimeout(requestTimeout);
        resolve(response);
      })
      .once('error', (response) => {
        if (timedOut) {
          return;
        }
        // 5b) gapi error - remove child element
        chartElement.remove();
        clearTimeout(requestTimeout);
        reject(response);
      })
      .execute();
  });
};

export default gapi;
