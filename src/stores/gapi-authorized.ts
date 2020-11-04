import { writable as persistedWritable } from './persisted-store';

export const gapiAuthorized = persistedWritable<boolean>(
  'gapiAuthorized',
  false
);
