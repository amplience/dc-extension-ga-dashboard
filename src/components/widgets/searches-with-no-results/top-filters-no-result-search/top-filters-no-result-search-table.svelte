<script lang="ts">
  import type {
    SearchIndex,
    SearchIndexTopFiltersNoResultSearch,
    SearchIndexTopFiltersNoResultSearchValue,
  } from 'dc-management-sdk-js';
  import { DataTable, Head, Body, Row, Cell } from '../../../data-table';
  import { index, includeReplicas } from '../../../../stores/search-index';
  import { connection } from '../../../../stores/message-channel';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import getTopFiltersNoResultSearch from './services/top-filters-no-result-search.service';
  import tableConfig from './table-config';
  import { dateRange } from '../../../../stores/date-range';
  import InfoTip from '../../../info-tip/info-tip.svelte';

  export let scrollable: boolean = true;
  export let search: string;
  export let limit: number;

  let topFiltersPromise: Promise<SearchIndexTopFiltersNoResultSearch[]>;

  function onContentItemClick(contentItemId: string) {
    $connection.emit('content-item-redirect', contentItemId);
  }
  $: {
    topFiltersPromise = getTopFiltersNoResultSearch($index, {
      search,
      startDate: $dateRange.from,
      endDate: $dateRange.to,
      includeReplicas: $includeReplicas,
      limit,
    });
  }

  const formatFilterValue = (
    filters: SearchIndexTopFiltersNoResultSearchValue[]
  ) =>
    filters
      .map((filter) => `${filter.attribute} ${filter.operator} ${filter.value}`)
      .join(', ');
</script>

<style>
  div {
    width: 100%;
  }
  div.filter-values {
    align-items: center;
    padding: 7px 14px;
    color: #333;
    position: relative;
    text-align: left;
  }

  span.filter-value {
    background-color: #f2f2f2;
    border-radius: 1rem;
    padding: 0.5rem;
    margin-right: 0.5rem;
    margin-top: 0.1rem;
    word-wrap: break-word;
    display: inline-block;
  }
  span.filter-value:last-child {
    margin-right: 0;
  }
  span.filter-value-attribute {
    font-weight: bold;
  }

  :global(div[slot='table-footer']) {
    display: flex;
    justify-content: flex-end;
    margin: 8px 0;
  }
</style>

<div>
  {#await topFiltersPromise}
    <Loader />
  {:then topFilters}
    {#if topFilters.length}
      <DataTable {scrollable} secondary={true}>
        <Head>
          <Row>
            {#each tableConfig.columns as column}
              <Cell width={column.width} align={column.align} color="#999">
                {column.title}
                {#if column.helpText}
                  <InfoTip content={column.helpText} />
                {/if}
              </Cell>
            {/each}
          </Row>
        </Head>
        <Body>
          {#each topFilters as row, index}
            <Row>
              <div class="filter-values">
                {#each row[tableConfig.columns[0].property] as { attribute, operator, value }}
                  <span class="filter-value">
                    <span class="filter-value-attribute">{attribute}</span>
                    <span>{operator}</span>
                    <span>{value}</span>
                  </span>
                {/each}
              </div>
              <Cell
                width={tableConfig.columns[1].width}
                align={tableConfig.columns[1].align}>
                {row[tableConfig.columns[1].property]}
              </Cell>
            </Row>
          {/each}
        </Body>
      </DataTable>
      <slot name="table-footer" />
    {:else}
      <NoDataPlaceholder message="No facets for the selected date range" />
    {/if}
  {:catch}
    <NoDataPlaceholder message="No facets for the selected date range" />
  {/await}
</div>
