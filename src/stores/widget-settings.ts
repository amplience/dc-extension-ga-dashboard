import { DEFAULT_SIZE } from '../components/widgets/widgets-config';
import { persistedWritable } from './persisted-writable';

export const topContentReportShowCount = persistedWritable<string>(
  'topSearchesShowCount',
  DEFAULT_SIZE
);
