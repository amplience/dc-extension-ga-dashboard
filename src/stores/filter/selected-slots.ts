import type { ContentItem } from 'dc-management-sdk-js';
import { persistedWritable } from '../persisted-writable';

export const selectedSlots = persistedWritable<ContentItem[]>(
  'selectedSlots',
  []
);
