import { render } from '@testing-library/svelte';
import Link from './link.svelte';

describe('Link', () => {
  it('should render the Link component with default target', () => {
    const { container } = render(Link, {
      href: 'https://test-href',
      text: 'test-link-text',
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the Link component with defined target', () => {
    const { container } = render(Link, {
      href: 'https://test-href',
      text: 'test-link-text',
      linkTarget: 'test-target',
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
