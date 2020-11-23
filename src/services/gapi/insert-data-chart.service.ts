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
  // 1. get the container
  const containerElement = document.getElementById(containerId);
  // 2. remove all child elements from the dom (calling .remove() for each element is async, innerHTML is synchronous)
  containerElement.innerHTML = '';
  // 3. create a new div element and add to the container
  const chartElement = document.createElement('div');
  // 4. give the child container to the gapi sdk to use
  containerElement.appendChild(chartElement);

  return gapiRequestGuard<void>(gapi, () => {
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
  }).catch((e) => {
    // gapi error - remove child element
    chartElement.remove();
    throw e;
  });
};
