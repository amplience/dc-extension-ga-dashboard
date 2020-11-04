<script lang="ts">
  import Widget from '../../widget/widget.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import { dateRange } from '../../../stores/date-range';
  import Loader from '../../loader/loader.svelte';
  import { onMount } from 'svelte';
  import { getGAPI } from '../../../services/gapi/gapi';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';

  let chart;

  onMount(async () => {
    const gapi = getGAPI();
    gapi.analytics.ready(function () {
      chart = new gapi.analytics.googleCharts.DataChart({
        query: {
          ids: 'ga:232357561',
          metrics: 'ga:totalEvents,ga:uniqueEvents',
          dimensions: 'ga:date',
          'start-date': $dateRange.from,
          'end-date': $dateRange.to,
        },
        chart: {
          type: 'LINE',
          container: 'ga-line-chart',
          options: {
            fontSize: 12,
            width: '100%',
            animation: {
              startup: true,
            },
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
          },
        },
      });

      chart.execute();
    });
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
