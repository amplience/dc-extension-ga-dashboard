<script lang="ts">
  export let index: number;
  export let value: number;
  export let expanded: boolean;
</script>

<style>
  div {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .percent-bar-marker {
    background-color: #8da3d0;
  }
  .percent-value {
    padding-left: 4px;
  }
</style>

<div>
  <div class="percent-bar">
    <div class="percent-bar-marker" style="width: {value}%" />
    <div class="percent-value">{value}%</div>
  </div>
</div>
