import type { DynamicContent } from 'dc-management-sdk-js';
import type { Connection } from 'message-event-channel';

async function getContentItemURL(
  connection: Connection,
  contentItemId: string
) {
  try {
    return await connection.request('content-item-link', contentItemId);
  } catch {
    return;
  }
}

async function getContentItemLabel(
  client: DynamicContent,
  contentItemId: string
): Promise<string> {
  try {
    const contentItem = await client.contentItems.get(contentItemId);
    return contentItem.label;
  } catch {
    return contentItemId;
  }
}

export default async function resolveContentItemProperties(
  client: DynamicContent,
  connection: Connection,
  contentItemId: string
): Promise<string[]> {
  return Promise.all([
    getContentItemURL(connection, contentItemId),
    getContentItemLabel(client, contentItemId),
  ]);
}
