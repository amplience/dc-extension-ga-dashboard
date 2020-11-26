import { render } from '@testing-library/svelte';
import TopBar from './top-bar.svelte';
import {
  contentItemIdMapping,
  editionIdMapping,
  slotIdMapping,
} from './../../stores/google-analytics';

describe('TopBar', () => {
  it('should render the top bar', async () => {
    editionIdMapping.set('EDITION_ID_MAPPING');
    contentItemIdMapping.set('CONTENT_ITEM_ID_MAPPING');
    slotIdMapping.set('SLOT_ID_MAPPING');

    const { container } = render(TopBar);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render empty top bar if no mappings set', async () => {
    editionIdMapping.set(undefined);
    contentItemIdMapping.set(undefined);
    slotIdMapping.set(undefined);
    const { container } = render(TopBar);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render top bar if at least one mapping is set', async () => {
    editionIdMapping.set(undefined);
    contentItemIdMapping.set(undefined);
    slotIdMapping.set('SLOT_ID_MAPPING');
    const { container } = render(TopBar);
    expect(container.firstChild).toMatchSnapshot();
  });
});
