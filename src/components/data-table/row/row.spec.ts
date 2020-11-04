import { render } from '@testing-library/svelte';
import Row from './row.svelte';

describe('Row', () => {
  it('should render the DataTable Row component', () => {
    const { container } = render(Row, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
