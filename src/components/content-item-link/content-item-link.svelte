<script lang="ts">
  import getContentItemProperties from './services/get-content-item-properties.service';
  import { client } from '../../stores/dynamic-content';
  import { connection } from '../../stores/message-channel';
  export let contentItemId: string;

  function onContentItemClick(contentItemId: string) {
    $connection.emit('content-item-redirect', contentItemId);
  }
</script>

<style>
  a {
    color: #039be5;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
  }
</style>

{#await getContentItemProperties($client, $connection, contentItemId)}
  <span>{contentItemId}</span>
{:then [contentItemLink, contentItemLabel]}
  <a
    href={contentItemLink}
    on:click|preventDefault={() => onContentItemClick(contentItemId)}>
    {contentItemLabel}
  </a>
{/await}
