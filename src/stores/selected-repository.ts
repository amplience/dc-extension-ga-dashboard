import type { ContentRepository } from 'dc-management-sdk-js';
import { persistedWritable } from './persisted-writable';

export const selectedRepository = persistedWritable<ContentRepository>(
  'selectedRepository',
  null
);
