<script lang="typescript">
  import { onMount } from 'svelte';
  import DateRangeBar from './components/date-range-bar/date-range-bar.svelte';
  import GAAuthorize from './components/ga-authorize/ga-authorize.svelte';
  import Loader from './components/loader/loader.svelte';
  import TopBar from './components/top-bar/top-bar.svelte';
  import DataChart from './components/widgets/data-chart/data-chart.svelte';
  import TopContentReport from './components/widgets/top-content-report/top-content-report.svelte';
  import TopEditionsReport from './components/widgets/top-editions-report/top-editions-report.svelte';
  import type { ExtensionConfiguration } from './services/extension-sdk/extension-sdk.service';
  import getExtensionClient from './services/extension-sdk/extension-sdk.service';
  import createConnection from './services/message-event-channel/message-event-channel.factory';
  import { ChartType, initGapi } from './stores/gapi';
  import { hub, managementSdkService } from './stores/dynamic-content';
  import { gapiAuthorized } from './stores/gapi-authorized';
  import {
    breakdownChart,
    contentItemIdMapping,
    editionIdMapping,
    gaClientId,
    setGaConfig,
  } from './stores/google-analytics';
  import { connection } from './stores/message-channel';
  import { currencyCode, locale } from './stores/localization';
  import { sdkExtensionConfiguration } from './stores/sdk-extension-configuration';
  import { ManagementSdkService } from './services/management-sdk/management-sdk.service';
  import HttpClientInFlightCache from './services/management-sdk/http-client-in-flight-cache';

  connection.set(
    createConnection({
      onload: true,
      timeout: 5000,
      connectionTimeout: false,
    })
  );

  onMount(async () => {
    await initGapi();
    const extensionsSdk = await getExtensionClient();
    $sdkExtensionConfiguration = extensionsSdk;
    setGaConfig(extensionsSdk.params.installation as ExtensionConfiguration);
    $managementSdkService = new ManagementSdkService(
      new HttpClientInFlightCache(extensionsSdk.client, 5000)
    );
    $hub = await $managementSdkService.client.hubs.get(
      extensionsSdk.params.hubId
    );
    $locale =
      (extensionsSdk.params.installation as ExtensionConfiguration)
        ?.localization?.locale || $locale;
    $currencyCode =
      (extensionsSdk.params.installation as ExtensionConfiguration)
        ?.localization?.currencyCode || $currencyCode;
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
  :global(*:not(text)) {
    font: 400 13px 'Roboto', sans-serif;
    box-sizing: border-box;
  }

  .widgets-container :global(section.top-content-report) {
    grid-area: top-content-report;
  }

  .widgets-container :global(section.top-editions-report) {
    grid-area: top-editions-report;
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
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      'overview overview breakdown'
      'top-content-report top-content-report top-content-report'
      'top-editions-report top-editions-report top-editions-report';
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
          <DataChart
            className="overview"
            title="Overview"
            dimensions="ga:date"
            chartType={ChartType.LINE} />
          <DataChart
            className="breakdown"
            title={$breakdownChart.title}
            dimensions={$breakdownChart.dimension}
            chartType={ChartType.BAR} />
          {#if $contentItemIdMapping}
            <TopContentReport />
          {/if}
          {#if $editionIdMapping}
            <TopEditionsReport />
          {/if}
        </section>
      {:else}
        <GAAuthorize />
      {/if}
    </section>
  </div>
</main>
