import { render } from '@testing-library/svelte';
import QueryLabel from './query-label.svelte';

describe('QueryLabel', () => {
  it('should render a QueryLabel component', () => {
    const { container } = render(QueryLabel, { index: 1 });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a QueryLabel component without a row number', () => {
    const { container } = render(QueryLabel, { showRowNumber: false });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render an expanded QueryLabel component', () => {
    const { container } = render(QueryLabel, {
      index: 1,
      expandable: true,
      expanded: true,
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a collapsed QueryLabel component', () => {
    const { container } = render(QueryLabel, {
      index: 1,
      expandable: true,
      expanded: false,
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
