import { writable } from 'svelte/store';
import type { SdkExtensionConfiguration } from '../services/extension-sdk/extension-sdk.service';

export const sdkExtensionConfiguration = writable<SdkExtensionConfiguration>(
  null
);
