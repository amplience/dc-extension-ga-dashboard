import type { DashboardExtension } from 'dc-extensions-sdk';
import { ContentItem, DynamicContent, Hub } from 'dc-management-sdk-js';
import { sdkExtensionConfiguration } from '../../../stores/sdk-extension-configuration';
import type { GADashboardParams } from '../../extension-sdk/extension-sdk.service';
import ContentItemAppLinkResolver from './content-item-app-link-resolver';

describe('ContentItemAppLinkResolver', () => {
  it('should support ContentItem', () => {
    const resolver = new ContentItemAppLinkResolver(
      new DynamicContent({ client_id: '', client_secret: '' })
    );
    expect(resolver.supports(ContentItem)).toEqual(true);
  });

  it('should resolve hub', async () => {
    const mockGetHub = jest.fn(() => new Hub());
    const mockGetContentRepository = jest.fn(() => {
      return {
        related: {
          hub: mockGetHub,
        },
      };
    });
    const mockGetContentItem = jest.fn(() => {
      return {
        related: {
          contentRepository: mockGetContentRepository,
        },
      };
    });
    const resolver = new ContentItemAppLinkResolver(({
      contentItems: {
        get: mockGetContentItem,
      },
    } as unknown) as DynamicContent);
    const resolvedHub = await resolver.resolveHub('ID');
    expect(resolvedHub).toBeInstanceOf(Hub);

    expect(mockGetHub).toHaveBeenCalled();
    expect(mockGetContentRepository).toHaveBeenCalled();
    expect(mockGetContentItem).toHaveBeenCalledWith('ID');
  });

  it('should build a route', async () => {
    const resolver = new ContentItemAppLinkResolver(
      new DynamicContent({ client_id: '', client_secret: '' })
    );

    const mockDashboard = {
      applicationNavigator: {
        openContentItem: jest
          .fn()
          .mockReturnValue(
            'http://example.com/#!/HUB_NAME/authoring/content-item/edit/ID'
          ),
      },
    };

    sdkExtensionConfiguration.set(
      (mockDashboard as unknown) as DashboardExtension<GADashboardParams>
    );
    await expect(
      resolver.buildRoute(new Hub({ name: 'HUB_NAME' }), 'ID')
    ).resolves.toEqual(
      'http://example.com/#!/HUB_NAME/authoring/content-item/edit/ID'
    );

    expect(
      mockDashboard.applicationNavigator.openContentItem
    ).toHaveBeenCalledWith({ id: 'ID' }, { returnHref: true });
  });
});
