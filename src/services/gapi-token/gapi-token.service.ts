import rs from 'jsrsasign';
import type { GoogleAnalyticsEmbedAPI } from '../../definitions/google-analytics-embed-api';

export interface GapiToken {
  access_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
}

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
const EXPIRES_IN = Number('__GOOGLE_ANALYTICS_TOKEN_EXPIRES_IN__') || undefined;

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
    console.log('inFlightPromise');
    // if a token request is already in flight wait for it's response
    // to avoid gapi calls with an invalid token
    await inFlightPromise;
    return;
  }

  const token = await getToken(key, email);
  gapi.client.setToken(token);
  gapi.analytics.auth.authorize({
    serverAuth: token,
  });
}

export function isValidToken(token: GapiToken): boolean {
  return token.expires_at - 60 > secondsSinceEpoch();
}
