<script lang="ts">
  import { topContentReportShowCount } from '../../../stores/widget-settings';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import { SIZES } from '../widgets-config';
  import ReportTable from '../report-table/report-table.svelte';
  import { getDataReport } from '../../../stores/gapi';
  import {
    contentItemIdMapping,
    gaViewId,
  } from '../../../stores/google-analytics';
  import { dateRange } from '../../../stores/date-range';
  import { onMount } from 'svelte';
  import config from './table-config';

  let reportData;
  let report;

  onMount(() => {
    report = getDataReport({
      ids: `ga:${$gaViewId}`,
      metrics: 'ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue',
      dimensions: `ga:${$contentItemIdMapping}`,
      sort: '-ga:totalEvents',
      'max-results': $topContentReportShowCount,
      'start-date': $dateRange.from,
      'end-date': $dateRange.to,
    });

    report.on('success', (response) => {
      const {
        rows = [],
        totalsForAllResults: {
          'ga:totalEvents': allTotalEvents,
          'ga:uniqueEvents': allUniqueEvents,
        },
      } = response;
      const hydratedRows = rows.map((row) => {
        const [
          contentId,
          totalEvents,
          uniqueEvents,
          eventValue,
          avgEventValue,
        ] = row;
        const totalEventsPercentage =
          Math.round((totalEvents / allTotalEvents) * 100) || 0;
        const uniqueEventsPercentage =
          Math.round((uniqueEvents / allUniqueEvents) * 100) || 0;

        return [
          contentId,
          totalEvents,
          totalEventsPercentage,
          uniqueEvents,
          uniqueEventsPercentage,
          eventValue,
          avgEventValue,
        ];
      });
      reportData = hydratedRows;
    });

    report.execute();
  });

  $: {
    if (report) {
      report.set({
        query: {
          'max-results': $topContentReportShowCount,
          'start-date': $dateRange.from,
          'end-date': $dateRange.to,
        },
      });
      report.execute();
    }
  }
</script>

<style>
  section {
    overflow: hidden;
  }

  section :global(.top-content-report-sizes-select > .smui-select) {
    width: 40px;
  }
</style>

<section class="top-content-report">
  <Widget>
    <WidgetHeader title="Top content">
      <div slot="actions">
        <Select
          className="top-content-report-sizes-select"
          label="Show"
          bind:selectedOption={$topContentReportShowCount}
          options={Array.from(SIZES.keys()).map((size) => ({
            key: size,
            value: size,
          }))} />
      </div>
    </WidgetHeader>
    <WidgetBody>
      <ReportTable data={reportData} {config} />
    </WidgetBody>
  </Widget>
</section>
