<script lang="typescript">
  import Select, { Option } from '@smui/select';
  import { createEventDispatcher, onMount } from 'svelte';

  interface option {
    key: string | number;
    value: string | number;
  }

  export let className: string;
  export let options: option[] = [];
  export let selectedOption: unknown;
  export let label: string;

  let loading = true;

  $: selectedOption = handleSelectedOption(selectedOption);

  const dispatch = createEventDispatcher();

  function handleSelectedOption(option: Option.key) {
    if (!loading) {
      dispatch('change', option);
    }
    return option;
  }

  onMount(() => {
    loading = false;
  });
</script>

<style>
  .select {
    display: flex;
    align-items: center;
    color: #999;
  }

  .select :global(.mdc-select) {
    margin-left: 10px;
    height: 50px;
  }

  .select :global(.mdc-select__selected-text, .mdc-line-ripple) {
    border-bottom: none;
    padding-top: 15px;
  }

  .select :global(.mdc-line-ripple) {
    display: none;
  }

  :global(.mdc-menu.mdc-menu-surface) {
    border-radius: 0;
  }

  :global(.mdc-menu .mdc-list-item) {
    color: #333;
    height: 32px;
  }

  :global(.mdc-select__menu
      .mdc-list
      .mdc-list-item--selected.mdc-ripple-upgraded) {
    color: #039be5;
  }

  .select :global(.mdc-select__selected-text:hover) {
    color: #333;
  }

  .select :global(.mdc-select:hover .mdc-select__dropdown-icon) {
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='333' fill-rule='evenodd' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
      no-repeat 50%;
  }

  .select :global(.mdc-select__dropdown-icon) {
    bottom: 13px;
  }

  @-moz-document url-prefix() {
    :global(.mdc-select__native-control, .mdc-select__selected-text) {
      text-indent: 0 !important;
    }
  }
</style>

<div class="select {className}">
  <span>{label}</span>
  <Select label={null} class="smui-select" enhanced bind:value={selectedOption}>
    {#each options as option}
      <Option value={option.value} selected={selectedOption === option.value}>
        {option.key}
      </Option>
    {/each}
  </Select>
</div>
