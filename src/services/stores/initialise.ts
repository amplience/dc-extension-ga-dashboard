import {
  contentItemFilter,
  editionFilter,
  slotFilter,
} from '../../stores/ga-query-filters';
import {
  breakdown,
  contentItemIdMapping,
  editionIdMapping,
  gaApiKey,
  gaClientEmail,
  gaClientId,
  gaViewId,
  slotIdMapping,
} from '../../stores/google-analytics';
import { currencyCode, locale } from '../../stores/localization';
import type { ExtensionInstallation } from '../extension-sdk/extension-sdk.service';

export function initialiseStores(config: ExtensionInstallation): void {
  gaViewId.set(config?.googleAnalyticsViewId || '');
  gaClientId.set(config?.googleAnalyticsClientId || '');
  gaClientEmail.set(config?.googleAnalyticsClientEmail);
  gaApiKey.set(config?.googleAnalyticsKey || '');

  contentItemIdMapping.set(config?.mappings?.contentItemId);
  editionIdMapping.set(config?.mappings?.editionId);
  slotIdMapping.set(config?.mappings?.slotId);

  contentItemFilter.set(config?.filters?.contentItemFilter);
  editionFilter.set(config?.filters?.editionFilter);
  slotFilter.set(config?.filters?.slotFilter);

  breakdown.set(
    config?.breakdown || {
      dimension: 'ga:deviceCategory',
      title: 'Device Breakdown',
    }
  );

  if (config?.localization?.locale) {
    locale.set(config?.localization?.locale);
  }

  if (config?.localization?.currencyCode) {
    currencyCode.set(config?.localization?.currencyCode);
  }
}
