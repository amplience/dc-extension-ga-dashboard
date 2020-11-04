<script lang="ts">
  import Icon from '../../../icon/icon.svelte';

  export let title: string;
  export let icon: string;
  export let value: number | string;
  export let color: string;
</script>

<style>
  article {
    border: 1px solid #e5e5e5;
    padding: 14px;
    border-bottom: 6px solid var(--overview-card-color);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  article:not(:first-child) {
    margin-left: 32px;
  }

  .overview-card-top {
    display: flex;
    flex-direction: column;
    align-content: space-between;
  }

  .overview-card-heading {
    display: flex;
    justify-content: space-between;
  }

  .overview-card-title {
    display: flex;
  }

  .overview-card-title :global(svg) {
    color: var(--overview-card-color);
    width: 28px;
    height: 28px;
  }

  .overview-card-title h2 {
    margin-top: 3px;
    margin-left: 12px;
    font-size: 16px;
  }

  .overview-card-value {
    font-size: 32px;
    line-height: 32px;
  }

  .overview-card-content {
    color: #999;
    margin-right: 130px;
  }

  .overview-card-footer {
    display: flex;
    justify-content: flex-end;
  }
</style>

<article style="--overview-card-color: {color}">
  <div class="overview-card-top">
    <div class="overview-card-heading">
      <div class="overview-card-title">
        <Icon {icon} />
        <h2>{title}</h2>
      </div>
      <div class="overview-card-value">{value ? value : '-'}</div>
    </div>
    <div class="overview-card-content">
      <slot name="body" />
    </div>
  </div>
  <div class="overview-card-footer">
    <slot name="footer" />
  </div>
</article>
