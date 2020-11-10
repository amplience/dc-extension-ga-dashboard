import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import ContentItemName from './content-item-name.svelte';
import { contentItems } from '../../../../../stores/content-items';

jest.mock('../../../../../stores/content-items');
describe('ContentItemName', () => {
  it('should intially render with content item id', async () => {
    ((contentItems.fetch as unknown) as jest.Mock).mockResolvedValue({
      label: 'test-content-item-label',
    });
    const { container } = render(ContentItemName, {
      contentItemId: '0f590113-9733-4446-abcd-a103d17a2063',
    });
    expect(container.firstChild).toMatchSnapshot();
  });
  it('should render and resolve a content item label', async () => {
    ((contentItems.fetch as unknown) as jest.Mock).mockResolvedValue({
      label: 'test-content-item-label',
    });
    const { container } = render(ContentItemName, {
      contentItemId: '0f590113-9733-4446-abcd-a103d17a2063',
    });

    await tick();
    expect(contentItems.fetch).toBeCalledWith(
      '0f590113-9733-4446-abcd-a103d17a2063'
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with content item id when content item fetch throws an error', async () => {
    ((contentItems.fetch as unknown) as jest.Mock).mockRejectedValue({});
    const { container } = render(ContentItemName, {
      contentItemId: '0f590113-9733-4446-abcd-a103d17a2063',
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
