import rs from 'jsrsasign';
import { GOOGLE_ANALYTICS_TOKEN_EXPIRES_IN } from '../../config';
import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';
import { TokenPermissionsError } from './gapi-token-permission-error';
import { TokenRequestError } from './gapi-token-request-error';

export interface GapiToken {
  access_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
}

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
const EXPIRES_IN = GOOGLE_ANALYTICS_TOKEN_EXPIRES_IN || undefined;

let inFlightPromise;

function secondsSinceEpoch() {
  return Math.floor(new Date().getTime() / 1000);
}

function getSignedJWS(key: string, email: string) {
  const header = JSON.stringify({ alg: 'RS256', typ: 'JWT' });
  const claim = JSON.stringify({
    aud: TOKEN_URL,
    scope: SCOPE,
    iss: email,
    exp: secondsSinceEpoch() + 3600,
    iat: secondsSinceEpoch(),
  });

  return rs.KJUR.jws.JWS.sign(null, header, claim, key);
}

function getEncodedBody(signedJWS: string) {
  return `grant_type=${encodeURIComponent(
    GRANT_TYPE
  )}&assertion=${encodeURIComponent(signedJWS)}`;
}

async function getToken(key: string, email: string): Promise<GapiToken> {
  const signedJWS = getSignedJWS(key, email);
  const body = getEncodedBody(signedJWS);
  try {
    inFlightPromise = fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    const response = await inFlightPromise;
    const json = await response.json();

    json.expires_at = secondsSinceEpoch() + (EXPIRES_IN || json.expires_in);

    return json;
  } finally {
    inFlightPromise = null;
  }
}

export async function refreshToken(
  gapi: GoogleAnalyticsEmbedAPI,
  key: string,
  email: string
): Promise<void> {
  if (inFlightPromise) {
    // if a token request is already in flight wait for it's response
    // to avoid gapi calls with an invalid token
    await inFlightPromise;
    return;
  }

  try {
    const token = await getToken(key, email);
    gapi.client.setToken(token);
    gapi.analytics.auth.authorize({
      serverAuth: token,
    });
  } catch (e) {
    throw new TokenRequestError(
      'Unable to retrieve gapi token using supplied client api key and email'
    );
  }
}

export async function checkTokenAccess(
  gapi: GoogleAnalyticsEmbedAPI,
  viewId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];
    const query = {
      ids: viewId,
      'start-date': today,
      'end-date': today,
      metrics: 'ga:totalEvents',
    };
    new gapi.analytics.report.Data({ query })
      .once('success', resolve)
      .once('error', () => {
        reject(new TokenPermissionsError('Unable to access embed api'));
      })
      .execute();
  });
}

export function isValidToken(token: GapiToken): boolean {
  return token.expires_at - 60 > secondsSinceEpoch();
}
