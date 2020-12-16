import type { Query } from '../../definitions/google-analytics-embed-api';
import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';
import { gapiRequestGuard } from './gapi-request-guard.service';

export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
}

export const insertDataChart = (
  gapi: GoogleAnalyticsEmbedAPI,
  containerId: string,
  type: ChartType,
  query: Query,
  options: Record<string, unknown>
): Promise<void> => {
  const containerElement = document.getElementById(containerId);
  containerElement.innerHTML = '';
  const chartElement = document.createElement('div');
  containerElement.appendChild(chartElement);

  const request = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const chart = new gapi.analytics.googleCharts.DataChart({
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
      chart.once('success', resolve).once('error', reject).execute();
    });
  };

  return gapiRequestGuard<void>(gapi, request).catch((e) => {
    chartElement.remove();
    throw e;
  });
};
