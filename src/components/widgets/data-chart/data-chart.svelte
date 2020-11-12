<script lang="ts">
  import { onMount } from 'svelte';
  import type { DataChart } from '../../../definitions/google-analytics-embed-api';
  import { dateRange } from '../../../stores/date-range';
  import { ChartType, getDataChart } from '../../../stores/gapi';
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

  export let chart: DataChart;

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

  onMount(async () => {
    chart = getDataChart(
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

    chart.execute();
  });

  $: {
    if (chart) {
      chart.set({
        query: {
          'start-date': $dateRange.from,
          'end-date': $dateRange.to,
          filters: $gaQueryFilter,
        },
      });
      chart.execute();
    }
  }
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
      <section id={containerId} class="ga-chart">
        <Loader />
      </section>
    </WidgetBody>
  </Widget>
</section>
