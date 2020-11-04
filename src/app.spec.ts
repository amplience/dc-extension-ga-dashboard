import { render } from '@testing-library/svelte';
import App from './app.svelte';

const mockGetClient = jest.fn();

jest.mock(
  './services/management-sdk-proxy/management-sdk-proxy.service',
  () => {
    return {
      default: jest.fn().mockImplementation(() => {
        return {
          hubId: 'hub-id',
          getClient: mockGetClient,
        };
      }),
    };
  }
);
jest.mock(
  './services/message-event-channel/message-event-channel.factory',
  () => {
    return {
      default: jest.fn().mockImplementation(() => ({ emit: () => undefined })),
    };
  }
);

describe('App', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  beforeEach(() => {
    const mockSearchIndexesList = jest.fn().mockImplementation(() => {
      return {
        getItems: () => [],
      };
    });
    const mockHubsGet = jest.fn().mockImplementation(() => {
      return {
        related: {
          searchIndexes: {
            list: mockSearchIndexesList,
          },
        },
      };
    });
    mockGetClient.mockImplementation(() => {
      return {
        hubs: {
          get: mockHubsGet,
        },
      };
    });
  });

  it('should render the App component', () => {
    const { container } = render(App, {});

    // this only renders the loading state - we need more tests to cover loaded scenarios
    expect(container.firstChild).toMatchSnapshot();
  });
});
