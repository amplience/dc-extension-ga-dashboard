<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import List, { Graphic, Item, Label } from '@smui/list';
  import type { ContentItem } from 'dc-management-sdk-js';
  import type { ContentRepository } from 'dc-management-sdk-js/build/main/lib/model/ContentRepository';
  import { createEventDispatcher, onMount } from 'svelte';
  import ContentTypeLabel from '../content-type-label/content-type-label.svelte';
  import Loader from '../loader/loader.svelte';

  const MAX_SELECTED = 5 as const;
  let loaded = true;
  let contentItems: ContentItem[] = [];
  let checkedValues: string[] = [];
  export let selectedRepository: ContentRepository;
  export let selectedContentItems: ContentItem[];

  const dispatch = createEventDispatcher();

  $: handleCheckedValues(checkedValues);
  $: loadContentItems(selectedRepository);

  const handleCheckedValues = (values: string[]) => {
    if (values.length > MAX_SELECTED) {
      values.pop();
      return;
    }

    const selectedItems = contentItems.filter((contentItem) =>
      values.includes(contentItem.id)
    );
    dispatch('change', selectedItems);
  };

  const loadContentItems = async (repository: ContentRepository) => {
    if (!repository || !repository.related) {
      return;
    }

    loaded = false;
    const response = (
      await repository.related.contentItems.list({
        sort: 'lastPublishedDate,desc',
        size: 20,
      })
    ).getItems();

    contentItems = appendMissingContentItems(response);

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

  onMount(() => {
    if (selectedContentItems) {
      checkedValues = selectedContentItems.map((contentItem) => contentItem.id);
    }
  });
</script>

<style>
  .container {
    min-height: 50px;
  }

  .container :global(ul.mdc-list) {
    width: 715px;
    max-height: 560px;
    overflow-y: scroll;
  }
</style>

<div class="container">
  {#if !loaded}
    <Loader zIndex={11} />
  {:else if contentItems.length === 0}
    <div>
      <h3 data-testid="no-content">
        No content currently exists for this repository
      </h3>
    </div>
  {:else if contentItems}
    <div>
      <h3>select content items (max 5 from single repository)</h3>
    </div>
    <List class="demo-list" checklist>
      {#each contentItems as contentItem}
        <Item>
          <Graphic>
            <Checkbox bind:group={checkedValues} value={contentItem.id} />
          </Graphic>
          <Label>
            {contentItem.label}
            <br />
            <ContentTypeLabel
              repository={selectedRepository}
              schema={contentItem.body._meta.schema} />
          </Label>
        </Item>
      {/each}
    </List>
  {/if}
</div>
