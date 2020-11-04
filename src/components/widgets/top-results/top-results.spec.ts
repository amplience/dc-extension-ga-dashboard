import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import TopResults from './top-results.svelte';
import singleItemListFixture from './__fixtures__/top-hits-single-item-list';
import getTopHits from './services/get-top-hits.service';
import { index } from '../../../stores/search-index';
import type { SearchIndex } from 'dc-management-sdk-js';

jest.mock('./services/get-top-hits.service');

describe('TopResults', () => {
  beforeEach(() => {
    index.set({ name: 'test-index-name' } as SearchIndex);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the TopSearches component with no data', async () => {
    (getTopHits as jest.Mock).mockReturnValue(Promise.resolve([]));
    const { container } = render(TopResults, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the TopSearches component with data', async () => {
    (getTopHits as jest.Mock).mockReturnValue(
      Promise.resolve(singleItemListFixture)
    );
    const { container } = render(TopResults, {});

    expect(container.firstChild).toMatchSnapshot();

    await tick();
    expect(getTopHits).toHaveBeenCalled();
    expect(container.firstChild).toMatchSnapshot();
  });
});
