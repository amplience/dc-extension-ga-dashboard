import { writable } from './persisted-store';
import { formatDateAsISOString } from '../utils/date-format';

export const DAY = 24 * 60 * 60 * 1000;

export interface DateRange {
  from: string;
  to: string;
}

const NOW = new Date().setHours(0, 0, 0, 0).valueOf();

export const dateRange = writable<DateRange>('date-range', {
  from: formatDateAsISOString(new Date(NOW - DAY * 30)),
  to: formatDateAsISOString(new Date(NOW - DAY)),
});
