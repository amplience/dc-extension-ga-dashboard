<script lang="ts">
  import type { SearchIndexTopHits } from 'dc-management-sdk-js';
  import { dateRange } from '../../../../stores/date-range';
  import { connection } from '../../../../stores/message-channel';
  import { includeReplicas, index } from '../../../../stores/search-index';
  import { formatDateAsISOString } from '../../../../utils/date-format';
  import { Body, Cell, DataTable, Head, Row } from '../../../data-table';
  import QueryLabel from '../../../data-table/custom-cell-contents/query-label/query-label.svelte';
  import ContentItemLink from '../../../content-item-link/content-item-link.svelte';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import getTopHits from '../services/get-top-hits.service';
  import tableConfig from './table-config';
  import InfoTip from '../../../info-tip/info-tip.svelte';

  export let secondary: boolean = false;
  export let scrollable: boolean = true;
  export let search: string = null;
  export let limit: number;

  let topHitsPromise: Promise<SearchIndexTopHits[]>;

  $: {
    topHitsPromise = getTopHits($index, {
      includeReplicas: $includeReplicas,
      limit,
      ...(search && { search }),
      startDate: $dateRange.from,
      endDate: $dateRange.to,
    });
  }
</script>

<style>
  div {
    width: 100%;
    min-height: 60px;
    display: flex;
    flex-direction: column;
  }
</style>

<div>
  {#await topHitsPromise}
    <Loader />
  {:then topHits}
    {#if topHits.length}
      <DataTable {secondary} {scrollable}>
        <Head>
          <Row>
            {#each tableConfig.columns as column}
              <Cell width={column.width} align={column.align} color="#999">
                {column.title}
                {#if secondary && column.helpText}
                  <InfoTip content={column.helpText} />
                {/if}
              </Cell>
            {/each}
          </Row>
        </Head>
        <Body>
          {#each topHits as hit, index}
            <Row>
              <Cell
                width={tableConfig.columns[0].width}
                align={tableConfig.columns[0].align}>
                <QueryLabel index={index + 1} expandable={false}>
                  <ContentItemLink
                    contentItemId={hit[tableConfig.columns[0].property]} />
                </QueryLabel>
              </Cell>
              <Cell
                width={tableConfig.columns[1].width}
                align={tableConfig.columns[1].align}>
                {hit[tableConfig.columns[1].property]}
              </Cell>
            </Row>
          {/each}
        </Body>
      </DataTable>
      <slot name="table-footer" />
    {:else}
      <NoDataPlaceholder />
    {/if}
  {:catch}
    <NoDataPlaceholder />
  {/await}
</div>
