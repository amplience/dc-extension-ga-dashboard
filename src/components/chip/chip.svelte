<script lang="ts">
  import DeleteIcon from '../../assets/icons/ic-delete.svg';
  import { createEventDispatcher } from 'svelte';
  import Icon from '../icon/icon.svelte';
  export let label: string;
  export let active: boolean = false;
  export let removeable: boolean = false;

  const dispatch = createEventDispatcher();

  const onChipClick = () => dispatch('click');
  const onCloseClick = () => dispatch('close');
</script>

<style>
  span {
    background-color: hsl(0, 0%, 95%);
    padding: 4px 8px;
    margin-right: 12px;
    border-radius: 12px;
  }

  span:last-child {
    margin-right: 0;
  }
  span.active {
    background-color: #039be5;
    color: #fff;
  }
  span.clickable {
    cursor: pointer;
  }
  span.clickable:hover {
    background-color: #badff9;
  }
  span.cross {
    cursor: pointer;
    font-weight: bold;
  }

  span.cross :global(div) {
    position: relative;
    top: 2px;
  }
</style>

{#if removeable}
  <span
    data-testid="chip"
    on:click={onChipClick}
    class={active ? 'active' : ''}>
    {label}
    <span class="cross" on:click={onCloseClick}>
      <Icon icon={DeleteIcon} width="12px" height="12px" />
    </span>
  </span>
{:else}
  <span
    data-testid="chip"
    on:click={onChipClick}
    class={active ? 'active clickable' : 'clickable'}>
    {label}
  </span>
{/if}
