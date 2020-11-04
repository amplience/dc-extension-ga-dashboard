<script lang="ts">
  export let width: string = '100%';
  export let align: string = 'start';
  export let color: string = '#333';
</script>

<style>
  .data-table-cell {
    display: flex;
    align-items: center;
    padding: 7px 14px;
    position: relative;
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<div
  class="data-table-cell"
  style="
  {`max-width:${width};`}
  {`justify-content:${align};`}
  {`color:${color};`}">
  <slot />
</div>
