import { render } from '@testing-library/svelte';
import App from './app.svelte';
import { initGapi } from './stores/gapi';

jest.mock('./stores/gapi');

describe('App', () => {
  it('should render the App component', () => {
    const { container } = render(App, {});

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should init gapi', () => {
    render(App, {});

    expect(initGapi).toHaveBeenCalled();
  });
});
