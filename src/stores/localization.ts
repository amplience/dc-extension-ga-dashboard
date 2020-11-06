import { writable } from './persisted-store';

export const locale = writable<string>('locale', 'en-GB');
export const currencyCode = writable<string>('currency-code', 'GBP');
