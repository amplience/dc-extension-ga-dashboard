import { get } from 'svelte/store';
import { GOOGLE_ANALYTICS_TIMEOUT } from '../../config';
import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';
import {
  gaApiKey,
  gaAuthByToken,
  gaClientEmail,
} from '../../stores/google-analytics';
import { isValidToken, refreshToken } from '../gapi-token/gapi-token.service';

async function checkAuth(gapi): Promise<void> {
  if (get(gaAuthByToken) && !isValidToken(gapi.client.getToken('token'))) {
    await refreshToken(gapi, get(gaApiKey), get(gaClientEmail));
  }
}

export class RequestTimeout extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const gapiRequestGuard = async <T>(
  gapi: GoogleAnalyticsEmbedAPI,
  gapiFn: () => Promise<T>
): Promise<T> => {
  await checkAuth(gapi);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new RequestTimeout(
          `GAPI failed to respond within ${GOOGLE_ANALYTICS_TIMEOUT}ms`
        )
      );
    }, GOOGLE_ANALYTICS_TIMEOUT);
    gapiFn()
      .then((response) => {
        clearTimeout(timeout);
        resolve(response);
      })
      .catch((response) => {
        clearTimeout(timeout);
        reject(response);
      });
  });
};
