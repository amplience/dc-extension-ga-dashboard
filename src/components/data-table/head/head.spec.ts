import { render } from '@testing-library/svelte';
import Head from './head.svelte';

describe('Head', () => {
  it('should render the DataTable Head component', () => {
    const { container } = render(Head, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
