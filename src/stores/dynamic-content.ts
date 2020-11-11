import type { DynamicContent, Hub } from 'dc-management-sdk-js';
import { writable } from 'svelte/store';

export const client = writable<DynamicContent>(null);

export const hub = writable<Hub>(null);
