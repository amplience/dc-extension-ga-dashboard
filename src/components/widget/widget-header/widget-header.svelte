<script lang="ts">
  export let title: string = undefined;
</script>

<style>
  section {
    padding: 0px 15px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  h2 {
    font-size: 18px;
    color: #333;
    margin-right: 6px;
  }

  .title {
    display: flex;
    flex-direction: row;
  }

  .title :global([slot='help']) {
    margin: auto;
  }

  .actions :global([slot='actions']) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .actions :global([slot='actions'] button) {
    margin-right: 22px;
  }
</style>

<section class="widget-header">
  <div class="title">
    {#if title}
      <h2>{title}</h2>
    {/if}
    <slot name="help" />
    <slot name="title" />
  </div>
  <div class="actions">
    <slot name="actions" />
  </div>
</section>
