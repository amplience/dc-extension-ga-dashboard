import type { ExtensionConfiguration } from '../services/extension-sdk/extension-sdk.service';
import { writable as persistedWritable } from './persisted-store';

export const gaViewId = persistedWritable<string>('ga-view-id', null);
export const gaClientId = persistedWritable<string>('ga-client-id', null);
export const contentItemIdMapping = persistedWritable<string>(
  'ga-content-item-id',
  null
);
export const editionIdMapping = persistedWritable<string>(
  'ga-edition-id',
  null
);
export const slotIdMapping = persistedWritable<string>('ga-slot-id', null);

export function setGaConfig(config: ExtensionConfiguration): void {
  gaViewId.set(config?.googleAnalyticsViewId || '');
  gaClientId.set(config?.googleAnalyticsClientId || '');
  contentItemIdMapping.set(config?.mappings?.contentItemId);
  editionIdMapping.set(config?.mappings?.editionId);
  slotIdMapping.set(config?.mappings?.slotId);
}
