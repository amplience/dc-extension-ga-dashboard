<script lang="ts">
  import type { ReportData } from '../../../stores/gapi';
  import { ChartType } from '../../../stores/gapi';
  import { breakdownChart } from '../../../stores/google-analytics';
  import { reportTableExpandedRows } from '../../../stores/report-table-expanded-rows';

  import { Body, Cell, DataTable, Head, Row } from '../../data-table';
  import ExpandableRow from '../../data-table/expandable-row/expandable-row.svelte';
  import Loader from '../../loader/loader.svelte';
  import NoDataPlaceholder from '../../no-data-placeholder/no-data-placeholder.svelte';
  import DataChart from '../data-chart/data-chart.svelte';
  import type { TableConfig } from './table-config.interface';

  export let data: ReportData[];
  export let config: TableConfig;
  export let loading = false;
  export let dimension;

  const onExpandedRowClick = (
    event: Event & { detail: { expanded: boolean; id: string } }
  ) => {
    const state = new Set($reportTableExpandedRows[config.id]);
    if (event.detail.expanded) {
      state.add(event.detail.id);
    } else {
      state.delete(event.detail.id);
    }
    $reportTableExpandedRows[config.id] = [...new Set(state)];
  };

  const getExpandedRowStateFor = (rowId: string): boolean => {
    if ($reportTableExpandedRows[config.id]?.indexOf(rowId) > -1) {
      return true;
    }
    return false;
  };
</script>

<style>
  :global(div[slot='table-footer']) {
    display: flex;
    justify-content: flex-end;
    margin: 8px 0;
  }
  div[slot='expandable-content'] {
    margin: 0 28px;
  }
  div[slot='expandable-content'] :global(.title h2) {
    font-size: 1.2em;
  }
</style>

{#if loading}
  <Loader />
{/if}
{#if data && data.length > 0}
  <DataTable>
    <Head>
      <Row>
        {#each config.columns as column}
          <Cell width={column.width} align={column.align} color={'#999'}>
            {column.title}
          </Cell>
        {/each}
      </Row>
    </Head>
    <Body>
      {#each data as cells, rowIndex}
        <ExpandableRow
          let:expanded
          expanded={getExpandedRowStateFor(cells[0])}
          id={cells[0]}
          on:click={onExpandedRowClick}>
          {#each config.columns as column, columnIndex}
            <Cell width={column.width} align={column.align}>
              {#if column.component}
                <svelte:component
                  this={column.component}
                  value={cells[columnIndex]}
                  index={rowIndex}
                  {expanded} />
              {:else}{cells[columnIndex]}{/if}
            </Cell>
          {/each}
          <div slot="expandable-content">
            <DataChart
              className={'breakdown' + cells[0]}
              title="Breakdown"
              dimensions={$breakdownChart.dimension}
              chartType={ChartType.BAR}
              additionalFilters={[`ga:${dimension}==${cells[0]}`]} />
          </div>
        </ExpandableRow>
      {/each}
    </Body>
  </DataTable>
{:else if !loading}
  <NoDataPlaceholder />
{/if}
