import { writable as persistedWritable } from './persisted-store';
import { DEFAULT_SIZE } from '../components/widgets/widgets-config';

export const topSearchesShowCount = persistedWritable<string>(
  'topSearchesShowCount',
  DEFAULT_SIZE
);

export const topSearchesExpandedRows = persistedWritable<string[]>(
  'topSearchesExpandedRows',
  []
);

export const topResultsShowCount = persistedWritable<string>(
  'topResultsShowCount',
  DEFAULT_SIZE
);

export const noResultsShowCount = persistedWritable<string>(
  'noResultsShowCount',
  DEFAULT_SIZE
);

export const noResultsExpandedRows = persistedWritable<string[]>(
  'noResultsExpandedRows',
  []
);
