<script lang="ts">
  import DeleteIcon from '../../assets/icons/ic-delete.svg';
  import { createEventDispatcher } from 'svelte';
  import Icon from '../icon/icon.svelte';
  export let label: string;
  export let active: boolean = false;
  export let removeable: boolean = false;
  export let clickable: boolean = false;

  $: chipClass = [
    active ? 'active' : undefined,
    clickable ? 'clickable' : undefined,
    removeable ? 'removeable' : undefined,
  ]
    .filter((v) => !undefined)
    .join(' ');

  const dispatch = createEventDispatcher();

  const onChipClick = () => dispatch('click');
  const onCloseClick = (event: Event) => {
    event.cancelBubble = true;
    dispatch('close');
  };
</script>

<style>
  div {
    min-width: 0;
    display: flex;
    background-color: hsl(0, 0%, 95%);
    padding: 6px 8px;
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

  div.removeable > span.label {
    padding: 0 6px;
  }

  div.clickable:hover {
    background-color: #badff9;
  }
  span.cross {
    cursor: pointer;
    font-weight: bold;
    padding: 0 6px;
  }

  span.cross :global(div) {
    position: relative;
    top: 2px;
  }
</style>

<div data-testid="chip" on:click={onChipClick} class={chipClass}>
  <span class="label"> {label} </span>
  {#if removeable}
    <span
      data-testid="remove-chip-button"
      class="cross"
      on:click={onCloseClick}>
      <Icon icon={DeleteIcon} width="12px" height="12px" />
    </span>
  {/if}
</div>
