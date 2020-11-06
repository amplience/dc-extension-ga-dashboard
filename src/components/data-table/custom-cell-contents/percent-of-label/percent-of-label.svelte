<script lang="ts">
  export let value: number;
  export let total: number;

  const percent = Math.round((value / total) * 100);
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
    <div class="percent-bar-marker" style="width: {percent}%" />
    <div class="percent-value">{percent}%</div>
  </div>
</div>
