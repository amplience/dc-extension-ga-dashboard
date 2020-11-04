import { render } from '@testing-library/svelte';
import UsersCountCard from './users-count-card.svelte';
import { counts, Counts } from '../../../../stores/counts';

describe('UsersCountCard', () => {
  it('should render the UsersCountCard component with normal text hint', () => {
    counts.set(({
      usersCount: { count: 10 },
      searchesCount: { count: 10 },
    } as unknown) as Counts);
    const { container } = render(UsersCountCard, {});

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the UsersCountCard component with warning text hint', () => {
    counts.set(({
      usersCount: { count: 1 },
      searchesCount: { count: 101 },
    } as unknown) as Counts);
    const { container } = render(UsersCountCard, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
