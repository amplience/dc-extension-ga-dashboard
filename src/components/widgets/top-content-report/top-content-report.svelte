<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { getDataReport, processReportData } from '../../../stores/gapi';
  import type { ReportData } from '../../../stores/gapi';
  import {
    breakdownChart,
    contentItemIdMapping,
    gaViewId,
  } from '../../../stores/google-analytics';
  import { topContentReportShowCount } from '../../../stores/widget-settings';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import ReportTable from '../report-table/report-table.svelte';
  import { SIZES } from '../widgets-config';
  import config from './table-config';
  import { gaQueryFilter } from '../../../stores/ga-query-filters';
  import breakdownTableConfig from './breakdown-table-config';
  import type { GetBreakdownData } from '../report-table/breakdown-table/get-breakdown-data';

  let reportData: ReportData[];
  let loading = true;

  $: {
    if ($breakdownChart) {
      breakdownTableConfig.columns[0].title = $breakdownChart.title;
    }
  }

  const getBreakdownData: GetBreakdownData = async (
    id: string
  ): Promise<ReportData[]> => {
    const filter = `${
      $gaQueryFilter ? $gaQueryFilter + ';' : ''
    }ga:${$contentItemIdMapping}==${id}`;
    const data = await getDataReport(
      $gaViewId,
      $breakdownChart.dimension,
      $topContentReportShowCount,
      $dateRange,
      filter
    );
    return processReportData(data);
  };

  $: (async () => {
    try {
      loading = true;
      const data = await getDataReport(
        $gaViewId,
        $contentItemIdMapping,
        $topContentReportShowCount,
        $dateRange,
        $gaQueryFilter
      );

      reportData = processReportData(data);
    } catch (e) {
      console.error(`Unable to get report data: ${e?.error?.message}`);
      reportData = [];
    } finally {
      loading = false;
    }
  })();
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
      <ReportTable
        data={reportData}
        {config}
        {loading}
        {getBreakdownData}
        {breakdownTableConfig} />
    </WidgetBody>
  </Widget>
</section>
