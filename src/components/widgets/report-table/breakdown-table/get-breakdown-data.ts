import type { ReportData } from '../../../../services/gapi/get-report-data.service';

export type GetBreakdownData = (id: string) => Promise<ReportData[]>;
