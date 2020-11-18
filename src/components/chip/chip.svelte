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
  div {
    min-width: 0;
    display: flex;
    background-color: hsl(0, 0%, 95%);
    padding: 4px 8px;
    border-radius: 12px;
    margin-right: 12px;
  }

  span.label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div.active {
    background-color: #039be5;
    color: #fff;
  }
  div.clickable {
    cursor: pointer;
  }
  div.clickable:hover {
    background-color: #badff9;
  }
  span.cross {
    cursor: pointer;
    font-weight: bold;
    padding: 0 8px;
  }

  span.cross :global(div) {
    position: relative;
    top: 2px;
  }
</style>

{#if removeable}
  <div data-testid="chip" on:click={onChipClick} class={active ? 'active' : ''}>
    <span class="label"> {label} </span>
    <span
      data-testid="remove-chip-button"
      class="cross"
      on:click={onCloseClick}>
      <Icon icon={DeleteIcon} width="12px" height="12px" />
    </span>
  </div>
{:else}
  <div
    data-testid="chip"
    on:click={onChipClick}
    class={active ? 'active clickable' : 'clickable'}>
    <span> {label} </span>
  </div>
{/if}
