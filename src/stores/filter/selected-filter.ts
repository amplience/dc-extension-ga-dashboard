import { persistedWritable } from '../persisted-writable';

export enum FILTERS {
  EDITION = 'EDITION',
  CONTENT = 'CONTENT',
  SLOT = 'SLOT',
}
export const selectedFilter = persistedWritable<FILTERS>(
  'selectedFilter',
  null
);
