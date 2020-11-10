import { get, writable } from 'svelte/store';
import type {
  Data,
  GoogleAnalyticsEmbedAPI,
  Query,
} from '../definitions/google-analytics-embed-api';

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

export const getDataReport = (query: Query): Data => {
  return new (getGapi().analytics.report.Data)({ query });
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
