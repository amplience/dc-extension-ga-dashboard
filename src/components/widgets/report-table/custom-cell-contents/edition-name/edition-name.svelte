<script lang="ts">
  import type { Edition } from 'dc-management-sdk-js';
  import { hub } from '../../../../../stores/dynamic-content';
  import { sdkExtensionConfiguration } from '../../../../../stores/sdk-extension-configuration';
  import { editions } from '../../../../../stores/editions';
  import Link from '../../../../link/link.svelte';

  export let editionId: string;

  let appUrl;

  if ($sdkExtensionConfiguration && $hub) {
    appUrl = $sdkExtensionConfiguration.params?.locationHref?.split('#!')[0];
  }

  const getEditionUrl = (edition: Edition) =>
    `${appUrl}#!/${$hub.name}/planning/edition/${edition.eventId}/${edition.id}/`;
</script>

{#await editions.fetch(editionId)}
  <span>{editionId}</span>
{:then edition}
  {#if appUrl}
    <Link href={getEditionUrl(edition)}><span>{edition.name}</span></Link>
  {:else}<span>{edition.name}</span>{/if}
{:catch}
  <span>{editionId}</span>
{/await}
