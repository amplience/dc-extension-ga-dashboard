import { render } from '@testing-library/svelte';
import TopBar from './top-bar.svelte';

describe('TopBar', () => {
  it('should render the top bar', async () => {
    const { container } = render(TopBar);
    expect(container.firstChild).toMatchSnapshot();
  });
});
