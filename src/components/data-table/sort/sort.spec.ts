import { render, fireEvent, screen } from '@testing-library/svelte';
import Sort from './sort.svelte';

describe('Sort', () => {
  it('should render the DataTable Sort component', () => {
    const { container } = render(Sort, { direction: 'asc' });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call onClick function when click area is clicked', async () => {
    const onClick = jest.fn();
    render(Sort, {
      direction: 'asc',
      property: 'test-property',
      onClick,
    });

    const element = screen.getByTestId('data-table-sort-click-area');

    await fireEvent.click(element);

    expect(onClick).toHaveBeenCalledWith('test-property');
  });
});
