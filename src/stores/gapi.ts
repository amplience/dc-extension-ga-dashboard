import { get, writable } from 'svelte/store';
import type {
  Data,
  GoogleAnalyticsEmbedAPI,
  Query,
} from '../definitions/google-analytics-embed-api';
import type { DateRange } from './date-range';

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
  dateRange: DateRange
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
    },
  });
};

export const processReportData = (response: any): any[] => {
  const {
    rows = [],
    totalsForAllResults: {
      'ga:totalEvents': allTotalEvents,
      'ga:uniqueEvents': allUniqueEvents,
    },
  } = response;

  return rows.map((row) => {
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
  });
};

export const getDataChart = (query: Query): Data => {
  return new (getGapi().analytics.googleCharts.DataChart)({
    query,
    chart: {
      type: 'LINE',
      container: 'ga-line-chart',
      options: {
        fontSize: 12,
        width: '100%',
        animation: {
          startup: true,
        },
        hAxis: {
          gridlines: {
            units: {
              days: { format: ['dd MMM'] },
            },
          },
          minorGridlines: {
            units: {
              hours: { format: [''] },
              minutes: { format: [''] },
            },
          },
        },
      },
    },
  });
};

export default gapi;
