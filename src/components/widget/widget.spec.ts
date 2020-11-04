import { render } from '@testing-library/svelte';
import Widget from './widget.svelte';

describe('Widget', () => {
  it('should render the Widget component', () => {
    const { container } = render(Widget, { loading: false });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Widget component with loading spinner', () => {
    const { container } = render(Widget, { loading: true });

    expect(container.firstChild).toMatchSnapshot();
  });
});
