import { render } from '@testing-library/svelte';
import NoResultsRateCard from './no-results-rate-card.svelte';
import { counts, Counts } from '../../../../stores/counts';

describe('NoResultsRateCard', () => {
  it('should render the NoResultsRateCard component with normal text hint', () => {
    counts.set(({
      noResultsRate: { rate: 0.12 },
    } as unknown) as Counts);
    const { container } = render(NoResultsRateCard, {});

    expect(container.firstChild).toMatchSnapshot();
  });
});
