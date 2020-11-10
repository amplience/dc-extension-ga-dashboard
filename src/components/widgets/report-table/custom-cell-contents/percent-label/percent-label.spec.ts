import { render } from '@testing-library/svelte';
import PercentLabel from './percent-label.svelte';

describe('PercentLabel', () => {
  it('should render a PercentLabel component', () => {
    const { container } = render(PercentLabel, { value: 25 });

    expect(container.firstChild).toMatchSnapshot();
  });
});
