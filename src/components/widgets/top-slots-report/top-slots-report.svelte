<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { getDataReport, processReportData } from '../../../stores/gapi';
  import type { ReportData } from '../../../stores/gapi';
  import {
    slotIdMapping,
    gaViewId,
    breakdown,
  } from '../../../stores/google-analytics';
  import { topSlotReportShowCount } from '../../../stores/widget-settings';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import ReportTable from '../report-table/report-table.svelte';
  import { SIZES } from '../widgets-config';
  import config from './table-config';
  import {
    gaQueryFilter,
    joinFilters,
    slotFilter,
  } from '../../../stores/ga-query-filters';
  import { backOff } from 'exponential-backoff';
  import type { GetBreakdownData } from '../report-table/breakdown-table/get-breakdown-data';

  let reportData: ReportData[];
  let loading = true;

  const getBreakdownData: GetBreakdownData = async (
    id: string
  ): Promise<ReportData[]> => {
    const data = await getDataReport(
      $gaViewId,
      $breakdown.dimension,
      100,
      $dateRange,
      joinFilters($gaQueryFilter, $slotFilter, `${$slotIdMapping}==${id}`)
    );
    return processReportData(data);
  };

  $: (async () => {
    try {
      loading = true;
      reportData = await backOff(async () => {
        const data = await getDataReport(
          $gaViewId,
          $slotIdMapping,
          $topSlotReportShowCount,
          $dateRange,
          joinFilters($gaQueryFilter, $slotFilter)
        );
        return processReportData(data);
      });
    } finally {
      loading = false;
    }
  })();
</script>

<style>
  section {
    overflow: hidden;
  }

  section :global(.top-slots-report-sizes-select > .smui-select) {
    width: 40px;
  }
</style>

<section class="top-slots-report">
  <Widget>
    <WidgetHeader title="Top slots">
      <div slot="actions">
        <Select
          className="top-slots-report-sizes-select"
          label="Show"
          bind:selectedOption={$topSlotReportShowCount}
          options={Array.from(SIZES.keys()).map((size) => ({
            key: size,
            value: size,
          }))} />
      </div>
    </WidgetHeader>
    <WidgetBody>
      <ReportTable data={reportData} {config} {loading} {getBreakdownData} />
    </WidgetBody>
  </Widget>
</section>
