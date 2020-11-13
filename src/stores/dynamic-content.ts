import type { Hub } from 'dc-management-sdk-js';
import { writable } from 'svelte/store';
import type { ManagementSdkService } from '../services/management-sdk/management-sdk.service';

export const managementSdkService = writable<ManagementSdkService>(null);

export const hub = writable<Hub>(null);
