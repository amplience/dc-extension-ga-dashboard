import { render } from '@testing-library/svelte';
import GAAuthorize from './ga-authorize.svelte';

xdescribe('No Indexes Placeholder', () => {
  it('should render the No Indexes Placeholder component', () => {
    const { container } = render(GAAuthorize, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
