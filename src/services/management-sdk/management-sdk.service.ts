import type { HttpClient } from 'dc-extensions-sdk';
import { DynamicContent } from 'dc-management-sdk-js';

const CLIENT_CREDENTIALS = {
  client_id: '',
  client_secret: '',
};

function isStandalone(): string {
  return '__STANDALONE__';
}

export default function getManagementClient(
  client: HttpClient
): DynamicContent {
  if (isStandalone() === '1') {
    return new DynamicContent(
      {
        client_id: '__CLIENT_ID__',
        client_secret: '__CLIENT_SECRET__',
      },
      {
        apiUrl: '__API_URL__',
        authUrl: '__AUTH_URL__',
      }
    );
  }

  return new DynamicContent(CLIENT_CREDENTIALS, {}, client);
}
