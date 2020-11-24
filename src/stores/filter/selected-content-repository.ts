import type { ContentRepository } from 'dc-management-sdk-js';
import { persistedWritable } from '../persisted-writable';

export const selectedContentRepository = persistedWritable<ContentRepository>(
  'selectedContentRepository',
  null
);
