import { render, fireEvent, screen } from '@testing-library/svelte';
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

  it('should render an active Chip', () => {
    const { container } = render(Chip, {
      label: 'test-label',
      active: true,
      onClick: () => {
        /* noop */
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should trigger the onClick prop', async () => {
    const onClickMock = jest.fn();
    render(Chip, {
      label: 'test-label',
      onClick: onClickMock,
    });

    const element = screen.getByTestId('chip');

    await fireEvent.click(element);

    expect(onClickMock).toHaveBeenCalled();
  });
});
