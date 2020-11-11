<script lang="ts">
  export let zIndex: number = 2;
  export let onClick;

  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      onClick();
    }
  };
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

<svelte:window on:keydown={onKeydown} />

<div
  on:click={onClick}
  style={zIndex ? `z-index: ${zIndex}` : ''}
  data-testid="overlay" />
