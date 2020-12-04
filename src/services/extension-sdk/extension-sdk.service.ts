import { DashboardExtension, init, InitOptions } from 'dc-extensions-sdk';
import type { Params } from 'dc-extensions-sdk/dist/types/lib/models/Params';

export interface GADashboardParams extends Params {
  installation: ExtensionInstallation;
}

export interface BreakdownConfiguration {
  title: string;
  dimension: string;
}
export interface ExtensionInstallation {
  googleAnalyticsClientId: string;
  googleAnalyticsClientEmail?: string;
  googleAnalyticsViewId: string;
  googleAnalyticsKey?: string;
  breakdown?: BreakdownConfiguration;
  mappings: {
    contentItemId: string;
    editionId: string;
    slotId: string;
  };
  localization?: {
    locale: string;
    currencyCode: string;
  };
  filters?: {
    contentItemFilter: string;
    editionFilter: string;
    slotFilter: string;
  };
}

export default async function getExtensionClient(
  options: Partial<InitOptions>
): Promise<DashboardExtension<GADashboardParams>> {
  return await init<DashboardExtension<GADashboardParams>>(options);
}
