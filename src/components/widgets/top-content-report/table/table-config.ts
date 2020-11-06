interface TableConfigColumn {
  title: string;
  dataType?: string;
  width?: string;
  align?: string;
}

interface TopContentReportTableConfig {
  columns: TableConfigColumn[];
}

const config: TopContentReportTableConfig = {
  columns: [
    {
      title: 'Content',
      dataType: 'CONTENT_ITEM_ID',
      width: '40%',
    },
    {
      title: 'Total events',
      align: 'flex-end',
      width: '10%',
    },
    {
      title: '% Total events',
      align: 'flex-end',
      width: '10%',
    },
    {
      title: 'Unique events',
      align: 'flex-end',
      width: '10%',
    },
    {
      title: '% Unique events',
      align: 'flex-end',
      width: '10%',
    },
    {
      title: 'Event value',
      align: 'flex-end',
      width: '10%',
    },
    {
      title: 'Avg event value',
      align: 'flex-end',
      width: '10%',
    },
  ],
};

export default config;
