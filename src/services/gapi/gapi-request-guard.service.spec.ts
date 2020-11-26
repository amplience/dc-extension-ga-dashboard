import { isValidToken, refreshToken } from '../gapi-token/gapi-token.service';
import { gaApiKey, gaClientEmail } from '../../stores/google-analytics';
import { gapiRequestGuard } from './gapi-request-guard.service';
import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';

jest.mock('../gapi-token/gapi-token.service');
jest.mock('../../config', () => ({
  GOOGLE_ANALYTICS_TIMEOUT: 10,
}));

describe('gapi-request-guard.service', () => {
  beforeEach(() => {
    gaApiKey.set('test-api-key');
    gaClientEmail.set('test-client-email');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('gapiRequestGuard', () => {
    it('should resolve when gapi token is valid and the gapi function resolves', async () => {
      (isValidToken as jest.Mock).mockImplementation(() => true);
      const gapi = ({
        client: {
          getToken: jest.fn(),
        },
      } as unknown) as GoogleAnalyticsEmbedAPI;
      const mockGapiFn = (): Promise<string> => Promise.resolve('resolved');

      const result = await gapiRequestGuard(gapi, mockGapiFn);

      expect(refreshToken).toBeCalledTimes(0);
      expect(result).toEqual('resolved');
    });
    it('should resolve when gapi token needs refreshing and the gapi function resolves', async () => {
      (isValidToken as jest.Mock).mockImplementation(() => false);
      (refreshToken as jest.Mock).mockImplementation(() => Promise.resolve());
      const gapi = ({
        client: {
          getToken: jest.fn(),
        },
      } as unknown) as GoogleAnalyticsEmbedAPI;
      const mockGapiFn = (): Promise<string> => Promise.resolve('resolved');

      const result = await gapiRequestGuard(gapi, mockGapiFn);

      expect(refreshToken).toBeCalledTimes(1);
      expect(result).toEqual('resolved');
    });
    it('should reject when the gapi function takes longer than the allowed timeout', async () => {
      (isValidToken as jest.Mock).mockImplementation(() => true);
      const gapi = ({
        client: {
          getToken: jest.fn(),
        },
      } as unknown) as GoogleAnalyticsEmbedAPI;
      const mockGapiFn = (): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => resolve('timedout'), 11);
        });
      };

      await expect(() =>
        gapiRequestGuard(gapi, mockGapiFn)
      ).rejects.toMatchInlineSnapshot(
        `[Error: GAPI failed to respond within 10ms]`
      );
    });
  });
});
