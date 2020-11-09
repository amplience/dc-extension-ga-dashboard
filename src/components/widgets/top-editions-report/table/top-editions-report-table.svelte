<script lang="ts">
  import { onMount } from 'svelte';
  import { dateRange } from '../../../../stores/date-range';
  import { getDataReport } from '../../../../stores/gapi';
  import {
    editionIdMapping,
    gaViewId,
  } from '../../../../stores/google-analytics';
  import { topContentReportShowCount } from '../../../../stores/widget-settings';
  import { Body, Cell, DataTable, Head, Row } from '../../../data-table';
  import ContentItemLabel from '../../../data-table/custom-cell-contents/content-item-label/content-item-label.svelte';
  import CurrencyLabel from '../../../data-table/custom-cell-contents/currency-label/currency-label.svelte';
  import PercentOfLabel from '../../../data-table/custom-cell-contents/percent-of-label/percent-of-label.svelte';
  import QueryLabel from '../../../data-table/custom-cell-contents/query-label/query-label.svelte';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import tableConfig from './table-config';

  let rowData;
  let loading = true;
  let report;

  onMount(() => {
    report = getDataReport({
      ids: `ga:${$gaViewId}`,
      metrics: 'ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue',
      dimensions: `ga:${$editionIdMapping}`,
      sort: '-ga:totalEvents',
      'max-results': $topContentReportShowCount,
      'start-date': $dateRange.from,
      'end-date': $dateRange.to,
    });

    report.on('success', (response) => {
      const {
        rows = [],
        totalsForAllResults: {
          'ga:totalEvents': allTotalEvents,
          'ga:uniqueEvents': allUniqueEvents,
        },
      } = response;

      rowData = { rows, allTotalEvents, allUniqueEvents };

      loading = false;
    });

    report.execute();
  });

  $: {
    if (report) {
      report.set({
        query: {
          'max-results': $topContentReportShowCount,
          'start-date': $dateRange.from,
          'end-date': $dateRange.to,
        },
      });
      report.execute();
    }
  }
</script>

<style>
  :global(div[slot='table-footer']) {
    display: flex;
    justify-content: flex-end;
    margin: 8px 0;
  }
  :global(div[slot='table-footer'] .download-csv-button) {
    margin-right: 24px;
  }
</style>

{#if loading}
  <Loader />
{:else if rowData.rows.length > 0}
  <DataTable>
    <Head>
      <Row>
        {#each tableConfig.columns as column}
          <Cell width={column.width} align={column.align} color={'#999'}>
            {column.title}
          </Cell>
        {/each}
      </Row>
    </Head>
    <Body>
      {#each rowData.rows as cell, columnIndex}
        <Row>
          <Cell
            width={tableConfig.columns[0].width}
            align={tableConfig.columns[0].align}>
            <QueryLabel index={columnIndex + 1} expandable={false} />
            <ContentItemLabel contentItemId={cell[0]} />
          </Cell>
          <Cell
            width={tableConfig.columns[1].width}
            align={tableConfig.columns[1].align}>
            {cell[1]}
          </Cell>
          <Cell
            width={tableConfig.columns[2].width}
            align={tableConfig.columns[2].align}>
            <PercentOfLabel
              value={Number(cell[1])}
              total={Number(rowData.allTotalEvents)} />
          </Cell>
          <Cell
            width={tableConfig.columns[3].width}
            align={tableConfig.columns[3].align}>
            {cell[2]}
          </Cell>
          <Cell
            width={tableConfig.columns[4].width}
            align={tableConfig.columns[4].align}>
            <PercentOfLabel
              value={Number(cell[2])}
              total={Number(rowData.allUniqueEvents)} />
          </Cell>
          <Cell
            width={tableConfig.columns[5].width}
            align={tableConfig.columns[5].align}>
            <CurrencyLabel value={Number(cell[3])} />
          </Cell>
          <Cell
            width={tableConfig.columns[6].width}
            align={tableConfig.columns[6].align}>
            <CurrencyLabel value={Number(cell[4])} />
          </Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
{:else}
  <NoDataPlaceholder />
{/if}
