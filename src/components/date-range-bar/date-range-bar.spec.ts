import { render } from '@testing-library/svelte';
import DateRangeBar from './date-range-bar.svelte';

describe('DateRangeBar', () => {
  it('should render a DateRangeBar', () => {
    const { container } = render(DateRangeBar, {});
    expect(container.firstChild).toMatchSnapshot();
  });
});
