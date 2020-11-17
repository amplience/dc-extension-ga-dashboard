<script lang="ts">
  import EditionName from '../edition-name/edition-name.svelte';
  import QueryLabel from '../query-label/query-label.svelte';

  export let value: string;
  export let index: number;
</script>

<QueryLabel index={index + 1} />
<EditionName editionId={value} />
