<script lang="ts">
  import OverviewCard from '../overview-card/overview-card.svelte';
  import NoResultsIcon from '../../../../assets/icons/ic-asset-no-results.svg';
  import { counts, searchesPerUser } from '../../../../stores/counts';
  import Link from '../../../link/link.svelte';
  import { decimalFractionToPercentage } from '../../../../utils/percentages';

  const SEARCH_INDEX_DOCS = `__DOCS_BASE_URL__/intro/dashboard.html`;

  $: card = {
    title: 'No results rate',
    icon: NoResultsIcon,
    value: $counts?.noResultsRate?.rate
      ? `${decimalFractionToPercentage($counts?.noResultsRate?.rate)}%`
      : undefined,
    color: '#cd69a3',
  };
</script>

<OverviewCard {...card}>
  <div slot="body">Percentage of searches for which no results were found</div>
</OverviewCard>
