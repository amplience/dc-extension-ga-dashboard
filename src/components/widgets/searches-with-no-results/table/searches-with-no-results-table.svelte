<script lang="ts">
  import { onDestroy } from 'svelte';
  import type {
    SearchIndex,
    SearchIndexTopHits,
    SearchIndexSearchesWithNoResults,
  } from 'dc-management-sdk-js';
  import { DataTable, Head, Body, Row, Cell } from '../../../data-table';
  import { index, includeReplicas } from '../../../../stores/search-index';
  import QueryLabel from '../../../data-table/custom-cell-contents/query-label/query-label.svelte';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import tableConfig from './table-config';
  import getSearchesWithNoResults from '../services/get-searches-with-no-results.service';
  import { trackAction } from '../../../../services/google-analytics/google-analytics';
  import ExpandableRow from '../../../data-table/expandable-row/expandable-row.svelte';
  import TopFiltersNoResultSearchTable from '../top-filters-no-result-search/top-filters-no-result-search-table.svelte';
  import DownloadCsv from '../../../download-csv/download-csv.svelte';
  import { getTopFiltersNoResultSearchForCsv } from '../top-filters-no-result-search/services/top-filters-no-result-search.service';
  import { dateRange } from '../../../../stores/date-range';
  import { noResultsExpandedRows } from '../../../../stores/widget-settings';

  export let secondary: boolean = false;
  export let scrollable: boolean = true;
  export let search: string = null;
  export let limit: number;

  const subscriptions: (() => void)[] = [];
  let searchesWithNoResultsPromise: Promise<SearchIndexSearchesWithNoResults[]>;

  $: {
    searchesWithNoResultsPromise = getSearchesWithNoResults($index, {
      startDate: $dateRange.from,
      endDate: $dateRange.to,
      includeReplicas: $includeReplicas,
      limit,
      ...(search && { search }),
    });
  }

  const onExpandedRowClick = (
    event: Event & { detail: { expanded: boolean; id: string } }
  ) => {
    const state = new Set($noResultsExpandedRows);
    if (event.detail.expanded) {
      trackAction('No Results - Expand row');
      state.add(event.detail.id);
    } else {
      state.delete(event.detail.id);
    }
    $noResultsExpandedRows = [...new Set(state)];
  };

  const getExpandedRowStateFor = (rowId: string): boolean => {
    if ($noResultsExpandedRows.indexOf(rowId) > -1) {
      return true;
    }
    return false;
  };
</script>

<style>
  div {
    width: 100%;
  }
  span.filtered-count {
    padding-left: 0.75em;
    color: #999;
    font-weight: normal;
  }
</style>

<div>
  {#await searchesWithNoResultsPromise}
    <Loader />
  {:then searchesWithNoResults}
    {#if searchesWithNoResults.length}
      <DataTable {secondary} {scrollable}>
        <Head>
          <Row>
            {#each tableConfig.columns as column}
              <Cell width={column.width} align={column.align} color="#999">
                {column.title}
              </Cell>
            {/each}
          </Row>
        </Head>
        <Body>
          {#each searchesWithNoResults as result, resultIndex}
            <ExpandableRow
              let:expanded
              expanded={getExpandedRowStateFor(result['search'])}
              id={result['search']}
              on:click={onExpandedRowClick}>
              <Cell
                width={tableConfig.columns[0].width}
                align={tableConfig.columns[0].align}>
                <QueryLabel
                  index={resultIndex + 1}
                  expandable={true}
                  {expanded}>
                  {result[tableConfig.columns[0].property]}
                </QueryLabel>
              </Cell>
              <Cell
                width={tableConfig.columns[1].width}
                align={tableConfig.columns[1].align}>
                {result[tableConfig.columns[1].property]}
                <span class="filtered-count">
                  of which {result[tableConfig.columns[1].subProperty]} faceted
                </span>
              </Cell>
              <div slot="expandable-content">
                <TopFiltersNoResultSearchTable
                  scrollable={false}
                  search={result['search']}>
                  <div slot="table-footer">
                    <DownloadCsv
                      label="Download all facets"
                      fileName={`top_facets_${result['search']}_${$index.name}_${$dateRange.from}-${$dateRange.to}`}
                      fetchCsvData={() => getTopFiltersNoResultSearchForCsv(
                          $index,
                          {
                            search: result['search'],
                            startDate: $dateRange.from,
                            endDate: $dateRange.to,
                          }
                        )}
                      on:downloadCsv={() => trackAction('No Results - Download')} />
                  </div>
                </TopFiltersNoResultSearchTable>
              </div>
            </ExpandableRow>
          {/each}
        </Body>
      </DataTable>
      <slot name="top-results-table-footer" />
    {:else}
      <NoDataPlaceholder />
    {/if}
  {:catch}
    <NoDataPlaceholder />
  {/await}
</div>
