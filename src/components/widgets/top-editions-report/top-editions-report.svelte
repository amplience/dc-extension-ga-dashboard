<script lang="ts">
  import { onMount } from 'svelte';
  import type {
    Data,
    DataReportResponse,
  } from '../../../definitions/google-analytics-embed-api';
  import { dateRange } from '../../../stores/date-range';
  import { getDataReport, processReportData } from '../../../stores/gapi';
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

  let reportData: ReportData[];
  let report: Data;

  onMount(() => {
    report = getDataReport(
      $gaViewId,
      $editionIdMapping,
      $topEditionReportShowCount,
      $dateRange
    );

    report.on('success', (response: DataReportResponse) => {
      reportData = processReportData(response);
    });

    report.execute();
  });

  $: {
    if (report) {
      report.set({
        query: {
          'max-results': $topEditionReportShowCount,
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
      <ReportTable data={reportData} {config} />
    </WidgetBody>
  </Widget>
</section>
