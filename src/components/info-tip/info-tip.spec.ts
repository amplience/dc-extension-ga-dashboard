import { render, fireEvent, screen } from '@testing-library/svelte';
import InfoTip from './info-tip.svelte';

describe('InfoTip', () => {
  it('should render the InfoTip intial state', async () => {
    const { container } = render(InfoTip, {
      content: 'info tip content',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the InfoTip after click', async () => {
    render(InfoTip, {
      content: 'info tip content',
    });

    const element = screen.getByTestId('info-tip');
    await fireEvent.click(element);
    expect(document.body).toMatchSnapshot();
  });
});
