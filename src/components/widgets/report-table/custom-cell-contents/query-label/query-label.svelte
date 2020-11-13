<script lang="ts">
  import ExpandableIcon from '../../../../expandable-icon/expandable-icon.svelte';

  export let index: number;
  export let expandable: boolean = false;
  export let expanded: boolean = false;
  export let showRowNumber: boolean = true;
</script>

<style>
  .query-label {
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .query-index {
    color: #8da3d0;
    min-width: 18px;
  }
</style>

{#if expandable}
  <ExpandableIcon {expanded} />
{/if}

{#if showRowNumber}<span class="query-index">{index}</span>{/if}

<div class="query-label">
  <slot />
</div>
