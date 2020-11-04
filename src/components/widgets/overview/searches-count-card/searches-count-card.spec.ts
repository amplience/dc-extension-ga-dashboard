import { render } from '@testing-library/svelte';
import SearchesCountCard from './searches-count-card.svelte';
import { Counts, counts } from '../../../../stores/counts';

describe('SearchesCountCard', () => {
  it('should render the SearchesCountCard component', () => {
    counts.set(({
      usersCount: { count: 1 },
      searchesCount: { count: 10 },
    } as unknown) as Counts);
    const { container } = render(SearchesCountCard, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
