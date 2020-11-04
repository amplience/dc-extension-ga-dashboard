import { render } from '@testing-library/svelte';
import OverviewCard from './overview-card.svelte';

describe('OverviewCard', () => {
  it('should render the OverviewCard component', () => {
    const { container } = render(OverviewCard, {
      title: 'test title',
      icon: 'test-icon',
      value: 1,
      bodyText: 'some body text',
      color: '#333',
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the OverviewCard component with footerText', () => {
    const { container } = render(OverviewCard, {
      title: 'test title',
      icon: 'test-icon',
      value: 1,
      bodyText: 'some body text',
      footerText: 'some footer text',
      color: '#333',
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the OverviewCard component when no value is set', () => {
    const { container } = render(OverviewCard, {
      title: 'test title',
      icon: 'test-icon',
      value: null,
      bodyText: 'some body text',
      color: '#333',
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
