import { init } from 'dc-extensions-sdk';
import type {
  DashboardExtension,
  InitOptions,
  Params,
} from 'dc-extensions-sdk';

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
