import getContentItemProperties from './get-content-item-properties.service';
import { DynamicContent, ContentItem } from 'dc-management-sdk-js';
import type { Connection } from 'message-event-channel';

describe('getContentItemProperties service', () => {
  const mockGetContentItem = jest.fn().mockImplementation(() => {
    return new ContentItem({ label: 'CONTENT_ITEM_LABEL' });
  });
  const mockClient = {
    contentItems: {
      get: mockGetContentItem,
    },
  };
  const mockConnection = {
    request: jest.fn().mockResolvedValue('CONTENT_ITEM_URL'),
  };
  const contentItemId = 'abc';

  it('should get a content item label and url', async () => {
    await expect(
      getContentItemProperties(
        (mockClient as unknown) as DynamicContent,
        (mockConnection as unknown) as Connection,
        contentItemId
      )
    ).resolves.toMatchInlineSnapshot(`
            Array [
              "CONTENT_ITEM_URL",
              "CONTENT_ITEM_LABEL",
            ]
          `);

    expect(mockGetContentItem).toHaveBeenCalledWith(contentItemId);
    expect(mockConnection.request).toHaveBeenCalledWith(
      'content-item-link',
      contentItemId
    );
  });

  it('should return default values when errors are thrown', async () => {
    mockGetContentItem.mockRejectedValue(new Error());
    mockConnection.request.mockRejectedValue(new Error());
    await expect(
      getContentItemProperties(
        (mockClient as unknown) as DynamicContent,
        (mockConnection as unknown) as Connection,
        contentItemId
      )
    ).resolves.toMatchInlineSnapshot(`
            Array [
              undefined,
              "abc",
            ]
          `);

    expect(mockGetContentItem).toHaveBeenCalledWith(contentItemId);
    expect(mockConnection.request).toHaveBeenCalledWith(
      'content-item-link',
      contentItemId
    );
  });
});
