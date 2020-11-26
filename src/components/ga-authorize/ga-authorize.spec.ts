import { render } from '@testing-library/svelte';
import {
  checkTokenAccess,
  refreshToken,
} from '../../services/gapi-token/gapi-token.service';
import {
  gaApiKey,
  gaClientEmail,
  gaClientId,
  gaViewId,
} from '../../stores/google-analytics';
import GAAuthorize from './ga-authorize.svelte';
import { gapiAuthorized } from '../../stores/gapi-authorized';
import { get } from 'svelte/store';
import { tick } from 'svelte';
import gapi from '../../stores/gapi';
import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';
import { TokenPermissionsError } from '../../services/gapi-token/gapi-token-permission-error';
import { TokenRequestError } from '../../services/gapi-token/gapi-token-request-error';

jest.mock('../../services/gapi-token/gapi-token.service');

describe('GAAuthorize', () => {
  beforeEach(() => {
    gapi.set(null);
    gaViewId.set(null);
    gaApiKey.set(null);
    gaClientEmail.set(null);
    gaClientId.set('ga:test-client-id');
    gapiAuthorized.set(false);

    jest.clearAllMocks();
  });

  it('should hide the component during authorization', async () => {
    const authorizeMock = jest.fn();
    const onSuccessMock = jest.fn();
    const onNeedsAuthorizationMock = jest.fn();
    const gapiMock = {
      analytics: {
        auth: {
          authorize: authorizeMock.mockImplementation(() => {
            return {
              on: onSuccessMock.mockImplementation(() => ({
                on: onNeedsAuthorizationMock,
              })),
            };
          }),
        },
      },
    };

    gapi.set((gapiMock as unknown) as GoogleAnalyticsEmbedAPI);
    const { container } = render(GAAuthorize, {});
    await tick();

    expect(authorizeMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "clientid": "ga:test-client-id",
            "container": "auth-button",
          },
        ],
      ]
    `);
    expect(container.firstChild).toMatchSnapshot();
    expect(get(gapiAuthorized)).toBe(false);
  });
  it('should render the GAAuthorize component with auth button', async () => {
    const authorizeMock = jest.fn();
    const onSuccessMock = jest.fn();
    const onNeedsAuthorizationMock = jest.fn();
    (checkTokenAccess as jest.Mock).mockImplementation(() => Promise.resolve());
    const gapiMock = {
      analytics: {
        auth: {
          authorize: authorizeMock.mockImplementation(() => {
            return {
              on: onSuccessMock.mockImplementation((event, fn) => {
                fn();
                return {
                  on: onNeedsAuthorizationMock.mockImplementation(
                    (event, fn) => {
                      fn();
                    }
                  ),
                };
              }),
            };
          }),
        },
      },
    };
    gapi.set((gapiMock as unknown) as GoogleAnalyticsEmbedAPI);
    const { container } = render(GAAuthorize, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
    expect(get(gapiAuthorized)).toBe(true);
  });
  it('should authorize with service account token', async () => {
    gapi.set(({} as unknown) as GoogleAnalyticsEmbedAPI);
    gaViewId.set('test-view-id');
    gaApiKey.set('test-service-account-api-key');
    gaClientEmail.set('test@client.email');
    (refreshToken as jest.Mock).mockImplementation(() => Promise.resolve());
    (checkTokenAccess as jest.Mock).mockImplementation(() => Promise.resolve());
    await render(GAAuthorize, {});
    await tick();
    await tick();
    expect((refreshToken as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {},
          "test-service-account-api-key",
          "test@client.email",
        ],
        Array [
          Object {},
          "test-service-account-api-key",
          "test@client.email",
        ],
      ]
    `);
    expect((checkTokenAccess as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {},
          "test-view-id",
        ],
        Array [
          Object {},
          "test-view-id",
        ],
      ]
    `);
    expect(get(gapiAuthorized)).toBe(true);
  });
  it('should render the GAAuthorize component with error when missing permission - auth button', async () => {
    const authorizeMock = jest.fn();
    const onSuccessMock = jest.fn();
    const onNeedsAuthorizationMock = jest.fn();
    (checkTokenAccess as jest.Mock).mockImplementation(() => Promise.reject());
    const gapiMock = {
      analytics: {
        auth: {
          authorize: authorizeMock.mockImplementation(() => {
            return {
              on: onSuccessMock.mockImplementation((event, fn) => {
                fn();
                return {
                  on: onNeedsAuthorizationMock.mockImplementation(
                    (event, fn) => {
                      fn();
                    }
                  ),
                };
              }),
            };
          }),
        },
      },
    };
    gapi.set((gapiMock as unknown) as GoogleAnalyticsEmbedAPI);
    gaViewId.set('test-view-id');
    const { container } = render(GAAuthorize, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
    expect(get(gapiAuthorized)).toBe(false);
  });
  it('should render the GAAuthorize component with error when missing permission - service account token', async () => {
    gapi.set(({} as unknown) as GoogleAnalyticsEmbedAPI);
    gaViewId.set('test-view-id');
    gaApiKey.set('test-service-account-api-key');
    gaClientEmail.set('test@client.email');
    (refreshToken as jest.Mock).mockImplementation(() => Promise.resolve());
    (checkTokenAccess as jest.Mock).mockImplementation(() =>
      Promise.reject(new TokenPermissionsError('Permissions Error'))
    );
    const { container } = render(GAAuthorize, {});
    await tick();
    await tick();
    await tick();
    expect((refreshToken as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {},
          "test-service-account-api-key",
          "test@client.email",
        ],
        Array [
          Object {},
          "test-service-account-api-key",
          "test@client.email",
        ],
      ]
    `);
    expect((checkTokenAccess as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {},
          "test-view-id",
        ],
        Array [
          Object {},
          "test-view-id",
        ],
      ]
    `);
    expect(container.firstChild).toMatchSnapshot();
    expect(get(gapiAuthorized)).toBe(false);
  });
  it('should render the GAAuthorize component with error when token request fails', async () => {
    gapi.set(({} as unknown) as GoogleAnalyticsEmbedAPI);
    gaViewId.set('test-view-id');
    gaApiKey.set('test-service-account-api-key');
    gaClientEmail.set('test@client.email');
    (refreshToken as jest.Mock).mockImplementation(() =>
      Promise.reject(new TokenRequestError('Token Request Error'))
    );
    (checkTokenAccess as jest.Mock).mockImplementation(() => Promise.reject());
    const { container } = render(GAAuthorize, {});
    await tick();
    await tick();
    await tick();
    expect((refreshToken as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {},
          "test-service-account-api-key",
          "test@client.email",
        ],
        Array [
          Object {},
          "test-service-account-api-key",
          "test@client.email",
        ],
      ]
    `);
    expect((checkTokenAccess as jest.Mock).mock.calls).toMatchInlineSnapshot(
      `Array []`
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(get(gapiAuthorized)).toBe(false);
  });
});
