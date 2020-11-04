import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import TopSearches from './top-searches.svelte';
import singleItemListFixture from './__fixtures__/top-search-single-item-list';
import getTopSearches from './services/get-top-searches.service';
import { index } from '../../../stores/search-index';
import type { SearchIndex } from 'dc-management-sdk-js';

jest.mock('./services/get-top-searches.service');

describe('TopSearches', () => {
  beforeEach(() => {
    index.set({ name: 'test-index-name' } as SearchIndex);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the TopSearches component with no data', async () => {
    (getTopSearches as jest.Mock).mockReturnValue(Promise.resolve([]));
    const { container } = render(TopSearches, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the TopSearches component with data', async () => {
    (getTopSearches as jest.Mock).mockReturnValue(
      Promise.resolve(singleItemListFixture)
    );
    const { container } = render(TopSearches, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });
});
