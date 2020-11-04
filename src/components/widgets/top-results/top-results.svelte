<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { index, includeReplicas } from '../../../stores/search-index';
  import DownloadCsv from '../../download-csv/download-csv.svelte';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import { DEFAULT_SIZE, SIZES } from '../widgets-config';
  import { getTopHitsForCsv } from './services/get-top-hits.service';
  import { trackAction } from '../../../services/google-analytics/google-analytics';
  import TopResultsTable from './table/top-results-table.svelte';
  import InfoTip from '../../info-tip/info-tip.svelte';
  import { topResultsShowCount } from '../../../stores/widget-settings';

  async function getCsvData() {
    return getTopHitsForCsv($index, {
      includeReplicas: $includeReplicas,
      startDate: $dateRange.from,
      endDate: $dateRange.to,
    });
  }
</script>

<style>
  section {
    overflow: hidden;
  }

  section :global(.top-results-sizes-select > .smui-select) {
    width: 40px;
  }
</style>

<section class="top-results">
  <Widget>
    <WidgetHeader title="Top results">
      <div slot="help">
        <InfoTip
          content="The content items most often displayed in search results." />
      </div>
      <div slot="actions">
        <DownloadCsv
          fileName={`top_results_${$index.name}_${$dateRange.from}-${$dateRange.to}`}
          fetchCsvData={getCsvData}
          on:downloadCsv={() => trackAction('Top Results - Download')} />
        <Select
          className="top-results-sizes-select"
          label="Show"
          bind:selectedOption={$topResultsShowCount}
          options={Array.from(SIZES.keys()).map((size) => ({
            key: size,
            value: size,
          }))}
          on:change={() => trackAction('Top Results - Change number to show')} />
      </div>
    </WidgetHeader>
    <WidgetBody>
      <TopResultsTable limit={parseInt($topResultsShowCount)} />
    </WidgetBody>
  </Widget>
</section>
