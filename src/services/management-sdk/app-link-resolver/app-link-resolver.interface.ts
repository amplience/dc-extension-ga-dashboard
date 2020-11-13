import type {
  HalResource,
  HalResourceConstructor,
  Hub,
} from 'dc-management-sdk-js';

export default interface AppLinkResolver<T extends HalResource> {
  supports(type: HalResourceConstructor<T>): boolean;
  resolveHub(id: string): Promise<Hub>;
  buildRoute(hub: Hub, id: string): Promise<string>;
}
