import { render } from '@testing-library/svelte';
import DataTable from './data-table.svelte';

describe('DataTable', () => {
  it('should render the DataTable Body component', () => {
    const { container } = render(DataTable, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
