import { writable as persistedWritable } from './persisted-store';
import type { SearchIndex } from 'dc-management-sdk-js';
import { writable } from 'svelte/store';

export const selectedIndexId = persistedWritable<string>(
  'selectedIndexId',
  null
);
export const index = writable<SearchIndex>(undefined);
export const includeReplicas = persistedWritable<boolean>(
  'includeReplicas',
  true
);
