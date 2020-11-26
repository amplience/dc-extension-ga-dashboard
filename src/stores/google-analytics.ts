import { derived, writable } from 'svelte/store';
import type { BreakdownConfiguration } from '../services/extension-sdk/extension-sdk.service';

export const gaViewId = writable<string>(null);
export const gaClientId = writable<string>(null);
export const gaClientEmail = writable<string>(null);
export const gaApiKey = writable<string>(null);
export const gaAuthByToken = derived(
  [gaClientEmail, gaApiKey],
  ([$gaClientEmail, $gaApiKey]) => {
    return $gaClientEmail || $gaApiKey;
  }
);

export const contentItemIdMapping = writable<string>(null);
export const editionIdMapping = writable<string>(null);
export const slotIdMapping = writable<string>(null);

export const breakdown = writable<BreakdownConfiguration>(null);
export const breakdownTitle = writable<BreakdownConfiguration>(null);
