import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import TopContentReport from './top-content-report.svelte';

describe('TopContentReport', () => {
  it('should render the TopContentReport component', async () => {
    const { container } = render(TopContentReport, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });
});
