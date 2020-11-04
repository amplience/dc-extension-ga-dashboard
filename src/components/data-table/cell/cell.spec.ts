import { render } from '@testing-library/svelte';
import Cell from './cell.svelte';

describe('Cell', () => {
  it('should render the DataTable Cell component', () => {
    const { container } = render(Cell, {});

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the DataTable Cell component with a set width', () => {
    const { container } = render(Cell, { width: '40%' });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the DataTable Cell component with a set alignment', () => {
    const { container } = render(Cell, { align: 'flex-end' });

    expect(container.firstChild).toMatchSnapshot();
  });
});
