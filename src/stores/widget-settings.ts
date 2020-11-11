import { DEFAULT_SIZE, SIZES } from '../components/widgets/widgets-config';
import { persistedWritable } from './persisted-writable';

export const topContentReportShowCount = persistedWritable<number>(
  'topContentReportShowCount',
  SIZES.get(DEFAULT_SIZE)
);

export const topEditionReportShowCount = persistedWritable<number>(
  'topEditionReportShowCount',
  SIZES.get(DEFAULT_SIZE)
);
