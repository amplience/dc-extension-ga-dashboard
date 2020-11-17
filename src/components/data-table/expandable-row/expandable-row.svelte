<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ExpandableIcon from '../../expandable-icon/expandable-icon.svelte';

  export let id: string = undefined;
  export let expanded: boolean = false;

  const dispatch = createEventDispatcher();
  async function onClick() {
    expanded = !expanded;
    dispatch('click', {
      expanded,
      id,
    });
  }
</script>

<style>
  .data-table-expandable-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #e5e5e5;
    min-height: 40px;
    max-height: 600px;
    justify-content: center;
  }

  .row-content {
    display: flex;
    width: 100%;
    min-height: 39px;
    cursor: pointer;
  }

  .expandable-content {
    position: relative;
    transition: opacity 0.6s ease-out;
    opacity: 0;
    height: 0;
  }

  .data-table-expandable-row.expanded .expandable-content {
    opacity: 1;
    height: auto;
  }
</style>

<div class="data-table-expandable-row {expanded ? 'expanded' : ''}">
  <div class="row-content" on:click={onClick} data-testid="row-content">
    <ExpandableIcon {expanded} />
    <slot {expanded} />
  </div>
  <div class="expandable-content">
    {#if expanded}
      <slot name="expandable-content" />
    {/if}
  </div>
</div>
