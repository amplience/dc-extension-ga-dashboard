import { render } from '@testing-library/svelte';
import Chip from './chip.svelte';

describe('Chip', () => {
  it('should render a Chip', () => {
    const { container } = render(Chip, {
      label: 'test-label',
      onClick: () => {
        /* noop */
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a clickable Chip', () => {
    const { container } = render(Chip, {
      label: 'test-label',
      clickable: true,
      onClick: () => {
        /* noop */
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render an active Chip', () => {
    const { container } = render(Chip, {
      label: 'test-label',
      active: true,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render an clickable active Chip', () => {
    const { container } = render(Chip, {
      label: 'test-label',
      active: true,
      clickable: true,
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
