import { render } from '@testing-library/svelte';
import Body from './body.svelte';

describe('Body', () => {
  it('should render the DataTable Body component', () => {
    const { container } = render(Body, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
