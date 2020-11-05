import { init, Options, Params, SDK } from 'dc-extensions-sdk';

type SdkExtensionConfiguration = SDK<ExtensionConfiguration, Params>;
export interface ExtensionConfiguration {
  googleAnalyticsClientId: string;
  googleAnalyticsViewId: string;
  mappings: {
    contentItemId: string;
    editionId: string;
    slotId: string;
  };
}

function isStandalone(): string {
  return '__STANDALONE__';
}

async function standaloneClient(): Promise<SdkExtensionConfiguration> {
  return ({
    params: {
      installation: {
        googleAnalyticsClientId: '__GOOGLE_ANALYTICS_CLIENT_ID__',
        googleAnalyticsViewId: '__GOOGLE_ANALYTICS_VIEW_ID__',
        mappings: {
          contentItemId: 'dimension1',
          editionId: 'dimension2',
          slotId: 'dimension3',
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

  return await init<ExtensionConfiguration, Params>(options);
}
