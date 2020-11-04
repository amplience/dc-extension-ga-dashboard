import { writable as persistedWritable } from './persisted-store';

export const gaId = persistedWritable<string>('ga-id', null);
