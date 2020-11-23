<script lang="ts">
  import type { ContentRepository } from 'dc-management-sdk-js/build/main/lib/model/ContentRepository';
  import { onMount } from 'svelte';
  import { hub } from '../../stores/dynamic-content';

  export let repository: ContentRepository;
  export let schema: string;
  let contentTypeLabel: string = null;

  const resolveContentType = async () => {
    const { hubContentTypeId } = repository.contentTypes.find(
      (typeInfo) => typeInfo.contentTypeUri === schema
    );

    contentTypeLabel = (await $hub.related.contentTypes.get(hubContentTypeId))
      .settings.label;
  };

  onMount(() => {
    if (repository && schema) {
      resolveContentType();
    }
  });
</script>

<style>
  span.content-type-label {
    font-style: italic;
  }
</style>

<span class="content-type-label">{contentTypeLabel || ''}</span>
