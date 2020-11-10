import { writable as persistedWritable } from './persisted-store';
import { DEFAULT_SIZE, SIZES } from '../components/widgets/widgets-config';

export const topContentReportShowCount = persistedWritable<number>(
  'topSearchesShowCount',
  SIZES.get(DEFAULT_SIZE)
);

export const topEditionReportShowCount = persistedWritable<number>(
  'topSearchesShowCount',
  SIZES.get(DEFAULT_SIZE)
);
