import { formatDateAsISOString } from '../utils/date-format';
import { persistedWritable } from './persisted-writable';

export interface DateRange {
  from: string;
  to: string;
}

export const DAY = 24 * 60 * 60 * 1000;
export const NOW = new Date().setHours(0, 0, 0, 0).valueOf();

export const INITIAL_DATE_RANGE = {
  from: formatDateAsISOString(new Date(NOW - DAY * 7)),
  to: formatDateAsISOString(new Date(NOW - DAY)),
};

export const dateRange = persistedWritable<DateRange>(
  'date-range',
  INITIAL_DATE_RANGE
);
