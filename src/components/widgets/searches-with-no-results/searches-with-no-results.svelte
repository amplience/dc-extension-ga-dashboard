<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { index } from '../../../stores/search-index';
  import DownloadCsv from '../../download-csv/download-csv.svelte';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import { DEFAULT_SIZE, SIZES } from '../widgets-config';
  import { getSearchesWithNoResultsForCsv } from './services/get-searches-with-no-results.service';
  import { trackAction } from '../../../services/google-analytics/google-analytics';
  import TopResultsTable from './table/searches-with-no-results-table.svelte';
  import SearchesWithNoResultsTable from './table/searches-with-no-results-table.svelte';
  import InfoTip from '../../info-tip/info-tip.svelte';
  import {
    noResultsExpandedRows,
    noResultsShowCount,
  } from '../../../stores/widget-settings';

  async function getCsvData() {
    return getSearchesWithNoResultsForCsv($index, {
      startDate: $dateRange.from,
      endDate: $dateRange.to,
    });
  }
</script>

<style>
  section {
    overflow: hidden;
  }

  section :global(.searches-with-no-results-sizes-select > .smui-select) {
    width: 40px;
  }
</style>

<section class="searches-with-no-results">
  <Widget>
    <WidgetHeader title="No results">
      <div slot="help">
        <InfoTip
          content="Search terms that returned no results. This could be because
          there were no matching results or the selected facets excluded all
          matching results." />
      </div>
      <div slot="actions">
        <DownloadCsv
          fileName={`no_results_${$index.name}_${$dateRange.from}-${$dateRange.to}`}
          fetchCsvData={getCsvData}
          on:downloadCsv={() => trackAction('No Results - Download')} />
        <Select
          className="searches-with-no-results-sizes-select"
          label="Show"
          bind:selectedOption={$noResultsShowCount}
          options={Array.from(SIZES.keys()).map((size) => ({
            key: size,
            value: size,
          }))}
          on:change={() => {
            $noResultsExpandedRows = [];
            trackAction('No Results - Change number to show');
          }} />
      </div>
    </WidgetHeader>
    <WidgetBody>
      <SearchesWithNoResultsTable limit={parseInt($noResultsShowCount)} />
    </WidgetBody>
  </Widget>
</section>
