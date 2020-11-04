<script lang="typescript">
  import Checkbox from '@smui/checkbox';

  export let checked: boolean;
  export let className: string;
  export let disabled: boolean = undefined;
  export let label: string;
</script>

<style>
  div.smui-checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  div.smui-checkbox :global(.checkbox.mdc-checkbox) {
    padding: 9px;
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
  }

  div.smui-checkbox :global(.checkbox.mdc-checkbox .mdc-checkbox__background) {
    top: 9px;
    left: 10px;
    width: 14px;
    height: 14px;
  }

  div.smui-checkbox
    :global(.checkbox.mdc-checkbox
      .mdc-checkbox__native-control:checked
      ~ .mdc-checkbox__background) {
    border-color: #039be5;
    background-color: #039be5;
  }

  div.smui-checkbox
    :global(.checkbox.mdc-checkbox
      .mdc-checkbox__native-control
      ~ .mdc-checkbox__background) {
    border-color: #808080;
  }

  div.smui-checkbox
    :global(.checkbox.mdc-checkbox
      .mdc-checkbox__native-control:disabled
      ~ .mdc-checkbox__background) {
    border-color: #e5e5e5;
  }

  div.smui-checkbox
    :global(.checkbox.mdc-checkbox
      .mdc-checkbox__native-control:checked:disabled
      ~ .mdc-checkbox__background) {
    border-color: #999;
    background-color: #999;
  }

  div.smui-checkbox
    :global(.checkbox.mdc-checkbox:hover:before, .checkbox.mdc-checkbox:before) {
    display: none;
  }

  label {
    color: #333;
  }

  label.disabled {
    opacity: 0.5;
  }
</style>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class={`smui-checkbox ${className || ''}`}>
  <Checkbox bind:checked class="checkbox" {disabled} />
  <label class:disabled={disabled ? 'disabled' : ''}>{label}</label>
</div>
