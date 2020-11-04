<script lang="ts">
  import DateRangePicker from '../date-range-picker/date-range-picker.svelte';
  import { trackAction } from '../../services/google-analytics/google-analytics';
</script>

<style>
  section {
    background-color: #8da3d0;
    padding: 6px 45px;
  }

  .container {
    align-items: center;
    display: flex;
    margin: 0 auto;
    max-width: 1256px;
  }

  span {
    font-size: 15px;
    color: #fff;
    margin-right: 18px;
  }
</style>

<section class="date-range-bar">
  <div class="container">
    <span>Date range</span>
    <DateRangePicker on:dateSelected={() => trackAction('Change date range')} />
  </div>
</section>
