import { render } from '@testing-library/svelte';
import ExpandableIcon from './expandable-icon.svelte';

describe('ExpandableIcon', () => {
  it('should render the ExpandableIcon component in a collapsed state', () => {
    const { container } = render(ExpandableIcon, { expanded: false });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the ExpandableIcon component in a expanded state', async () => {
    const { container } = render(ExpandableIcon, { expanded: true });

    expect(container.firstChild).toMatchSnapshot();
  });
});
