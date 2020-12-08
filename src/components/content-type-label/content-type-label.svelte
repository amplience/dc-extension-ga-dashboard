<script lang="ts">
  import type { ContentRepository } from 'dc-management-sdk-js/build/main/lib/model/ContentRepository';
  import { onMount } from 'svelte';
  import { hub } from '../../stores/dynamic-content';

  export let repository: ContentRepository;
  export let schema: string;
  let contentTypeLabel: string = null;

  const resolveContentType = async () => {
    const contentType = repository.contentTypes.find(
      (typeInfo) =>
        typeInfo.contentTypeUri.toLowerCase() === schema.toLowerCase()
    );
    if (contentType) {
      contentTypeLabel = (
        await $hub.related.contentTypes.get(contentType.hubContentTypeId)
      ).settings.label;
    }
  };

  onMount(() => {
    if (repository && schema) {
      resolveContentType();
    }
  });
</script>

<style>
  span.content-type-label {
    font-size: 11px;
    color: #999;
  }
</style>

<span class="content-type-label">{contentTypeLabel || ''}</span>
