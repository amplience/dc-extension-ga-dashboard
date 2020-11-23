<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import gapi from '../../../stores/gapi';

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
    joinFilters,
    gaQueryFilter,
  } from '../../../stores/ga-query-filters';
  import { backOff } from 'exponential-backoff';
  import type { GetBreakdownData } from '../report-table/breakdown-table/get-breakdown-data';
  import { getReportData } from '../../../services/gapi/get-report-data.service';
  import type { ReportData } from '../../../services/gapi/get-report-data.service';

  let reportData: ReportData[];
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
        $editionFilter,
        `${$editionIdMapping}==${id}`
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
          dimension: $editionIdMapping,
          limit: $topEditionReportShowCount,
          dateRange: $dateRange,
          gaQueryFilter: joinFilters($gaQueryFilter, $editionFilter),
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
