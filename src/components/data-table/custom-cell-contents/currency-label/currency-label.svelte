<script lang="ts">
  import { locale, currencyCode } from '../../../../stores/localization';
  export let value: number;

  const formatter = new Intl.NumberFormat($locale, {
    style: 'currency',
    currency: $currencyCode,
    minimumFractionDigits: 2,
  });
</script>

<div>{formatter.format(value)}</div>
