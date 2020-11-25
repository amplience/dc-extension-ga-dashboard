import type { ContentRepository } from 'dc-management-sdk-js';
import { persistedWritable } from '../persisted-writable';

export const selectedSlotsRepository = persistedWritable<ContentRepository>(
  'selectedSlotsRepository',
  null
);
