import type { Edition } from 'dc-management-sdk-js';
import { persistedWritable } from '../persisted-writable';

export const selectedEdition = persistedWritable<Edition>(
  'selectedEdition',
  null
);
