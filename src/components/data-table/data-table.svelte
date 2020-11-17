<script lang="ts">
  export let secondary: boolean = false;
  export let scrollable: boolean = true;
</script>

<style>
  .data-table {
    width: 100%;
  }

  .data-table-slot.secondary {
    margin: 0 14px 0 14px;
    padding: 0 14px 14px 14px;
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
