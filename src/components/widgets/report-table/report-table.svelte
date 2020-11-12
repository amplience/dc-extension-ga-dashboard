<script lang="ts">
  import type { ReportData } from '../../../stores/gapi';

  import { Body, Cell, DataTable, Head, Row } from '../../data-table';
  import Loader from '../../loader/loader.svelte';
  import NoDataPlaceholder from '../../no-data-placeholder/no-data-placeholder.svelte';
  import type { TableConfig } from '../top-editions-report/table-config';

  export let data: ReportData[];
  export let config: TableConfig;
  export let loading = false;
</script>

<style>
  :global(div[slot='table-footer']) {
    display: flex;
    justify-content: flex-end;
    margin: 8px 0;
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
        <Row>
          {#each config.columns as column, columnIndex}
            <Cell width={column.width} align={column.align}>
              {#if column.component}
                <svelte:component
                  this={column.component}
                  value={cells[columnIndex]}
                  index={rowIndex} />
              {:else}{cells[columnIndex]}{/if}
            </Cell>
          {/each}
        </Row>
      {/each}
    </Body>
  </DataTable>
{:else}
  <NoDataPlaceholder />
{/if}
