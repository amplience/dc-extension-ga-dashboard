import { render } from '@testing-library/svelte';
import WidgetHeader from './widget-header.svelte';

describe('WidgetHeader', () => {
  it('should render the Widget component', () => {
    const { container } = render(WidgetHeader, {
      title: 'widget-header-title',
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
