import type {
  DynamicContent,
  HalResourceConstructor,
  Hub,
} from 'dc-management-sdk-js';
import { Edition } from 'dc-management-sdk-js';
import type AppLinkResolver from './app-link-resolver.interface';

export default class EditionAppLinkResolver
  implements AppLinkResolver<Edition> {
  constructor(private readonly client: DynamicContent) {}
  supports(type: HalResourceConstructor<Edition>): boolean {
    return type === Edition;
  }

  async resolveHub(id: string): Promise<Hub> {
    const edition = await this.client.editions.get(id);
    const event = await edition.related.event();
    return event.related.hub();
  }

  async buildRoute(hub: Hub, id: string): Promise<string> {
    const edition = await this.client.editions.get(id);
    return `/${hub.name}/planning/edition/${edition.eventId}/${edition.id}/`;
  }
}
