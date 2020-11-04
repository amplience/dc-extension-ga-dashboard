<script lang="ts">
  import OverviewCard from '../overview-card/overview-card.svelte';
  import SearchUserIcon from '../../../../assets/icons/ic-asset-search-users.svg';
  import { counts, searchesPerUser } from '../../../../stores/counts';
  import Link from '../../../link/link.svelte';

  const SEARCH_INDEX_DOCS = `__DOCS_BASE_URL__/intro/searchdashboard.html`;

  $: card = {
    title: 'Users',
    icon: SearchUserIcon,
    value: $counts?.usersCount?.count,
    color: '#8c2f87',
  };
</script>

<OverviewCard {...card}>
  <div slot="body">
    {#if $searchesPerUser > 100}
      The number of users is unusually low. This could mean additional
      information needs to be sent with your search queries.
      <Link href={SEARCH_INDEX_DOCS} linkTarget="_blank" text="See our docs." />
    {:else}Number of unique users who performed a search{/if}
  </div>
</OverviewCard>
