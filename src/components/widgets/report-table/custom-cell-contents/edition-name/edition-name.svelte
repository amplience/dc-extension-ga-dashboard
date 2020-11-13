<script lang="ts">
  import { Edition } from 'dc-management-sdk-js';
  import {
    hub,
    managementSdkService,
  } from '../../../../../stores/dynamic-content';
  import Link from '../../../../link/link.svelte';

  export let editionId: string;

  const getEdition = (id: string) =>
    $managementSdkService.client.editions.get(id);
</script>

{#await $managementSdkService.getAppLinkForResource($hub, Edition, editionId)}
  <span data-testid="loading-1">{editionId}</span>
{:then href}
  {#await getEdition(editionId)}
    <span data-testid="loading-2">{editionId}</span>
  {:then edition}
    <Link {href}><span data-testid="loaded">{edition.name}</span></Link>
  {/await}
{:catch err}
  <span data-testid="error">{editionId}</span>
{/await}
