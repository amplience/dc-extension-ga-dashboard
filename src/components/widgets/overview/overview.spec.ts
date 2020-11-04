import { render } from '@testing-library/svelte';
import Overview from './overview.svelte';
import getUsersCount from './services/get-users-count.service';
import getSearchesCount from './services/get-searches-count.service';
import getNoResultsRate from './services/get-no-results-rate.service';
import { tick } from 'svelte';
import { index } from '../../../stores/search-index';
import { counts } from '../../../stores/counts';
import type { SearchIndex } from 'dc-management-sdk-js';

jest.mock('./services/get-users-count.service');
jest.mock('./services/get-searches-count.service');
jest.mock('./services/get-no-results-rate.service');
jest.mock('../../../stores/counts', () => ({
  ...jest.requireActual('../../../stores/counts'),
  counts: {
    ...jest.requireActual('../../../stores/counts').counts,
    set: jest.fn(),
  },
}));
jest.mock('../../../stores/search-index', () => ({
  ...jest.requireActual('../../../stores/search-index'),
  index: {
    ...jest.requireActual('../../../stores/search-index').index,
    set: jest.fn(),
  },
}));

describe('Overview', () => {
  beforeEach(() => {
    (getUsersCount as jest.Mock).mockImplementation(() => ({
      count: 11111,
    }));
    (getSearchesCount as jest.Mock).mockImplementation(() => ({
      count: 22222,
    }));
    (getNoResultsRate as jest.Mock).mockImplementation(() => ({
      rate: 0.33,
    }));
  });
  it('should render the Overview component', async () => {
    const { container } = render(Overview, {});
    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call count function on index change', async () => {
    index.set(({ name: 'test-trigger-name' } as unknown) as SearchIndex);
    render(Overview, {});
    await tick();
    expect(getUsersCount).toHaveBeenCalled();
    expect(getSearchesCount).toHaveBeenCalled();
    expect(getNoResultsRate).toHaveBeenCalled();
    expect(counts.set).toHaveBeenCalledWith({
      noResultsRate: { rate: 0.33 },
      searchesCount: { count: 22222 },
      usersCount: { count: 11111 },
    });
  });
});
