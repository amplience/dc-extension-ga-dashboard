import { render } from '@testing-library/svelte';
import NoDataPlaceholder from './no-data-placeholder.svelte';

describe('Loader', () => {
  it('should render the Loader component', () => {
    const { container } = render(NoDataPlaceholder, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
