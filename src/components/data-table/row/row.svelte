<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ExpandableIcon from '../../expandable-icon/expandable-icon.svelte';

  export let id: string = undefined;
  export let expandable: boolean = false;
  export let expanded: boolean = false;

  const dispatch = createEventDispatcher();
  async function onClick() {
    const eventDetail = { id };
    if (expandable) {
      expanded = !expanded;
      eventDetail['expanded'] = expanded;
    }
    dispatch('click', eventDetail);
  }
</script>

<style>
  .data-table-row {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    min-height: 40px;
  }

  .data-table-row.expandable {
    flex-direction: column;
    max-height: 600px;
    justify-content: center;
  }

  .row-content {
    display: flex;
    width: 100%;
    min-height: 39px;
  }

  .data-table-row.expandable > .row-content {
    cursor: pointer;
  }

  .expandable-content {
    position: relative;
    transition: opacity 0.6s ease-out;
    opacity: 0;
    height: 0;
  }

  .data-table-row.expanded .expandable-content {
    opacity: 1;
    height: auto;
  }
</style>

<div
  class="data-table-row {expandable ? 'expandable' : ''} {expanded ? 'expanded' : ''}">
  <div class="row-content" on:click={onClick} data-testid="row-content">
    {#if expandable}
      <ExpandableIcon {expanded} />
    {/if}
    <slot {expandable} {expanded} />
  </div>
  {#if expandable}
    <div class="expandable-content" data-testid="expandable-content">
      {#if expanded}
        <slot name="expandable-content" />
      {/if}
    </div>
  {/if}
</div>
