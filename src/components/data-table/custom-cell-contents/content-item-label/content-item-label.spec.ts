import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import ContentItemLabel from './content-item-label.svelte';
import { contentItems } from '../../../../stores/content-items';

jest.mock('../../../../stores/content-items');
describe('ContentItemLabel', () => {
  it('should intially render with content item id', async () => {
    ((contentItems.fetch as unknown) as jest.Mock).mockResolvedValue({
      label: 'test-content-item-label',
    });
    const { container } = render(ContentItemLabel, {
      contentItemId: '0f590113-9733-4446-abcd-a103d17a2063',
    });
    expect(container.firstChild).toMatchSnapshot();
  });
  it('should render and resolve a content item label', async () => {
    ((contentItems.fetch as unknown) as jest.Mock).mockResolvedValue({
      label: 'test-content-item-label',
    });
    const { container } = render(ContentItemLabel, {
      contentItemId: '0f590113-9733-4446-abcd-a103d17a2063',
    });

    await tick();
    expect(contentItems.fetch).toBeCalledWith(
      '0f590113-9733-4446-abcd-a103d17a2063'
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});