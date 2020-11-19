import type { ReportData } from '../../../../stores/gapi';

export type GetBreakdownData = (id: string) => Promise<ReportData[]>;
