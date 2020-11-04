<script lang="ts">
  import {
    SearchIndex,
    SearchesOrderBy,
    SearchIndexTopSearches,
  } from 'dc-management-sdk-js';
  import { dateRange } from '../../../../stores/date-range';
  import { includeReplicas, index } from '../../../../stores/search-index';
  import {
    Body,
    Cell,
    DataTable,
    ExpandableRow,
    Head,
    Row,
    Sort,
  } from '../../../data-table';
  import QueryCount from '../../../data-table/custom-cell-contents/query-count/query-count.svelte';
  import QueryLabel from '../../../data-table/custom-cell-contents/query-label/query-label.svelte';
  import DownloadCsv from '../../../download-csv/download-csv.svelte';
  import Loader from '../../../loader/loader.svelte';
  import NoDataPlaceholder from '../../../no-data-placeholder/no-data-placeholder.svelte';
  import { getTopHitsForCsv } from '../../top-results/services/get-top-hits.service';
  import { trackAction } from '../../../../services/google-analytics/google-analytics';
  import TopResultsTable from '../../top-results/table/top-results-table.svelte';
  import getTopSearches from '../services/get-top-searches.service';
  import { decimalFractionToPercentage } from '../../../../utils/percentages';
  import tableConfig from './table-config';
  import { topSearchesExpandedRows } from '../../../../stores/widget-settings';
  import InfoTip from '../../../info-tip/info-tip.svelte';

  export let limit: number;

  let orderBy: SearchesOrderBy = SearchesOrderBy.SEARCH_COUNT;
  let direction: 'asc' | 'desc' = 'desc';

  let topSearchesPromise: Promise<SearchIndexTopSearches[]>;

  async function onSortChange(sortOrder: SearchesOrderBy) {
    orderBy = sortOrder;
    direction = direction === 'desc' ? 'asc' : 'desc';
  }

  async function getHitsCsvData(search: string) {
    return getTopHitsForCsv($index, {
      search: search || undefined,
      startDate: $dateRange.from,
      endDate: $dateRange.to,
      includeReplicas: $includeReplicas,
    });
  }

  $: {
    topSearchesPromise = getTopSearches($index, {
      limit,
      orderBy,
      direction,
      startDate: $dateRange.from,
      endDate: $dateRange.to,
      includeReplicas: $includeReplicas,
    });
  }

  $: searchIndex = $index;

  const onExpandedRowClick = (
    event: Event & { detail: { expanded: boolean; id: string } }
  ) => {
    const state = new Set($topSearchesExpandedRows);
    if (event.detail.expanded) {
      trackAction('Top Searches - Expand row');
      state.add(event.detail.id);
    } else {
      state.delete(event.detail.id);
    }
    $topSearchesExpandedRows = [...new Set(state)];
  };

  const getExpandedRowStateFor = (rowId: string): boolean => {
    if ($topSearchesExpandedRows.indexOf(rowId) > -1) {
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
  :global(div[slot='table-footer'] .download-csv-button) {
    margin-right: 24px;
  }
  :global(div[slot='expandable-content'] .data-table-head > .data-table-row) {
    min-height: unset;
    height: unset;
  }
  :global(div[slot='expandable-content']
      .data-table-head
      > .data-table-row
      > .data-table-cell) {
    padding-top: 0px;
  }
</style>

{#await topSearchesPromise}
  <Loader />
{:then topSearches}
  {#if topSearches.length}
    <DataTable>
      <Head>
        <Row>
          {#each tableConfig.columns as column}
            <Cell
              width={column.width}
              align={column.align}
              color={orderBy === column.property ? '#666' : '#999'}>
              {column.title}
              {#if column.sortable}
                <Sort
                  property={column.property}
                  direction={column.property === orderBy ? direction : null}
                  onClick={(sortOrder) => onSortChange(sortOrder)} />
              {/if}
            </Cell>
          {/each}
        </Row>
      </Head>
      <Body>
        {#each topSearches as search, index}
          <ExpandableRow
            let:expanded
            expanded={getExpandedRowStateFor(search['search'])}
            id={search['search']}
            on:click={onExpandedRowClick}>
            <Cell
              width={tableConfig.columns[0].width}
              align={tableConfig.columns[0].align}>
              <QueryLabel
                showRowNumber={false}
                index={0}
                expandable={true}
                {expanded}>
                {search[tableConfig.columns[0].property]}
                {#if !search[tableConfig.columns[0].property]}
                  <InfoTip
                    content="A search performed to generate default results.
                    There is no user-entered query." />
                {/if}
              </QueryLabel>
            </Cell>
            <Cell
              width={tableConfig.columns[1].width}
              align={tableConfig.columns[1].align}>
              {search[tableConfig.columns[1].property] ? Math.round(search[tableConfig.columns[1].property]) : '-'}
            </Cell>
            <Cell
              width={tableConfig.columns[2].width}
              align={tableConfig.columns[2].align}>
              {search[tableConfig.columns[2].property] ? `${decimalFractionToPercentage(search[tableConfig.columns[2].property])}%` : '0%'}
            </Cell>
            <Cell
              width={tableConfig.columns[3].width}
              align={tableConfig.columns[3].align}>
              {search[tableConfig.columns[3].property] ? `${decimalFractionToPercentage(search[tableConfig.columns[3].property])}%` : '0%'}
            </Cell>
            <Cell
              width={tableConfig.columns[4].width}
              align={tableConfig.columns[4].align}>
              <QueryCount>{search['count']}</QueryCount>
            </Cell>
            <div slot="expandable-content">
              <TopResultsTable
                secondary={true}
                scrollable={false}
                search={search['search']}>
                <div slot="table-footer">
                  <DownloadCsv
                    label="Download all results"
                    fileName={`top_results_${search['search']}_${searchIndex.name}_${$dateRange.from}-${$dateRange.to}`}
                    fetchCsvData={() => getHitsCsvData(search['search'])}
                    on:downloadCsv={() => trackAction('Top Searches - Download')} />
                </div>
              </TopResultsTable>
            </div>
          </ExpandableRow>
        {/each}
      </Body>
    </DataTable>
  {:else}
    <NoDataPlaceholder />
  {/if}
{:catch}
  <NoDataPlaceholder />
{/await}
