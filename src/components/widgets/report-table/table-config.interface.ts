interface TableConfigColumn {
  title: string;
  width?: string;
  align?: string;
  component?: unknown;
}

export interface TableConfig {
  id: string;
  columns: TableConfigColumn[];
}
