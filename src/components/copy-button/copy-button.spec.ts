import { render } from '@testing-library/svelte';
import CopyButton from './copy-button.svelte';
import { tick } from 'svelte';

describe('CopyButton', () => {
  const mockWriteText = jest.fn();
  const mockReadText = jest.fn();

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
        readText: mockReadText,
      },
    });
  });

  it('should render a copy button', async () => {
    const { container } = render(CopyButton, { value: 'test', title: 'title' });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should add some text to the clipboard when clicked', async () => {
    mockWriteText.mockResolvedValue(true);
    mockReadText.mockResolvedValue('test');

    const { container } = render(CopyButton, { value: 'test' });
    expect(container.firstChild).toMatchSnapshot();

    const buttonElement = document.querySelector('button');
    (buttonElement as HTMLElement).click();

    await tick();
    await expect(navigator.clipboard.readText()).resolves.toEqual('test');
  });
});
