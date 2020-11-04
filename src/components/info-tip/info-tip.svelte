<script lang="ts">
  import tippy from 'sveltejs-tippy';
  import Icon from '../icon/icon.svelte';
  import InfoIcon from '../../assets/icons/ic-asset-info.svg';

  export let content: string;
  export let placement = 'top';

  $: props = {
    content,
    appendTo: () => document.body,
    allowHTML: true,
    placement,
    trigger: 'click',
    theme: 'amplience',
    interactive: true,
  };
</script>

<style>
  :global(.tippy-box[data-theme~='amplience']) {
    border-color: #fff;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 8px 4px;
  }

  :global(.tippy-box[data-theme~='amplience'] .tippy-arrow) {
    left: 6px;
  }

  :global(.tippy-box[data-theme~='amplience'] .tippy-arrow::before) {
    transform: scale(1.2);
  }

  :global(.tippy-box[data-theme~='amplience'][data-placement^='top']
      > .tippy-arrow::before) {
    border-top-color: #fff;
  }
  :global(.tippy-box[data-theme~='amplience'][data-placement^='bottom']
      > .tippy-arrow::before) {
    border-bottom-color: #fff;
  }
  :global(.tippy-box[data-theme~='amplience'][data-placement^='left']
      > .tippy-arrow::before) {
    border-left-color: #fff;
  }
  :global(.tippy-box[data-theme~='amplience'][data-placement^='right']
      > .tippy-arrow::before) {
    border-right-color: #fff;
  }

  :global(.tippy-box[data-theme~='amplience'] p) {
    margin-top: 0;
  }

  div {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  div :global(svg) {
    color: #808080;
  }

  div:hover :global(svg) {
    color: #1ab0f9;
  }
</style>

<div
  data-testid="info-tip"
  use:tippy={props}
  on:click={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}>
  <Icon icon={InfoIcon} />
</div>
