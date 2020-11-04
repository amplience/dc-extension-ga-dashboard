import { render } from '@testing-library/svelte';
import Checkbox from './checkbox.svelte';

describe('Checkbox', () => {
  it('should render a checkbox not checked - false supplied', async () => {
    const { container } = render(Checkbox, {
      className: 'test-class',
      checked: false,
      label: 'test label',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a checkbox not checked - undefined checked value', async () => {
    const { container } = render(Checkbox, {
      className: 'test-class',
      label: 'test label',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a checkbox checked', async () => {
    const { container } = render(Checkbox, {
      className: 'test-class',
      checked: true,
      label: 'test label',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a checkbox checked and disabled', async () => {
    const { container } = render(Checkbox, {
      className: 'test-class',
      checked: true,
      disabled: true,
      label: 'test label',
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render a checkbox unchecked and disabled', async () => {
    const { container } = render(Checkbox, {
      className: 'test-class',
      checked: false,
      disabled: true,
      label: 'test label',
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
