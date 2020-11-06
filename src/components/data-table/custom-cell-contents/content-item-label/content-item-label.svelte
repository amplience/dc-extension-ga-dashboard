<script lang="ts">
  import { contentItems } from '../../../../stores/content-items';
  export let contentItemId: string;
</script>

<style>
</style>

{#await contentItems.fetch(contentItemId)}
  <span>{contentItemId}</span>
{:then contentItem}
  <span>{contentItem.label}</span>
{/await}
