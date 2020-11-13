<script lang="ts">
  import { ContentItem } from 'dc-management-sdk-js';
  import {
    hub,
    managementSdkService,
  } from '../../../../../stores/dynamic-content';
  import Link from '../../../../link/link.svelte';

  export let contentItemId: string;

  const getContentItem = (id: string) =>
    $managementSdkService.client.contentItems.get(id);
</script>

{#await $managementSdkService.getAppLinkForResource($hub, ContentItem, contentItemId)}
  <span data-testid="loading-1">{contentItemId}</span>
{:then contentItemHref}
  {#await getContentItem(contentItemId)}
    <span data-testid="loading-2">{contentItemId}</span>
  {:then contentItem}
    <Link href={contentItemHref}>
      <span data-testid="loaded">{contentItem.label}</span>
    </Link>
  {/await}
{:catch}
  <span data-testid="error">{contentItemId}</span>
{/await}
