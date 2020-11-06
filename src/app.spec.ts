import { render } from '@testing-library/svelte';
import App from './app.svelte';

describe('App', () => {
  it('should render the App component', () => {
    const { container } = render(App, {});

    // this only renders the loading state - we need more tests to cover loaded scenarios
    expect(container.firstChild).toMatchSnapshot();
  });
});
