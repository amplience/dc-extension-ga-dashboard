import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';
import { isValidToken, refreshToken } from './gapi-token.service';

const TIMESTAMP = 1605880800000; // Fri Nov 20 2020 14:00:00 GMT+0000 (Greenwich Mean Time)

jest.mock('jsrsasign', () => ({
  KJUR: {
    jws: {
      JWS: {
        sign: jest.fn().mockImplementation(() => 'signed-jws'),
      },
    },
  },
}));

describe('gapi-token.service', () => {
  let dateSpy;
  beforeEach(() => {
    const mockDate = new Date(TIMESTAMP);
    dateSpy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => (mockDate as unknown) as string);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ access_token: 'abcd12345', expires_in: 3600 }),
      } as Response)
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('refreshToken', () => {
    it('should refresh a new token when no other token request are in flight', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({ access_token: 'abcd12345', expires_in: 3600 }),
        } as Response)
      );
      const gapiMock = ({
        client: {
          setToken: jest.fn(),
        },
        analytics: {
          auth: {
            authorize: jest.fn(),
          },
        },
      } as unknown) as GoogleAnalyticsEmbedAPI;
      await refreshToken(gapiMock, 'test-key', 'test@email');
      dateSpy.mockRestore();
      expect((global.fetch as jest.Mock).mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://oauth2.googleapis.com/token",
            Object {
              "body": "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=signed-jws",
              "headers": Object {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              "method": "POST",
            },
          ],
        ]
      `);
      expect((gapiMock.client.setToken as jest.Mock).mock.calls)
        .toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "access_token": "abcd12345",
              "expires_at": 1605884400,
              "expires_in": 3600,
            },
          ],
        ]
      `);
      expect((gapiMock.analytics.auth.authorize as jest.Mock).mock.calls)
        .toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "serverAuth": Object {
                "access_token": "abcd12345",
                "expires_at": 1605884400,
                "expires_in": 3600,
              },
            },
          ],
        ]
      `);
    });
    it('should only fetch and set the token once when called concurrently', async () => {
      const gapiMockInFlight = ({
        client: {
          setToken: jest.fn(),
        },
        analytics: {
          auth: {
            authorize: jest.fn(),
          },
        },
      } as unknown) as GoogleAnalyticsEmbedAPI;
      const gapiMockAwaitingInFlight = ({
        client: {
          setToken: jest.fn(),
        },
        analytics: {
          auth: {
            authorize: jest.fn(),
          },
        },
      } as unknown) as GoogleAnalyticsEmbedAPI;

      // adding a delay to fetch so simulate and in flight request
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                json: () =>
                  Promise.resolve({
                    access_token: 'abcd12345',
                    expires_in: 3600,
                  }),
              } as Response);
            }, 200);
          })
      );
      refreshToken(gapiMockInFlight, 'test-key', 'test@email').then(() => {
        expect(gapiMockInFlight.client.setToken).toBeCalledTimes(1);
        expect(gapiMockInFlight.analytics.auth.authorize).toBeCalledTimes(1);
      });

      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({ access_token: 'abcd12345', expires_in: 3600 }),
        } as Response)
      );
      await refreshToken(gapiMockAwaitingInFlight, 'test-key-2', 'test@email2');

      dateSpy.mockRestore();
      expect(global.fetch).toBeCalledTimes(1);
      expect(gapiMockAwaitingInFlight.client.setToken).toBeCalledTimes(0);
      expect(gapiMockAwaitingInFlight.analytics.auth.authorize).toBeCalledTimes(
        0
      );
    });
    it('should throw and error when auth fetch fails', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Gapi token request failure'))
      );
      const gapiMock = ({
        client: {
          setToken: jest.fn(),
        },
        analytics: {
          auth: {
            authorize: jest.fn(),
          },
        },
      } as unknown) as GoogleAnalyticsEmbedAPI;
      dateSpy.mockRestore();
      await expect(
        refreshToken(gapiMock, 'test-key', 'test@email')
      ).rejects.toMatchInlineSnapshot(
        `[Error: Unable to retrieve gapi token using supplied client api key and email]`
      );
    });
  });

  describe('isValidToken', () => {
    it('should return true when the token has not expired', () => {
      const validToken = {
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: TIMESTAMP / 1000 + 61,
        access_token: 'abcd12345',
      };
      const result = isValidToken(validToken);
      dateSpy.mockRestore();
      expect(result).toBe(true);
    });
    it('should return false when the token has not expired but is within 60 seconds of expiring', () => {
      const validToken = {
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: TIMESTAMP / 1000 + 60,
        access_token: 'abcd12345',
      };
      const result = isValidToken(validToken);
      dateSpy.mockRestore();
      expect(result).toBe(false);
    });
    it('should return false when the token has expired', () => {
      const validToken = {
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: TIMESTAMP / 1000 - 1,
        access_token: 'abcd12345',
      };
      const result = isValidToken(validToken);
      dateSpy.mockRestore();
      expect(result).toBe(false);
    });
  });
});
