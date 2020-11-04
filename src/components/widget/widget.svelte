<script lang="ts">
  import Loader from '../loader/loader.svelte';
  export let loading: boolean = false;
</script>

<style>
  article {
    height: 100%;
    position: relative;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-content: stretch;
  }
</style>

<article>
  {#if loading}
    <Loader />
  {/if}
  <slot />
</article>
