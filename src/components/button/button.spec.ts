import { render, fireEvent, screen } from '@testing-library/svelte';
import Button from './button.svelte';

describe('Button', () => {
  it('should render a default Button', () => {
    const { container } = render(Button, {
      primary: false,
      onClick: () => {
        /* noop */
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a primary Button', () => {
    const { container } = render(Button, {
      primary: true,
      onClick: () => {
        /* noop */
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a disabled Button', () => {
    const { container } = render(Button, {
      disabled: true,
      onClick: () => {
        /* noop */
      },
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should trigger the onClick prop', async () => {
    const onClickMock = jest.fn();
    render(Button, {
      primary: true,
      onClick: onClickMock,
    });

    const element = screen.getByTestId('button');

    await fireEvent.click(element);

    expect(onClickMock).toHaveBeenCalled();
  });
});
