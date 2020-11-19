<script lang="ts">
  import type { ReportData } from '../../../../stores/gapi';
  import { Body, Cell, DataTable, Row } from '../../../data-table';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import ChipLabel from '../custom-cell-contents/chip-label/chip-label.svelte';
  import CurrencyLabel from '../custom-cell-contents/currency-label/currency-label.svelte';
  import type { TableConfig } from '../table-config.interface';
  import type { GetBreakdownData } from './get-breakdown-data';
  import { backOff } from 'exponential-backoff';

  export let id: string;
  export let getBreakdownData: GetBreakdownData;

  let data: ReportData[];
  let loading = true;

  $: (async () => {
    try {
      loading = true;
      data = await backOff(() => getBreakdownData(id));
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
  :global(.data-table-slot.secondary
      .data-table-row
      .data-table-cell:first-child) {
    padding-left: 56px;
  }

  :global(.data-table-slot.secondary) {
    margin-bottom: 7px;
  }
</style>

{#if loading}
  <div class="loader">
    <Loader />
  </div>
{/if}
{#if data && data.length > 0}
  <DataTable secondary={true}>
    <Body>
      {#each data as cells, rowIndex}
        <Row>
          <Cell width="40%">
            <ChipLabel value={cells[0]} />
          </Cell>
          <Cell width="10%" align="flex-end">{cells[2]}% ({cells[1]})</Cell>
          <Cell width="10%">&nbsp;</Cell>
          <Cell width="10%" align="flex-end">{cells[4]}% ({cells[3]})</Cell>
          <Cell width="10%">&nbsp;</Cell>
          <Cell width="10%" align="flex-end">
            <CurrencyLabel value={cells[5]} />
          </Cell>
          <Cell width="10%" align="flex-end">
            <CurrencyLabel value={cells[6]} />
          </Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
{:else if !loading}
  <NoDataPlaceholder />
{/if}
