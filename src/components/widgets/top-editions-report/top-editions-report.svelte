<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { getDataReport, processReportData } from '../../../stores/gapi';
  import type { ReportData } from '../../../stores/gapi';
  import {
    breakdown,
    editionIdMapping,
    gaViewId,
  } from '../../../stores/google-analytics';
  import { topEditionReportShowCount } from '../../../stores/widget-settings';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import ReportTable from '../report-table/report-table.svelte';
  import { SIZES } from '../widgets-config';
  import config from './table-config';
  import {
    editionFilter,
    constructFilter,
    gaQueryFilter,
  } from '../../../stores/ga-query-filters';
  import { backOff } from 'exponential-backoff';
  import type { GetBreakdownData } from '../report-table/breakdown-table/get-breakdown-data';

  let reportData: ReportData[];
  let loading = true;

  const getBreakdownData: GetBreakdownData = async (
    id: string
  ): Promise<ReportData[]> => {
    const filter = `${
      $gaQueryFilter ? $gaQueryFilter + ';' : ''
    }${$editionIdMapping}==${id}`;
    const data = await getDataReport(
      $gaViewId,
      $breakdown.dimension,
      100,
      $dateRange,
      filter
    );
    return processReportData(data);
  };

  $: (async () => {
    try {
      loading = true;
      reportData = await backOff(async () => {
        const data = await getDataReport(
          $gaViewId,
          $editionIdMapping,
          $topEditionReportShowCount,
          $dateRange,
          constructFilter($gaQueryFilter, $editionFilter)
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

  section :global(.top-editions-report-sizes-select > .smui-select) {
    width: 40px;
  }
</style>

<section class="top-editions-report">
  <Widget>
    <WidgetHeader title="Top editions">
      <div slot="actions">
        <Select
          className="top-editions-report-sizes-select"
          label="Show"
          bind:selectedOption={$topEditionReportShowCount}
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
