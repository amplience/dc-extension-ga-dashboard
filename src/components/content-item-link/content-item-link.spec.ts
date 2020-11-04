import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import ContentItemLink from './content-item-link.svelte';
import getContentItemProperties from './services/get-content-item-properties.service';
import { connection } from '../../stores/message-channel';
import type { ClientConnection } from 'message-event-channel';

jest.mock('./services/get-content-item-properties.service');
describe('ContentItemLink', () => {
  const contentItemId = 'abc';
  const mockConnection = {
    emit: jest.fn(),
  };
  beforeEach(() => {
    connection.set((mockConnection as unknown) as ClientConnection);
    (getContentItemProperties as jest.Mock).mockReturnValue(
      Promise.resolve(['CONTENT_ITEM_URL', 'LABEL'])
    );
  });

  it('should display the content item id', () => {
    const { container } = render(ContentItemLink, {
      contentItemId,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should display a the content item link with a href and label', async () => {
    const { container } = render(ContentItemLink, {
      contentItemId,
    });
    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should display without a href if it was unable to get the URL', async () => {
    (getContentItemProperties as jest.Mock).mockReturnValue(
      Promise.resolve([undefined, 'LABEL'])
    );

    const { container } = render(ContentItemLink, {
      contentItemId,
    });
    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should display the content item id if it was unable to get the content item', async () => {
    (getContentItemProperties as jest.Mock).mockReturnValue(
      Promise.resolve(['CONTENT_ITEM_URL', 'abc'])
    );
    const { container } = render(ContentItemLink, {
      contentItemId,
    });
    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call the connection emit function when clicked', async () => {
    (getContentItemProperties as jest.Mock).mockReturnValue(
      Promise.resolve(['CONTENT_ITEM_URL', 'LABEL'])
    );
    const { container } = render(ContentItemLink, {
      contentItemId,
    });
    await tick();
    expect(container.firstChild).toMatchSnapshot();

    const contentItemLink = document.querySelector('a');
    (contentItemLink as HTMLElement).click();

    expect(mockConnection.emit).toHaveBeenCalledWith(
      'content-item-redirect',
      contentItemId
    );
  });
});
