<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import type { ReportData } from '../../../services/gapi/get-report-data.service';
  import gapi from '../../../stores/gapi';
  import {
    breakdown,
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
  import {
    contentItemFilter,
    joinFilters,
    gaQueryFilter,
  } from '../../../stores/ga-query-filters';
  import { backOff } from 'exponential-backoff';
  import type { GetBreakdownData } from '../report-table/breakdown-table/get-breakdown-data';
  import { getReportData } from '../../../services/gapi/get-report-data.service';

  let reportData: ReportData[] = [];
  let loading = true;

  const getBreakdownData: GetBreakdownData = async (
    id: string
  ): Promise<ReportData[]> => {
    const params = {
      gaViewId: $gaViewId,
      dimension: $breakdown.dimension,
      limit: 100,
      dateRange: $dateRange,
      gaQueryFilter: joinFilters(
        $gaQueryFilter,
        $contentItemFilter,
        `${$contentItemIdMapping}==${id}`
      ),
    };
    return getReportData($gapi, params);
  };

  $: (async () => {
    try {
      loading = true;
      reportData = await backOff(async () => {
        const params = {
          gaViewId: $gaViewId,
          dimension: $contentItemIdMapping,
          limit: $topContentReportShowCount,
          dateRange: $dateRange,
          gaQueryFilter: joinFilters($gaQueryFilter, $contentItemFilter),
        };
        return getReportData($gapi, params);
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
      <ReportTable data={reportData} {config} {loading} {getBreakdownData} />
    </WidgetBody>
  </Widget>
</section>
