<script lang="ts">
  import type { ReportData } from '../../../services/gapi/get-report-data.service';

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
          expandable={getBreakdownData !== undefined}
          id="{cells[0]}}">
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
            <BreakdownTable id={cells[0]} {getBreakdownData} />
          </div>
        </Row>
      {/each}
    </Body>
  </DataTable>
{:else}
  <NoDataPlaceholder />
{/if}
