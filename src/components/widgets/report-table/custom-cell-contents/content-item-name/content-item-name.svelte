<script lang="ts">
  import { contentItems } from '../../../../../stores/content-items';
import { hub } from '../../../../../stores/dynamic-content';
  import { sdkExtensionConfiguration } from '../../../../../stores/sdk-extension-configuration';
  import Link from '../../../../link/link.svelte';

  export let contentItemId: string;

  let contentItemHref;
  if ($sdkExtensionConfiguration) {
    console.log($sdkExtensionConfiguration.params?.locationHref);
    const appUrl = $sdkExtensionConfiguration.params?.locationHref?.split(
      '#!'
    )[0];
    if (appUrl) {
      contentItemHref = `${appUrl}#!/${$hub.name}/authoring/content-item/edit/${contentItemId}`;
    }
  }
</script>

{#await contentItems.fetch(contentItemId)}
  <span>{contentItemId}</span>
{:then contentItem}
  {#if contentItemHref}
    <Link href={contentItemHref}><span>{contentItem.label}</span></Link>
  {:else}<span>{contentItem.label}</span>{/if}
{:catch}
  <span>{contentItemId}</span>
{/await}
