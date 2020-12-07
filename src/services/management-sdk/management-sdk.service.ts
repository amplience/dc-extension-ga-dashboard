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

export class ManagementSdkService {
  public readonly client: DynamicContent;
  private readonly appLinkResolvers: AppLinkResolver<HalResource>[];

  constructor(private readonly httpClient: HttpClient) {
    this.client = this.buildManagementClient();
    this.appLinkResolvers = [
      new ContentItemAppLinkResolver(this.client),
      new EditionAppLinkResolver(this.client),
    ];
  }

  private buildManagementClient(): DynamicContent {
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

    return await appLinkResolver.buildRoute(hub, id);
  }
}
