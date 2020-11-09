import { render } from '@testing-library/svelte';
import GAAuthorize from './ga-authorize.svelte';

describe('GAAuthorize', () => {
  it('should render the GAAuthorize component', () => {
    const { container } = render(GAAuthorize, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
