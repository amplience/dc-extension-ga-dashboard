<script lang="typescript">
  import { onMount } from 'svelte';
  import DateRangeBar from './components/date-range-bar/date-range-bar.svelte';
  import GAAuthorize from './components/ga-authorize/ga-authorize.svelte';
  import TopBar from './components/top-bar/top-bar.svelte';
  import getExtensionClient from './services/extension-sdk/extension-sdk.service';
  import type { ExtensionConfiguration } from './services/extension-sdk/extension-sdk.service';
  import getManagementClient from './services/management-sdk/management-sdk.service';
  import createConnection from './services/message-event-channel/message-event-channel.factory';
  import { client, hub, hubId } from './stores/dynamic-content';
  import { gapiAuthorized } from './stores/gapi-authorized';
  import {
    contentItemIdMapping,
    gaClientId,
    setGaConfig,
  } from './stores/google-analytics';
  import { connection } from './stores/message-channel';
  import Loader from './components/loader/loader.svelte';
  import Overview from './components/widgets/overview/overview.svelte';
  import TopContentReport from './components/widgets/top-content-report/top-content-report.svelte';
  import { currencyCode, locale } from './stores/localization';

  connection.set(
    createConnection({
      onload: true,
      timeout: 5000,
      connectionTimeout: false,
    })
  );

  onMount(async () => {
    try {
      const extensionsSdk = await getExtensionClient();
      setGaConfig(extensionsSdk.params.installation as ExtensionConfiguration);
      const dcClient = getManagementClient(extensionsSdk.client);
      client.set(dcClient);
      hubId.set(extensionsSdk.params.hubId);
      hub.set(await $client.hubs.get($hubId));
      locale.set(
        (extensionsSdk.params.installation as ExtensionConfiguration)
          ?.localization?.locale || $locale
      );
      currencyCode.set(
        (extensionsSdk.params.installation as ExtensionConfiguration)
          ?.localization?.currencyCode || $currencyCode
      );
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

  .widgets-container :global(section.top-content-report) {
    grid-area: top-content-report;
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
      'top-content-report top-content-report';
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
      {#if !$gaClientId}
        <Loader />
      {:else if $gapiAuthorized}
        <section class="widgets-container">
          <Overview />
          {#if $contentItemIdMapping}
            <TopContentReport />
          {/if}
        </section>
      {:else}
        <GAAuthorize />
      {/if}
    </section>
  </div>
</main>
