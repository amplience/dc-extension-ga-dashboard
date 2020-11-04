import { render } from '@testing-library/svelte';
import Overview from './overview.svelte';
import { tick } from 'svelte';

describe('Overview', () => {
  it('should render the Overview component', async () => {
    const { container } = render(Overview, {});
    await tick();

    expect(container.firstChild).toMatchSnapshot();
  });
});
