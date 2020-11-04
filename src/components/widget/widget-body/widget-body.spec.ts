import { render } from '@testing-library/svelte';
import WidgetBody from './widget-body.svelte';

describe('WidgetBody', () => {
  it('should render the Widget component', () => {
    const { container } = render(WidgetBody, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
