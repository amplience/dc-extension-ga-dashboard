<script lang="ts">
  import Widget from '../../widget/widget.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import UsersCountCard from './users-count-card/users-count-card.svelte';
  import SearchesCountCard from './searches-count-card/searches-count-card.svelte';
  import NoResultsRateCard from './no-results-rate-card/no-results-rate-card.svelte';
  import getUsersCount from './services/get-users-count.service';
  import getSearchesCount from './services/get-searches-count.service';
  import getNoResultsRate from './services/get-no-results-rate.service';
  import { includeReplicas, index } from '../../../stores/search-index';
  import { dateRange } from '../../../stores/date-range';
  import { counts } from '../../../stores/counts';
  import type { SearchIndex } from 'dc-management-sdk-js';
  import NoDataPlaceholder from '../../no-data-placeholder/no-data-placeholder.svelte';
  import Loader from '../../loader/loader.svelte';

  async function fetchCounts(
    index: SearchIndex,
    params: { includeReplicas: boolean; startDate: string; endDate: string }
  ) {
    try {
      const usersCount = await getUsersCount(index, params);
      const searchesCount = await getSearchesCount(index, params);
      const noResultsRate = await getNoResultsRate(index, params);

      counts.set({
        usersCount,
        searchesCount,
        noResultsRate,
      });
    } catch (e) {
      console.error('Unable to retrieve overview count data', e);
      throw e;
    }
  }

  $: countsPromise = fetchCounts($index, {
    includeReplicas: $includeReplicas,
    startDate: $dateRange.from,
    endDate: $dateRange.to,
  });
</script>

<style>
  section {
    background-color: #fff;
  }

  section :global(.widget-body) {
    min-height: unset;
    margin-bottom: 0;
  }

  section > :global(article) {
    padding: 30px;
    display: grid;
    grid-column-gap: 32px;
    min-height: 240px;
  }
</style>

<section class="overview">
  <Widget>
    <WidgetBody>
      {#await countsPromise}
        <Loader />
      {:then}
        <UsersCountCard />
        <SearchesCountCard />
        <NoResultsRateCard />
      {:catch}
        <NoDataPlaceholder />
      {/await}
    </WidgetBody>
  </Widget>
</section>
