<script lang="ts">
  import OverviewCard from '../overview-card/overview-card.svelte';
  import SearchesIcon from '../../../../assets/icons/ic-asset-search.svg';
  import { counts, searchesPerUser } from '../../../../stores/counts';

  $: card = {
    title: 'Searches',
    icon: SearchesIcon,
    value: $counts?.searchesCount?.count,
    color: '#2f6e8c',
  };
</script>

<OverviewCard {...card}>
  <div slot="body">
    Number of searches performed and average number of searches per visit
  </div>
  <div slot="footer">{`${$searchesPerUser} searches for each user`}</div>
</OverviewCard>
