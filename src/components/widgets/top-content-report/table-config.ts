import ContentItemLabel from '../report-table/custom-cell-contents/content-item-label/content-item-label.svelte';
import CurrencyLabel from '../report-table/custom-cell-contents/currency-label/currency-label.svelte';
import PercentageLabel from '../report-table/custom-cell-contents/percent-label/percent-label.svelte';
import type { TableConfig } from '../report-table/table-config.interface';

const config: TableConfig = {
  id: 'top-content-report',
  columns: [
    {
      title: 'Content',
      width: '40%',
      component: ContentItemLabel,
    },
    {
      title: 'Total events',
      align: 'flex-end',
      width: '10%',
    },
    {
      title: '% Total events',
      width: '10%',
      component: PercentageLabel,
    },
    {
      title: 'Unique events',
      align: 'flex-end',
      width: '10%',
    },
    {
      title: '% Unique events',
      width: '10%',
      component: PercentageLabel,
    },
    {
      title: 'Event value',
      align: 'flex-end',
      width: '10%',
      component: CurrencyLabel,
    },
    {
      title: 'Avg event value',
      align: 'flex-end',
      width: '10%',
      component: CurrencyLabel,
    },
  ],
};

export default config;
