import { SearchesOrderBy } from 'dc-management-sdk-js';

interface TableConfigColumn {
  title: string;
  property: string;
  sortable?: boolean;
  width?: string;
  align?: string;
}

interface TopSearchesTableConfig {
  columns: TableConfigColumn[];
}

const config: TopSearchesTableConfig = {
  columns: [
    {
      title: 'Search term',
      property: 'search',
    },
    {
      title: 'Click pos.',
      sortable: true,
      property: SearchesOrderBy.AVERAGE_CLICK_POSITION,
      width: '15%',
      align: 'flex-end',
    },
    {
      title: 'CTR',
      sortable: true,
      property: SearchesOrderBy.CLICK_THROUGH_RATE,
      width: '15%',
      align: 'flex-end',
    },
    {
      title: 'Conversion',
      sortable: true,
      property: SearchesOrderBy.CONVERSION_RATE,
      width: '15%',
      align: 'flex-end',
    },
    {
      title: 'Count',
      sortable: true,
      property: SearchesOrderBy.SEARCH_COUNT,
      width: '15%',
      align: 'flex-end',
    },
  ],
};

export default config;
