import { render } from '@testing-library/svelte';
import QueryCount from './query-count.svelte';

describe('QueryCount', () => {
  it('should render the QueryCount component', () => {
    const { container } = render(QueryCount, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
