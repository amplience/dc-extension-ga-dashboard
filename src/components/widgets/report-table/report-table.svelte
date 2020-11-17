<script lang="ts">
  import type { ReportData } from '../../../stores/gapi';
  import { reportTableExpandedRows } from '../../../stores/report-table-expanded-rows';
  import { Body, Cell, DataTable, Head, Row } from '../../data-table';
  import Loader from '../../loader/loader.svelte';
  import NoDataPlaceholder from '../../no-data-placeholder/no-data-placeholder.svelte';
  import BreakdownTable from './breakdown-table/breakdown-table.svelte';
  import type { GetBreakdownData } from './breakdown-table/get-breakdown-data';
  import type { TableConfig } from './table-config.interface';

  export let data: ReportData[];
  export let config: TableConfig;
  export let loading = false;
  export let getBreakdownData: GetBreakdownData = undefined;
  export let breakdownTableConfig: TableConfig = undefined;

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
  div[slot='expandable-content'] :global(.title h2) {
    font-size: 1.2em;
  }
</style>

{#if loading}
  <Loader />
{:else if data && data.length > 0}
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
        <Row
          let:expanded
          expandable={getBreakdownData !== undefined && breakdownTableConfig !== undefined}
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
            <BreakdownTable
              id={cells[0]}
              {getBreakdownData}
              config={breakdownTableConfig} />
          </div>
        </Row>
      {/each}
    </Body>
  </DataTable>
{:else}
  <NoDataPlaceholder />
{/if}
