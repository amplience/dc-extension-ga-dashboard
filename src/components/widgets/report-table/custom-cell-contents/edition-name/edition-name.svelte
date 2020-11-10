<script lang="ts">
  import { editions } from '../../../../../stores/editions';

  export let editionId: string;
</script>

{#await editions.fetch(editionId)}
  <span>{editionId}</span>
{:then edition}
  <span>{edition.name}</span>
{:catch}
  <span>{editionId}</span>
{/await}
