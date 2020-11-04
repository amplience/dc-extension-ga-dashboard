<script lang="ts">
  export let onClick;
  export let label: string;
  export let active: boolean = false;
</script>

<style>
  span {
    background-color: #f2f2f2;
    cursor: pointer;
    padding: 4px 8px;
    margin-right: 12px;
    border-radius: 12px;
  }

  span:last-child {
    margin-right: 0;
  }

  span:hover {
    background-color: #badff9;
  }

  span.active {
    background-color: #039be5;
    color: #fff;
  }
</style>

<span data-testid="chip" on:click={onClick} class={active ? 'active' : ''}>
  {label}
</span>
