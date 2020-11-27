<script lang="ts">
  export let onClick;
  export let button: HTMLButtonElement = null;
  export let primary: boolean = true;
  export let disabled: boolean = false;
</script>

<style>
  button {
    cursor: pointer;
    border: 0;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    padding: 0 20px;
    margin: 0 8px;
    background-color: transparent;
    transition: 0.3s;
    color: #333333;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 3px;
  }

  button:hover {
    color: #1ab0f9;
  }

  button.primary {
    background-color: #039be5;
    color: #fff;
  }

  button.primary:hover {
    background-color: #1ab0f9;
    color: #fff;
  }

  button[disabled]:hover,
  button[disabled] {
    background-color: #e5e5e5;
    color: #bfbfbf;
    cursor: default;
  }
</style>

<button
  data-testid="button"
  on:click={onClick}
  bind:this={button}
  {disabled}
  class={primary ? 'primary' : ''}>
  <slot />
</button>
