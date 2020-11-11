<script>
  import ReportFilter from '../report-filter/report-filter.svelte';
</script>

<style>
  .top-bar {
    width: 100%;
    align-items: center;
    background-color: #fff;
    padding: 6px 0;
  }

  .container {
    justify-content: space-between;
    display: flex;
    margin: 0 auto;
    max-width: 1256px;
  }

  div.index-options {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  :global(div.selected-index) {
    margin-right: 24px;
  }
</style>

<section class="top-bar">
  <div class="container">
    <ReportFilter />
  </div>
</section>
