<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { gaViewId } from '../../../stores/google-analytics';
  import Loader from '../../loader/loader.svelte';
  import NoDataPlaceholder from '../../no-data-placeholder/no-data-placeholder.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import { gaQueryFilter } from '../../../stores/ga-query-filters';
  import { backOff } from 'exponential-backoff';
  import {
    ChartType,
    insertDataChart,
  } from '../../../services/gapi/insert-data-chart.service';
  import gapi from '../../../stores/gapi';

  export let className = '';
  export let title;
  export let dimensions;
  export let chartType: ChartType = ChartType.LINE;
  export let containerId = `ga-chart-${className}`;

  let unableToLoad = false;
  let loading = true;
  let chartOptions = {};
  if (chartType === ChartType.BAR) {
    chartOptions = {
      orientation: 'horizontal',
      colors: ['#058dc7', '#aadff3'],
      chartArea: {
        left: 50,
        right: 20,
      },
    };
  }
  if (chartType === ChartType.LINE) {
    chartOptions = {
      hAxis: {
        textStyle: {
          color: '#999',
        },
        gridlines: {
          units: {
            days: { format: ['dd MMM'] },
          },
        },
        minorGridlines: {
          units: {
            hours: { format: [''] },
            minutes: { format: [''] },
          },
        },
      },
    };
  }

  $: (async () => {
    try {
      loading = true;
      unableToLoad = false;
      await backOff(() =>
        insertDataChart(
          $gapi,
          containerId,
          chartType,
          {
            ids: $gaViewId,
            metrics: 'ga:totalEvents,ga:uniqueEvents',
            dimensions,
            'start-date': $dateRange.from,
            'end-date': $dateRange.to,
            filters: $gaQueryFilter,
          },
          chartOptions
        )
      );
    } catch (err) {
      unableToLoad = true;
    } finally {
      loading = false;
    }
  })();
</script>

<style>
  section {
    background-color: #fff;
    min-height: 300px;
  }

  section :global(.widget-body) {
    min-height: unset;
    margin-bottom: 0;
    padding: 0 10px;
  }

  .ga-chart {
    width: 100%;
  }
</style>

<section class={className}>
  <Widget>
    <WidgetHeader {title} />
    <WidgetBody>
      {#if unableToLoad}
        <NoDataPlaceholder message="No data currently available" />
      {:else}
        <section class="ga-chart">
          {#if loading}
            <Loader zIndex={1} />
          {/if}
          <div id={containerId} />
        </section>
      {/if}
    </WidgetBody>
  </Widget>
</section>
