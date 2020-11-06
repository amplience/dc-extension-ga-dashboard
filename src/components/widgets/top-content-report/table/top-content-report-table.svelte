<script lang="ts">
  import { onMount } from 'svelte';
  import { getGAPI } from '../../../../services/gapi/gapi';

  import { dateRange } from '../../../../stores/date-range';
  import { gaViewId } from '../../../../stores/google-analytics';
  import { topContentReportShowCount } from '../../../../stores/widget-settings';
  import { Body, Cell, DataTable, Head, Row } from '../../../data-table';
  import QueryLabel from '../../../data-table/custom-cell-contents/query-label/query-label.svelte';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import tableConfig from './table-config';

  let rows = [];
  let loading = true;
  let report;

  onMount(() => {
    const gapi = getGAPI();
    gapi.analytics.ready(function () {
      report = new gapi.analytics.report.Data({
        query: {
          ids: `ga:${$gaViewId}`,
          metrics:
            'ga:totalEvents,ga:uniqueEvents,ga:eventValue,ga:avgEventValue',
          dimensions: 'ga:dimension1',
          sort: 'ga:totalEvents',
          'max-results': $topContentReportShowCount,
          'start-date': $dateRange.from,
          'end-date': $dateRange.to,
        },
      });

      report.on('success', (response) => {
        console.log(response);
        rows = response.rows || [];
        rows = rows.map((row) => {
          row.splice(1, 0, '-');
          return row;
        });
        loading = false;
      });

      report.execute();
    });
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
{:else if rows.length > 0}
  <DataTable>
    <Head>
      <Row>
        {#each tableConfig.columns as column}
          <Cell width={column.width} align={column.align}>{column.title}</Cell>
        {/each}
      </Row>
    </Head>
    <Body>
      {#each rows as cell, columnIndex}
        <Row>
          <Cell
            width={tableConfig.columns[0].width}
            align={tableConfig.columns[0].align}>
            <QueryLabel index={columnIndex + 1} expandable={false} />
            {cell[0]}
          </Cell>
          <Cell
            width={tableConfig.columns[1].width}
            align={tableConfig.columns[1].align}>
            {cell[1]}
          </Cell>
          <Cell
            width={tableConfig.columns[2].width}
            align={tableConfig.columns[2].align}>
            {cell[2]}
          </Cell>
          <Cell
            width={tableConfig.columns[3].width}
            align={tableConfig.columns[3].align}>
            {cell[3]}
          </Cell>
          <Cell
            width={tableConfig.columns[4].width}
            align={tableConfig.columns[4].align}>
            {cell[4]}
          </Cell>
          <Cell
            width={tableConfig.columns[5].width}
            align={tableConfig.columns[5].align}>
            {cell[5]}
          </Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
{:else}
  <NoDataPlaceholder />
{/if}
