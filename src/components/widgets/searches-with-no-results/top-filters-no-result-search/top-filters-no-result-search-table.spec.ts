import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import TopFiltersNoResultSearchTable from './top-filters-no-result-search-table.svelte';
import type { SearchIndex } from 'dc-management-sdk-js';
import getTopFiltersNoResultSearch from './services/top-filters-no-result-search.service';
import { index } from '../../../../stores/search-index';
import topFiltersNoResultSearch from './services/__fixtures__/top-filter-no-results-search';
import { formatDateAsISOString } from '../../../../utils/date-format';

jest.mock('./services/top-filters-no-result-search.service');

describe('TopFiltersNoResultSearchTable', () => {
  beforeEach(() => {
    index.set({ name: 'test-index-name' } as SearchIndex);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the TopSearches component with no data', async () => {
    (getTopFiltersNoResultSearch as jest.Mock).mockReturnValue(
      Promise.resolve([])
    );
    const { container } = render(TopFiltersNoResultSearchTable, {
      search: 'q0',
      limit: 5,
    });

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the TopSearches component with data', async () => {
    (getTopFiltersNoResultSearch as jest.Mock).mockReturnValue(
      Promise.resolve(topFiltersNoResultSearch)
    );
    const { container } = render(TopFiltersNoResultSearchTable, {
      search: 'q0',
      limit: 5,
    });

    await tick();
    expect(container.firstChild).toMatchSnapshot();
    expect(getTopFiltersNoResultSearch).toHaveBeenCalledWith(
      { name: 'test-index-name' },
      {
        endDate: formatDateAsISOString(subtractDays(1)),
        includeReplicas: true,
        limit: 5,
        search: 'q0',
        startDate: formatDateAsISOString(subtractDays(30)),
      }
    );
  });

  function subtractDays(days: number): Date {
    return new Date(new Date().setDate(new Date().getDate() - days));
  }
});
