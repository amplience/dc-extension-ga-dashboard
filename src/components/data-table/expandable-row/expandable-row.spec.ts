import { render, fireEvent, screen } from '@testing-library/svelte';
import ExpandableRow from './expandable-row.svelte';
import { tick } from 'svelte';

describe('ExpandableRow', () => {
  it('should render the DataTable ExpandableRow component', () => {
    const { container } = render(ExpandableRow, {});

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the DataTable ExpandableRow and expand the row on click', async () => {
    const { container } = render(ExpandableRow, {});

    const element = screen.getByTestId('row-content');

    await fireEvent.click(element);
    await tick();

    expect(container.firstChild).toMatchSnapshot();
  });
});
