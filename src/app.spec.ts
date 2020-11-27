import { render } from '@testing-library/svelte';
import App from './app.svelte';
import { initGapi } from './stores/gapi';
import {
  contentItemIdMapping,
  editionIdMapping,
  slotIdMapping,
} from './stores/google-analytics';

jest.mock('./stores/gapi');

describe('App', () => {
  it('should render the App component', () => {
    editionIdMapping.set('EDITION_ID_MAPPING');
    contentItemIdMapping.set('CONTENT_ITEM_ID_MAPPING');
    slotIdMapping.set('SLOT_ID_MAPPING');
    const { container } = render(App, {});

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the App component with a warning that no reports are setup', () => {
    editionIdMapping.set(undefined);
    contentItemIdMapping.set(undefined);
    slotIdMapping.set(undefined);
    const { container } = render(App, {});

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should init gapi', () => {
    render(App, {});

    expect(initGapi).toHaveBeenCalled();
  });
});
