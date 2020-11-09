import { writable as persistedWritable } from './persisted-store';
import { DEFAULT_SIZE } from '../components/widgets/widgets-config';

export const topContentReportShowCount = persistedWritable<string>(
  'topSearchesShowCount',
  DEFAULT_SIZE
);
