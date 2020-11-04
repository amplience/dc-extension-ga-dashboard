import { render } from '@testing-library/svelte';
import Loader from './loader.svelte';

describe('Loader', () => {
  it('should render the Loader component', () => {
    const { container } = render(Loader, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
