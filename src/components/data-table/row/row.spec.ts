import { getByTestId, render } from '@testing-library/svelte';
import Row from './row.svelte';

describe('Row', () => {
  it('should render the non-expandable row by default', () => {
    const { container } = render(Row, {});

    try {
      getByTestId(container, 'expandable-icon');
      fail('should not be able to get the expandable icon')
    } catch (err) {
      // noop
    }

    try {
      getByTestId(container, 'expandable-content');
      fail('should not be able to get the expandable content')
    } catch (err) {
      // noop
    }
    expect(container.firstChild).toMatchSnapshot();
  });


  it('should render the expandable row', () => {
    const { container } = render(Row, {expandable: true});

    expect(getByTestId(container, 'expandable-icon')).toBeDefined();
    expect(getByTestId(container, 'expandable-content')).toBeDefined();

    expect(container.firstChild).toMatchSnapshot();
  });


  it('should render the expanded expandable row', () => {
    const { container } = render(Row, {expandable: true, expanded: true});

    expect(getByTestId(container, 'expandable-icon')).toBeDefined();
    expect(getByTestId(container, 'expandable-content')).toBeDefined();

    expect(container.firstChild).toMatchSnapshot();
  });
});
