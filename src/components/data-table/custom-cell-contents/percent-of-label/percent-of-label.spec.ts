import { render } from '@testing-library/svelte';
import PercentOfLabel from './percent-of-label.svelte';

describe('PercentOfLabel', () => {
  it('should render a PercentOfLabel component', () => {
    const { container } = render(PercentOfLabel, { value: 25, total: 50 });

    expect(container.firstChild).toMatchSnapshot();
  });
});
