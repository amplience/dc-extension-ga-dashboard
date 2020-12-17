import { ContentItem, DynamicContent } from 'dc-management-sdk-js';
import ContentItemAppLinkResolver from './app-link-resolver/content-item-app-link-resolver';
import EditionAppLinkResolver from './app-link-resolver/edition-app-link-resolver';
import { ManagementSdkService } from './management-sdk.service';

jest.mock('dc-management-sdk-js');
jest.mock('./app-link-resolver/edition-app-link-resolver');
jest.mock('./app-link-resolver/content-item-app-link-resolver');

const { Hub } = jest.requireActual('dc-management-sdk-js');

describe('Management SdkService', () => {
  beforeEach(() => jest.clearAllMocks());
  const fakeClient = {
    request: jest.fn(),
  };
  it('should allow .client to be accessible', () => {
    expect(new ManagementSdkService(fakeClient).client).toBeInstanceOf(
      DynamicContent
    );
  });

  it('should wrap the http client with a HttpClientInFlightCache', async () => {
    new ManagementSdkService(fakeClient);
    expect(DynamicContent).toHaveBeenCalledWith(
      { client_id: '', client_secret: '' },
      {},
      fakeClient
    );
  });

  describe('getAppLinkForResource', () => {
    it('should initialise providers on creation', () => {
      const service = new ManagementSdkService(fakeClient);

      expect(ContentItemAppLinkResolver).toHaveBeenCalledWith(service.client);

      expect(EditionAppLinkResolver).toHaveBeenCalledWith(service.client);
    });

    it('should throw an error for an unsupported resource', async () => {
      const service = new ManagementSdkService(fakeClient);
      await expect(() =>
        service.getAppLinkForResource(new Hub(), Hub, 'HUB_ID')
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"Not a valid resource"`);
    });

    it('should throw an error of resolved hub does not match', async () => {
      const service = new ManagementSdkService(fakeClient);
      const mockedContentItemAppLinkResolver = ContentItemAppLinkResolver as jest.Mock;
      const mockContentItemAppLinkResolver =
        mockedContentItemAppLinkResolver.mock.instances[0];

      mockContentItemAppLinkResolver.supports.mockReturnValue(true);
      mockContentItemAppLinkResolver.resolveHub.mockResolvedValue(
        new Hub({ id: 'HUB_B' })
      );
      await expect(() =>
        service.getAppLinkForResource(
          new Hub({ id: 'HUB_A' }),
          ContentItem,
          'CONTENT_ITEM_ID'
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Resolved hub does not match"`
      );
    });

    it('should return the route from the app link resolver', async () => {
      const service = new ManagementSdkService(fakeClient);
      const mockedContentItemAppLinkResolver = ContentItemAppLinkResolver as jest.Mock;
      const mockContentItemAppLinkResolver =
        mockedContentItemAppLinkResolver.mock.instances[0];

      mockContentItemAppLinkResolver.supports.mockReturnValue(true);
      mockContentItemAppLinkResolver.resolveHub.mockResolvedValue(
        new Hub({ id: 'HUB_A' })
      );
      mockContentItemAppLinkResolver.buildRoute.mockResolvedValue(
        'http://example.com/#!/new/route'
      );

      expect(
        await service.getAppLinkForResource(
          new Hub({ id: 'HUB_A' }),
          ContentItem,
          'CONTENT_ITEM_ID'
        )
      ).toEqual(`http://example.com/#!/new/route`);
    });
  });
});
