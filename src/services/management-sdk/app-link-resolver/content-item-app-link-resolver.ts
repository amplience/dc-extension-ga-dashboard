import type {
  DynamicContent,
  HalResourceConstructor,
  Hub,
} from 'dc-management-sdk-js';
import { ContentItem } from 'dc-management-sdk-js';
import { get } from 'svelte/store';
import { sdkExtensionConfiguration } from '../../../stores/sdk-extension-configuration';
import type AppLinkResolver from './app-link-resolver.interface';

export default class ContentItemAppLinkResolver
  implements AppLinkResolver<ContentItem> {
  constructor(private readonly client: DynamicContent) {}
  supports(type: HalResourceConstructor<ContentItem>): boolean {
    return type === ContentItem;
  }

  async resolveHub(id: string): Promise<Hub> {
    const contentItem = await this.client.contentItems.get(id);
    const contentRepository = await contentItem.related.contentRepository();
    return contentRepository.related.hub();
  }

  async buildRoute(hub: Hub, id: string): Promise<string> {
    return await get(
      sdkExtensionConfiguration
    ).applicationNavigator.openContentItem({ id }, { returnHref: true });
  }
}
