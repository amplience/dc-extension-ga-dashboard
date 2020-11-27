<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import List, { Graphic, Item, Label } from '@smui/list';
  import type { ContentItem } from 'dc-management-sdk-js';
  import type { ContentRepository } from 'dc-management-sdk-js/build/main/lib/model/ContentRepository';
  import ContentTypeLabel from '../content-type-label/content-type-label.svelte';
  import Loader from '../loader/loader.svelte';

  let loaded = false;
  let contentItems: ContentItem[] = [];
  let checkedValues: string[] = [];

  export let maxNumberOfSelectableItems = 5;
  export let selectedContentRepository: ContentRepository;
  export let selectedContentItems: ContentItem[] = [];

  $: handleCheckedValues(checkedValues);
  $: loadContentItems(selectedContentRepository);
  $: updatedSelectedContentItems(selectedContentItems);

  const updatedSelectedContentItems = (selectedContentItems: ContentItem[]) => {
    checkedValues = selectedContentItems.map((contentItem) => contentItem.id);
  };

  const handleCheckedValues = (values: string[]) => {
    if (loaded && Array.isArray(values)) {
      const currentlySelectedContentItem = contentItems.filter((contentItem) =>
        values.includes(contentItem.id)
      );

      const isEqual = (
        first: ContentItem[],
        second: ContentItem[]
      ): boolean => {
        const firstIds = first.map((contentItem) => contentItem.id);
        const secondIds = second.map((contentItem) => contentItem.id);
        return (
          firstIds.length === secondIds.length &&
          firstIds.every((id) => secondIds.includes(id))
        );
      };

      if (!isEqual(currentlySelectedContentItem, selectedContentItems)) {
        selectedContentItems = currentlySelectedContentItem;
      }
    }
    return values;
  };

  const loadContentItems = async (repository: ContentRepository) => {
    loaded = false;

    if (!repository || !repository.related) {
      return;
    }

    const response = (
      await repository.related.contentItems.list({
        sort: 'lastPublishedDate,desc',
        size: 20,
      })
    ).getItems();

    contentItems = appendMissingContentItems(response);
    updatedSelectedContentItems(selectedContentItems);

    loaded = true;
  };

  const appendMissingContentItems = (loadedContentItems: ContentItem[]) =>
    loadedContentItems.concat(
      selectedContentItems.filter(
        (selectedContentItem) =>
          !loadedContentItems.find(
            (loadedContentItem) =>
              selectedContentItem.id === loadedContentItem.id
          )
      )
    );

  const isLimitReached = (selectedList: string[], id: string) =>
    Array.isArray(selectedList) &&
    selectedList.length === maxNumberOfSelectableItems &&
    !selectedList.includes(id);
</script>

<style>
  .container {
    min-height: 50px;
    position: relative;
  }

  .container :global(ul.mdc-list) {
    width: 715px;
    max-height: 560px;
    overflow-y: scroll;
  }

  .container :global(.mdc-list-item__graphic) {
    margin-right: 10px;
  }

  div.label span.content-item-label {
    font-size: 16px;
  }

  div.label span {
    display: block;
    padding-bottom: 4px;
  }
</style>

<div class="container">
  {#if !loaded}
    <Loader zIndex={31} />
  {:else if contentItems.length === 0}
    <div>
      <h3 data-testid="no-content">
        No content currently exists for this repository
      </h3>
    </div>
  {:else if contentItems}
    <List checklist>
      {#each contentItems as contentItem}
        <Item>
          <Graphic>
            <Checkbox
              bind:group={checkedValues}
              value={contentItem.id}
              disabled={isLimitReached(checkedValues, contentItem.id)} />
          </Graphic>
          <Label>
            <div class="label">
              <span class="content-item-label">{contentItem.label}</span>
              <ContentTypeLabel
                repository={selectedContentRepository}
                schema={contentItem.body._meta.schema} />
            </div>
          </Label>
        </Item>
      {/each}
    </List>
  {/if}
</div>
