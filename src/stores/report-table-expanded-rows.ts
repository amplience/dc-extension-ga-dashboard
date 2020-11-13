import { persistedWritable } from './persisted-writable';

type ExpandedRowsById = Record<string, string[]>;

export const reportTableExpandedRows = persistedWritable<ExpandedRowsById>(
  'report-table-expanded-rows',
  {}
);
