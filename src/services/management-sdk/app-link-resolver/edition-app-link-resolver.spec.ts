import { DynamicContent, Edition, Hub } from 'dc-management-sdk-js';
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
    const mockGetEdition = jest.fn(
      () => new Edition({ id: 'ID', eventId: 'EVENT_ID' })
    );
    const resolver = new EditionAppLinkResolver(({
      editions: {
        get: mockGetEdition,
      },
    } as unknown) as DynamicContent);

    await expect(
      resolver.buildRoute(new Hub({ name: 'HUB_NAME' }), 'ID')
    ).resolves.toEqual('/HUB_NAME/planning/edition/EVENT_ID/ID/');
  });
});
