import { render } from '@testing-library/svelte';
import { refreshToken } from '../../services/gapi-token/gapi-token.service';
import { gaApiKey, gaClientEmail } from '../../stores/google-analytics';
import GAAuthorize from './ga-authorize.svelte';
import { gapiAuthorized } from '../../stores/gapi-authorized';
import { get } from 'svelte/store';
import { tick } from 'svelte';
import gapi from '../../stores/gapi';
import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';

jest.mock('../../services/gapi-token/gapi-token.service');

describe('GAAuthorize', () => {
  beforeEach(() => {
    gapi.set(({} as unknown) as GoogleAnalyticsEmbedAPI);
    gaApiKey.set(null);
    gaClientEmail.set(null);
    gapiAuthorized.set(false);

    jest.clearAllMocks();
  });
  it('should render the GAAuthorize component with auth button', () => {
    const { container } = render(GAAuthorize, {});

    expect(container.firstChild).toMatchSnapshot();
  });

  it.skip('should render the GAAuthorize component using token auth', async () => {
    (refreshToken as jest.Mock).mockImplementation(() => Promise.resolve({}));

    render(GAAuthorize, {});
    gaApiKey.set('test-api-key');
    gaClientEmail.set('test@email');
    await tick;
    await tick;

    expect((refreshToken as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {},
          "test-api-key",
          "test@email",
        ],
      ]
    `);
    expect(get(gapiAuthorized)).toBe(true);
  });

  it('should revert to auth button if token auth fails', async () => {
    (refreshToken as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('Unable to refesh token'))
    );

    render(GAAuthorize, {});
    gaApiKey.set('test-api-key');
    gaClientEmail.set('test@email');
    await tick;

    expect((refreshToken as jest.Mock).mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {},
          "test-api-key",
          "test@email",
        ],
      ]
    `);
    expect(get(gapiAuthorized)).toBe(false);
  });
});
