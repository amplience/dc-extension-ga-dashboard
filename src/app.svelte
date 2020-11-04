<script lang="typescript">
  import type { SearchIndex } from 'dc-management-sdk-js';
  import { onDestroy, onMount } from 'svelte';
  import TopBar from './components/top-bar/top-bar.svelte';
  import GAAuthorize from './components/ga-authorize/ga-authorize.svelte';
  import TopResults from './components/widgets/top-results/top-results.svelte';
  import TopSearches from './components/widgets/top-searches/top-searches.svelte';
  import ManagementSDKProxyService from './services/management-sdk-proxy/management-sdk-proxy.service';
  import createConnection from './services/message-event-channel/message-event-channel.factory';
  import { client, hub, hubId } from './stores/dynamic-content';
  import { connection } from './stores/message-channel';
  import DateRangeBar from './components/date-range-bar/date-range-bar.svelte';
  import SearchesWithNoResults from './components/widgets/searches-with-no-results/searches-with-no-results.svelte';
  import Overview from './components/widgets/overview/overview.svelte';
  import { gapiAuthorized } from './stores/gapi-authorized';

  connection.set(
    createConnection({
      onload: true,
      timeout: 5000,
      connectionTimeout: false,
    })
  );

  const managementSDKProxyService = new ManagementSDKProxyService($connection);

  onMount(async () => {
    try {
      const dcClient = await managementSDKProxyService.getClient();
      client.set(dcClient);
      hubId.set(managementSDKProxyService.hubId);
      hub.set(await $client.hubs.get($hubId));
    } catch (e) {
      console.error(e);
    }
  });

  function setParentHeight(height: number): void {
    $connection.emit('height-set', height);
  }

  $: offsetHeight = setParentHeight(offsetHeight);
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  :global(body) {
    padding-top: 0px;
    background-color: #f2f2f2;
  }
  :global(*) {
    font: 400 13px 'Roboto', sans-serif;
    box-sizing: border-box;
  }

  .widgets-container :global(section.top-searches) {
    grid-area: top-searches;
  }
  .widgets-container :global(section.top-results) {
    grid-area: top-results;
  }
  .widgets-container :global(section.searches-with-no-results) {
    grid-area: searches-with-no-results;
  }

  .widgets-container :global(section.overview) {
    grid-area: overview;
  }

  .scroll-area {
    overflow: auto;
    height: calc(100% - 110px);
  }

  .container {
    background-color: #f2f2f2;
    width: 100%;
    margin: 2.6rem auto;
    max-width: 1256px;
    position: relative;
  }

  .widgets-container {
    display: grid;
    grid-column-gap: 16px;
    grid-row-gap: 16px;
    grid-auto-rows: auto;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'overview overview'
      'top-searches top-searches'
      'top-results searches-with-no-results';
    align-items: flex-start;
  }

  .top-bar {
    top: 0;
    position: sticky;
    z-index: 2;
  }

  main {
    height: 100%;
  }
</style>

<main bind:offsetHeight>
  <div class="top-bar">
    <TopBar />
    <DateRangeBar />
  </div>
  <div class="scroll-area">
    <section class="container">
      {#if $gapiAuthorized}
        <section class="widgets-container">
          <!-- <Overview />
          <TopSearches />
          <TopResults />
          <SearchesWithNoResults /> -->
        </section>
      {:else}
        <GAAuthorize />
      {/if}
    </section>
  </div>
</main>
