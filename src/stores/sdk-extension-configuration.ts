import type { DashboardExtension } from 'dc-extensions-sdk';
import { writable } from 'svelte/store';
import type { GADashboardParams } from '../services/extension-sdk/extension-sdk.service';

export const sdkExtensionConfiguration = writable<
  DashboardExtension<GADashboardParams>
>(null);
