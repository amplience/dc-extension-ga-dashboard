<script lang="ts">
  import { onMount } from 'svelte';
  import type { DataChart } from '../../../definitions/google-analytics-embed-api';
  import { dateRange } from '../../../stores/date-range';
  import { getDataChart } from '../../../stores/gapi';
  import { gaViewId } from '../../../stores/google-analytics';
  import Loader from '../../loader/loader.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';

  let chart: DataChart;

  onMount(async () => {
    chart = getDataChart({
      ids: `ga:${$gaViewId}`,
      metrics: 'ga:totalEvents,ga:uniqueEvents',
      dimensions: 'ga:date',
      'start-date': $dateRange.from,
      'end-date': $dateRange.to,
    });

    chart.execute();
  });

  $: {
    if (chart) {
      chart.set({
        query: { 'start-date': $dateRange.from, 'end-date': $dateRange.to },
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

  .ga-line-chart {
    width: 100%;
  }
</style>

<section class="overview">
  <Widget>
    <WidgetHeader title="Overview" />
    <WidgetBody>
      <section id="ga-line-chart" class="ga-line-chart">
        <Loader />
      </section>
    </WidgetBody>
  </Widget>
</section>
