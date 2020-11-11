import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import ReportTable from './report-table.svelte';
import CustomCellMock from './__mocks__/custom-cell-contents-mock.svelte';

let tableConfig;
describe('ReportTable', () => {
  beforeEach(() => {
    tableConfig = {
      columns: [
        {
          title: 'column-title',
          width: '10%',
          align: 'flex-end',
        },
      ],
    };
  });
  it('should render the ReportTable component in a loading state', async () => {
    const { container } = render(ReportTable, {
      data: null,
      config: tableConfig,
    });

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the ReportTable component in a no data state', async () => {
    const { container } = render(ReportTable, {
      data: [],
      config: tableConfig,
    });

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the ReportTable component with data', async () => {
    const { container } = render(ReportTable, {
      data: [['cell-value']],
      config: tableConfig,
    });

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the ReportTable component with data and a custom component', async () => {
    tableConfig.columns[0].component = CustomCellMock;
    const { container } = render(ReportTable, {
      data: [['cell-value']],
      config: tableConfig,
    });

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });
});
