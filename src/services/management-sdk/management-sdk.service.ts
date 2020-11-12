import {
  AxiosHttpClient,
  DynamicContent,
  HalResource,
  HalResourceConstructor,
  Hub,
  HttpClient,
} from 'dc-management-sdk-js';
import { get } from 'svelte/store';
import { sdkExtensionConfiguration } from '../../stores/sdk-extension-configuration';
import type AppLinkResolver from './app-link-resolver/app-link-resolver.interface';
import ContentItemAppLinkResolver from './app-link-resolver/content-item-app-link-resolver';
import EditionAppLinkResolver from './app-link-resolver/edition-app-link-resolver';

const getStandaloneEnvVar = () => '__STANDALONE__';
const isInStandaloneMode = (): boolean => getStandaloneEnvVar() === '1';

export class ManagementSdkService {
  public readonly client: DynamicContent;
  private readonly appLinkResolvers: AppLinkResolver<HalResource>[];

  constructor(private readonly httpClient: HttpClient) {
    if (isInStandaloneMode()) {
      httpClient = new AxiosHttpClient({});
    }
    this.client = this.buildManagementClient();
    this.appLinkResolvers = [
      new ContentItemAppLinkResolver(this.client),
      new EditionAppLinkResolver(this.client),
    ];
  }

  private buildManagementClient(): DynamicContent {
    if (isInStandaloneMode()) {
      return new DynamicContent(
        {
          client_id: '__CLIENT_ID__',
          client_secret: '__CLIENT_SECRET__',
        },
        {
          apiUrl: '__API_URL__',
          authUrl: '__AUTH_URL__',
        },
        new AxiosHttpClient({})
      );
    }

    return new DynamicContent(
      {
        client_id: '',
        client_secret: '',
      },
      {},
      this.httpClient
    );
  }

  public async getAppLinkForResource<T extends HalResource>(
    hub: Hub,
    type: HalResourceConstructor<T>,
    id: string
  ): Promise<string> {
    const appLinkResolver = this.appLinkResolvers.find((appLinkResolver) =>
      appLinkResolver.supports(type)
    );
    if (!appLinkResolver) {
      throw new Error('Not a valid resource');
    }
    const resolvedHub = await appLinkResolver.resolveHub(id);
    if (hub.id != resolvedHub.id) {
      throw new Error('Resolved hub does not match');
    }
    const baseUrl = get(sdkExtensionConfiguration)?.params?.locationHref?.split(
      '#!'
    )[0];

    if (!baseUrl) {
      throw new Error('locationHref is not present');
    }

    return baseUrl + '#!' + (await appLinkResolver.buildRoute(hub, id));
  }
}
