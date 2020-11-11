import { writable } from 'svelte/store';

export const locale = writable<string>('en-GB');
export const currencyCode = writable<string>('GBP');
