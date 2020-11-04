import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import SearchesWithNoResults from './searches-with-no-results.svelte';
import singleItemListFixture from './__fixtures__/search-with-no-results';
import { index } from '../../../stores/search-index';
import type { SearchIndex } from 'dc-management-sdk-js';
import getSearchesWithNoResults from './services/get-searches-with-no-results.service';

jest.mock('./services/get-searches-with-no-results.service');

describe('SearchesWithNoResults', () => {
  beforeEach(() => {
    index.set({ name: 'test-index-name' } as SearchIndex);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the TopSearches component with no data', async () => {
    (getSearchesWithNoResults as jest.Mock).mockReturnValue(
      Promise.resolve([])
    );
    const { container } = render(SearchesWithNoResults, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the TopSearches component with data', async () => {
    (getSearchesWithNoResults as jest.Mock).mockReturnValue(
      Promise.resolve(singleItemListFixture)
    );
    const { container } = render(SearchesWithNoResults, {});

    expect(container.firstChild).toMatchSnapshot();

    await tick();
    expect(getSearchesWithNoResults).toHaveBeenCalled();
    expect(container.firstChild).toMatchSnapshot();
  });
});
