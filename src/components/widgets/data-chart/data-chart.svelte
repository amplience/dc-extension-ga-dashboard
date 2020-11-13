<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { ChartType, insertDataChart } from '../../../stores/gapi';
  import { gaViewId } from '../../../stores/google-analytics';
  import Loader from '../../loader/loader.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import { gaQueryFilter } from '../../../stores/ga-query-filters';

  export let className = '';
  export let title;
  export let dimensions;
  export let chartType: ChartType = ChartType.LINE;
  export let containerId = `ga-chart-${className}`;

  let loading = true;
  let chartOptions = {};
  if (chartType === ChartType.LINE) {
    chartOptions = {
      hAxis: {
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
      await insertDataChart(
        {
          ids: `ga:${$gaViewId}`,
          metrics: 'ga:totalEvents,ga:uniqueEvents',
          dimensions,
          'start-date': $dateRange.from,
          'end-date': $dateRange.to,
          filters: $gaQueryFilter,
        },
        containerId,
        chartType,
        chartOptions
      );
    } catch (e) {
      console.error(`Unable to load chart data: ${e?.error?.message}`);
    } finally {
      loading = false;
    }
  })();
</script>

<style>
  section {
    background-color: #fff;
    min-height: 352px;
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
      <section class="ga-chart">
        {#if loading}
          <Loader zIndex={1} />
        {/if}
        <div id={containerId} />
      </section>
    </WidgetBody>
  </Widget>
</section>
