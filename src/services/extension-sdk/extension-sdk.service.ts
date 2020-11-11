import { init, Options, Params, SDK } from 'dc-extensions-sdk';

export type SdkExtensionConfiguration = SDK<
  ExtensionConfiguration,
  Params & { hubId: string; locationHref: string }
>;
export interface ExtensionConfiguration {
  googleAnalyticsClientId: string;
  googleAnalyticsViewId: string;
  mappings: {
    contentItemId: string;
    editionId: string;
    slotId: string;
  };
  localization?: {
    locale: string;
    currencyCode: string;
  };
}

function isStandalone(): string {
  return '__STANDALONE__';
}

async function standaloneClient(): Promise<SdkExtensionConfiguration> {
  return ({
    params: {
      hubId: '__HUB_ID__',
      locationHref: '__LOCATION_HREF__',
      installation: {
        googleAnalyticsClientId: '__GOOGLE_ANALYTICS_CLIENT_ID__',
        googleAnalyticsViewId: '__GOOGLE_ANALYTICS_VIEW_ID__',
        mappings: {
          contentItemId: 'dimension1',
          editionId: 'dimension2',
          slotId: 'dimension3',
        },
        localization: {
          locale: '__GOOGLE_ANALYTICS_LOCALE__',
          currencyCode: '__GOOGLE_ANALYTICS_CURRENCY_CODE__',
        },
      },
    },
  } as unknown) as SdkExtensionConfiguration;
}

export default async function getExtensionClient(
  options?: Options
): Promise<SdkExtensionConfiguration> {
  if (isStandalone() === '1') {
    return standaloneClient();
  }

  return await init<
    ExtensionConfiguration,
    Params & { hubId: string; locationHref: string }
  >(options);
}
