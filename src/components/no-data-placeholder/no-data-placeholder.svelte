<script lang="ts">
  export let message: string = 'No data for the selected date range';
</script>

<style>
  div {
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>

<div class="no-data-container">
  <p>{message}</p>
</div>
