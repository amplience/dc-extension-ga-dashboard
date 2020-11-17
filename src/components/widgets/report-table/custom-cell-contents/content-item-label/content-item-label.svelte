<script lang="ts">
  import ContentItemName from '../content-item-name/content-item-name.svelte';
  import QueryLabel from '../query-label/query-label.svelte';

  export let value: string;
  export let index: number;
</script>

<ContentItemName contentItemId={value} />
