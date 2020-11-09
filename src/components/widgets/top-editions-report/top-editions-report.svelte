<script lang="ts">
  import { topContentReportShowCount } from '../../../stores/widget-settings';
  import Select from '../../select/select.svelte';
  import WidgetBody from '../../widget/widget-body/widget-body.svelte';
  import WidgetHeader from '../../widget/widget-header/widget-header.svelte';
  import Widget from '../../widget/widget.svelte';
  import { SIZES } from '../widgets-config';
  import TopEditionsReportTable from './table/top-editions-report-table.svelte';
</script>

<style>
  section {
    overflow: hidden;
  }

  section :global(.top-editions-report-sizes-select > .smui-select) {
    width: 40px;
  }
</style>

<section class="top-editions-report">
  <Widget>
    <WidgetHeader title="Top editions">
      <div slot="actions">
        <Select
          className="top-editions-report-sizes-select"
          label="Show"
          bind:selectedOption={$topContentReportShowCount}
          options={Array.from(SIZES.keys()).map((size) => ({
            key: size,
            value: size,
          }))} />
      </div>
    </WidgetHeader>
    <WidgetBody>
      <TopEditionsReportTable />
    </WidgetBody>
  </Widget>
</section>
