import rs from 'jsrsasign';

export interface GapiToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const TOKEN_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const TOKEN_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';

function getSignedJWS(key: string, email: string) {
  const header = JSON.stringify({ alg: 'RS256', typ: 'JWT' });
  const claim = JSON.stringify({
    aud: TOKEN_URL,
    scope: TOKEN_SCOPE,
    iss: email,
    exp: rs.KJUR.jws.IntDate.get('now + 1hour'),
    iat: rs.KJUR.jws.IntDate.getNow(),
  });
  return rs.KJUR.jws.JWS.sign(null, header, claim, key);
}

function getEncodedBody(signedJWS: string) {
  return `grant_type=${encodeURIComponent(
    TOKEN_GRANT_TYPE
  )}&assertion=${encodeURIComponent(signedJWS)}`;
}

export const getToken = async (
  key: string,
  email: string
): Promise<GapiToken> => {
  const signedJWS = getSignedJWS(key, email);
  const body = getEncodedBody(signedJWS);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  return await response.json();
};
