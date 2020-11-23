import type {
  DataReportResponse,
  DataReportRow,
  GoogleAnalyticsEmbedAPI,
} from '../../definitions/google-analytics-embed-api';
import type { DateRange } from '../../stores/date-range';
import { gapiRequestGuard } from './gapi-request-guard.service';

export interface ReportDataParams {
  gaViewId: string;
  dimension: string;
  limit: number;
  dateRange: DateRange;
  gaQueryFilter?: string;
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

const hydrateEventPercentages = (
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

export const getReportData = async (
  gapi: GoogleAnalyticsEmbedAPI,
  queryParams: ReportDataParams
): Promise<ReportData[]> => {
  const query = {
    ids: queryParams.gaViewId,
    metrics: 'ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue',
    dimensions: queryParams.dimension,
    sort: '-ga:totalEvents',
    'max-results': queryParams.limit,
    'start-date': queryParams.dateRange.from,
    'end-date': queryParams.dateRange.to,
    filters: queryParams.gaQueryFilter,
  };
  return gapiRequestGuard(gapi, () => {
    return new Promise((resolve, reject) => {
      new gapi.analytics.report.Data({ query })
        .once('success', (response: DataReportResponse) =>
          resolve(hydrateEventPercentages(response))
        )
        .once('error', reject)
        .execute();
    });
  });
};
