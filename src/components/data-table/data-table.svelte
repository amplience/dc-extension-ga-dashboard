<script lang="ts">
  export let secondary: boolean = false;
  export let scrollable: boolean = true;
</script>

<style>
  .data-table {
    width: 100%;
  }

  .data-table-slot.secondary :global(.data-table-row) {
    border-bottom: none;
  }

  :global(.data-table-slot.secondary .data-table-row:last-child) {
    border-bottom: none;
  }
</style>

<div class="data-table">
  <div
    class="data-table-slot {secondary ? 'secondary' : ''}
    {scrollable ? 'scrollable' : ''}">
    <slot />
  </div>
</div>
