<script lang="ts">
  import Icon from '../icon/icon.svelte';
  import ExpandableIcon from '../../assets/icons/ic-expandable.svg';
  import ContractableIcon from '../../assets/icons/ic-contractable.svg';

  export let expanded: boolean;
</script>

<style>
  div {
    margin: auto 0;
  }
  div,
  div > :global(svg) {
    fill: #333;
    width: 24px;
    height: 24px;
  }
</style>

<div data-testid="expandable-icon">
  <Icon icon={expanded ? ContractableIcon : ExpandableIcon} />
</div>
