<script lang="ts">
  export let zIndex: number = 2;
  export let onClick;
</script>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
</style>

<div
  on:click={onClick}
  style={zIndex ? `z-index: ${zIndex}` : ''}
  data-testid="overlay" />
