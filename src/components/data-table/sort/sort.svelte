<script lang="ts">
  export let onClick: (property) => void;
  export let property: string;
  export let direction: 'asc' | 'desc' | null;
</script>

<style>
  .data-table-sort {
    top: 4px;
    transform: rotate(0deg);
    height: 0;
    width: 0;
    content: '';
    display: inline-block;
    border: 3.5px solid transparent;
    border-top-color: #999;
    transition: border-color 0.3s;
    margin-left: 10px;
    position: relative;
  }

  .data-table-sort.asc {
    top: 2px;
    transform: rotate(180deg);
  }

  .data-table-sort-click-area {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

<div class="data-table-sort {direction}" />
<div
  data-testid="data-table-sort-click-area"
  class="data-table-sort-click-area"
  on:click={() => onClick(property)} />
