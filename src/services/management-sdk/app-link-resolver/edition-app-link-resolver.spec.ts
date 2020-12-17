import type { DashboardExtension } from 'dc-extensions-sdk';
import { DynamicContent, Edition, Hub } from 'dc-management-sdk-js';
import { sdkExtensionConfiguration } from '../../../stores/sdk-extension-configuration';
import type { GADashboardParams } from '../../extension-sdk/extension-sdk.service';
import EditionAppLinkResolver from './edition-app-link-resolver';

describe('EditionAppLinkResolver', () => {
  it('should support Edition', () => {
    const resolver = new EditionAppLinkResolver(
      new DynamicContent({ client_id: '', client_secret: '' })
    );
    expect(resolver.supports(Edition)).toEqual(true);
  });

  it('should resolve hub', async () => {
    const mockGetHub = jest.fn(() => new Hub());
    const mockGetEvent = jest.fn(() => {
      return {
        related: {
          hub: mockGetHub,
        },
      };
    });
    const mockGetEdition = jest.fn(() => {
      return {
        related: {
          event: mockGetEvent,
        },
      };
    });
    const resolver = new EditionAppLinkResolver(({
      editions: {
        get: mockGetEdition,
      },
    } as unknown) as DynamicContent);
    const resolvedHub = await resolver.resolveHub('ID');
    expect(resolvedHub).toBeInstanceOf(Hub);

    expect(mockGetHub).toHaveBeenCalled();
    expect(mockGetEvent).toHaveBeenCalled();
    expect(mockGetEdition).toHaveBeenCalledWith('ID');
  });

  it('should build a route', async () => {
    const edition = new Edition({ id: 'ID', eventId: 'EVENT_ID' });
    const mockGetEdition = jest.fn(() => edition);
    const resolver = new EditionAppLinkResolver(({
      editions: {
        get: mockGetEdition,
      },
    } as unknown) as DynamicContent);

    const mockDashboard = {
      applicationNavigator: {
        openEdition: jest
          .fn()
          .mockReturnValue(
            'http://example.com/#!/HUB_NAME/planning/edition/EVENT_ID/ID/'
          ),
      },
    };

    sdkExtensionConfiguration.set(
      (mockDashboard as unknown) as DashboardExtension<GADashboardParams>
    );
    await expect(
      resolver.buildRoute(new Hub({ name: 'HUB_NAME' }), 'ID')
    ).resolves.toEqual(
      'http://example.com/#!/HUB_NAME/planning/edition/EVENT_ID/ID/'
    );

    expect(
      mockDashboard.applicationNavigator.openEdition
    ).toHaveBeenCalledWith(edition, { returnHref: true });
  });
});
