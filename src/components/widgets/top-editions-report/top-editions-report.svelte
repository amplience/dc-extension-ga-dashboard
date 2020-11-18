<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import {
    getDataReport,
    processReportData,
    RequestTimeout,
  } from '../../../stores/gapi';
  import type { ReportData } from '../../../stores/gapi';
  import { editionIdMapping, gaViewId } from '../../../stores/google-analytics';
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

  let reportData: ReportData[];

  let loading = true;

  $: (async () => {
    const loadReport = async () => {
      const data = await getDataReport(
        $gaViewId,
        $editionIdMapping,
        $topEditionReportShowCount,
        $dateRange,
        constructFilter($editionFilter, $gaQueryFilter)
      );

      return processReportData(data);
    };

    loading = true;
    try {
      reportData = await loadReport();
    } catch (e) {
      if (!(e instanceof RequestTimeout)) {
        console.error(`Unable to get report data: ${e?.error?.message}`);
        reportData = [];
        return;
      }
      reportData = await loadReport();
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
      <ReportTable data={reportData} {config} {loading} />
    </WidgetBody>
  </Widget>
</section>
