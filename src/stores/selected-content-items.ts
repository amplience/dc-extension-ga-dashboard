import type { ContentItem } from 'dc-management-sdk-js';
import { get } from 'svelte/store';
import { persistedWritable } from './persisted-writable';

export const selectedContentItems = persistedWritable<ContentItem[]>(
  'selectedContentItems',
  []
);

export const removeSelectedContentItem = (contentItem: ContentItem): void => {
  selectedContentItems.set(
    get(selectedContentItems).filter(
      (selectedContentItem: ContentItem) =>
        selectedContentItem.id !== contentItem.id
    )
  );
};
