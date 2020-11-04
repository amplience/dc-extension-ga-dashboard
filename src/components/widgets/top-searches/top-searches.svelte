<script lang="ts">
  import { dateRange } from '../../../stores/date-range';
  import { index, includeReplicas } from '../../../stores/search-index';
  import DownloadCsv from '../../download-csv/download-csv.svelte';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import { DEFAULT_SIZE, SIZES } from '../widgets-config';
  import { getTopSearchesForCsv } from './services/get-top-searches.service';
  import { trackAction } from '../../../services/google-analytics/google-analytics';
  import TopSearchesTable from './table/top-searches-table.svelte';
  import InfoTip from '../../info-tip/info-tip.svelte';
  import {
    topSearchesExpandedRows,
    topSearchesShowCount,
  } from '../../../stores/widget-settings';

  async function getCsvData() {
    return getTopSearchesForCsv($index, {
      startDate: $dateRange.from,
      endDate: $dateRange.to,
      includeReplicas: $includeReplicas,
    });
  }
</script>

<style>
  section {
    overflow: hidden;
  }

  section :global(.top-searches-sizes-select > .smui-select) {
    width: 40px;
  }
</style>

<section class="top-searches">
  <Widget>
    <WidgetHeader title="Top searches">
      <div slot="help">
        <InfoTip
          content="The most popular search terms entered by your users." />
      </div>
      <div slot="actions">
        <DownloadCsv
          fileName={`top_searches_${$index.name}_${$dateRange.from}-${$dateRange.to}`}
          fetchCsvData={getCsvData}
          on:downloadCsv={() => trackAction('Top Searches - Download')} />
        <Select
          className="top-searches-sizes-select"
          label="Show"
          bind:selectedOption={$topSearchesShowCount}
          options={Array.from(SIZES.keys()).map((size) => ({
            key: size,
            value: size,
          }))}
          on:change={() => {
            $topSearchesExpandedRows = [];
            trackAction('Top Searches - Change number to show');
          }} />
      </div>
    </WidgetHeader>
    <WidgetBody>
      <TopSearchesTable limit={parseInt($topSearchesShowCount)} />
    </WidgetBody>
  </Widget>
</section>
