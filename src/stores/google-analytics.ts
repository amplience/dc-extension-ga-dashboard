import { writable } from 'svelte/store';
import type {
  BreakdownChartConfiguration,
  ExtensionConfiguration,
} from '../services/extension-sdk/extension-sdk.service';

export const gaViewId = writable<string>(null);
export const gaClientId = writable<string>(null);
export const contentItemIdMapping = writable<string>(null);
export const editionIdMapping = writable<string>(null);
export const slotIdMapping = writable<string>(null);

export const breakdownChart = writable<BreakdownChartConfiguration>(null);
export const breakdownChartTitle = writable<BreakdownChartConfiguration>(null);

export function setGaConfig(config: ExtensionConfiguration): void {
  gaViewId.set(config?.googleAnalyticsViewId || '');
  gaClientId.set(config?.googleAnalyticsClientId || '');

  contentItemIdMapping.set(config?.mappings?.contentItemId);
  editionIdMapping.set(config?.mappings?.editionId);
  slotIdMapping.set(config?.mappings?.slotId);
  breakdownChart.set(
    config?.breakdownChart || {
      dimension: 'deviceCategory',
      title: 'Device Breakdown',
    }
  );
}
