import { render, screen, fireEvent } from '@testing-library/svelte';
import Overlay from './overlay.svelte';

describe('Overlay', () => {
  it('should render an Overlay component', async () => {
    const { container } = render(Overlay, { onClick: jest.fn() });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render an Overlay component with updated z-index', async () => {
    const { container } = render(Overlay, { onClick: jest.fn(), zIndex: 111 });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should trigger the onClick function', async () => {
    const mockOnClick = jest.fn();
    render(Overlay, { onClick: mockOnClick });

    const element = screen.getByTestId('overlay');

    await fireEvent.click(element);

    expect(mockOnClick).toHaveBeenCalled();
  });
});
