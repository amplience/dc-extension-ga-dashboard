<script lang="ts">
  import type { ContentRepository } from 'dc-management-sdk-js/build/main/lib/model/ContentRepository';
  import { onMount } from 'svelte';

  export let repository: ContentRepository;
  export let schema: string;
  let contentTypeLabel: string = null;

  const resolveContentType = async () => {
    const { hubContentTypeId } = repository.contentTypes.find(
      (typeInfo) => typeInfo.contentTypeUri === schema
    );
    contentTypeLabel = hubContentTypeId;
    // go get type
  };

  onMount(() => {
    if (repository && schema) {
      resolveContentType();
    }
  });
</script>

<style>
</style>

<span class="content-type-label">{contentTypeLabel || ''}</span>
