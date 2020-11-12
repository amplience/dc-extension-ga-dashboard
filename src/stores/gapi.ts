import { get, writable } from 'svelte/store';
import type {
  Data,
  DataReportResponse,
  DataReportRow,
  GoogleAnalyticsEmbedAPI,
  Query,
} from '../definitions/google-analytics-embed-api';
import type { DateRange } from './date-range';

export type ReportData = [
  string,
  number,
  number,
  number,
  number,
  number,
  number
];

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

export const getDataReport = (
  gaViewId: string,
  dimension: string,
  limit: number,
  dateRange: DateRange,
  gaQueryFilter?: string
): Data => {
  return new (getGapi().analytics.report.Data)({
    query: {
      ids: `ga:${gaViewId}`,
      metrics: 'ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue',
      dimensions: `ga:${dimension}`,
      sort: '-ga:totalEvents',
      'max-results': limit,
      'start-date': dateRange.from,
      'end-date': dateRange.to,
      filter: gaQueryFilter,
    },
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
export const getDataChart = (
  query: Query,
  containerId: string,
  type: ChartType,
  options: Record<string, unknown>
): Data => {
  return new (getGapi().analytics.googleCharts.DataChart)({
    query,
    chart: {
      type: type,
      container: containerId,
      options: {
        fontSize: 12,
        width: '100%',
        animation: {
          startup: true,
        },
        ...options,
      },
    },
  });
};

export default gapi;
