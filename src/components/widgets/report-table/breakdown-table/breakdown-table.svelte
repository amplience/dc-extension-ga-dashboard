<script lang="ts">
  import type { ReportData } from '../../../../stores/gapi';
  import { Body, Cell, DataTable, Head, Row } from '../../../data-table';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import type { TableConfig } from '../table-config.interface';
  import type { GetBreakdownData } from './get-breakdown-data';

  export let config: TableConfig;
  export let id: string;
  export let getBreakdownData: GetBreakdownData;

  let data: ReportData[];
  let loading = true;

  $: (async () => {
    try {
      loading = true;
      data = await getBreakdownData(id);
    } catch (e) {
      console.error(`Unable to get report data: ${e?.error?.message}`);
      data = [];
    } finally {
      loading = false;
    }
  })();
</script>

<style>
  .loader {
    min-height: 50px;
  }
</style>

{#if loading}
  <div class="loader">
    <Loader />
  </div>
{/if}
{#if data && data.length > 0}
  <DataTable secondary={true}>
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
{:else if !loading}
  <NoDataPlaceholder />
{/if}
