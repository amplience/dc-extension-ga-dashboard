import { writable as persistedWritable } from './persisted-store';
import type { Edition } from 'dc-management-sdk-js';

export const selectedEdition = persistedWritable<Edition>(
  'selectedEdition',
  null
);
