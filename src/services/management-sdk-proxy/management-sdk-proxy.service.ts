import {
  AccessTokenProvider,
  DynamicContent,
  HttpClient,
  HttpRequest,
  HttpResponse,
} from 'dc-management-sdk-js';
import type { ClientConnection } from 'message-event-channel';

interface ManagementSDKContext {
  hubId: string;
  apiUrl: string;
}

export interface ManagementSDKProxy {
  hubId: string;
  getClient: () => Promise<DynamicContent>;
}

const CLIENT_CREDENTIALS = {
  client_id: '',
  client_secret: '',
};

class DynamicContentProxy extends DynamicContent {
  protected createTokenClient(): AccessTokenProvider {
    return {
      getToken: () =>
        Promise.resolve({
          access_token: '',
          refresh_token: '',
          expires_in: 0,
        }),
    };
  }
}

class DynamicContentClientProxy implements HttpClient {
  constructor(private readonly connection: ClientConnection) {}
  request(config: HttpRequest): Promise<HttpResponse> {
    return this.connection.request('management-sdk-request', config);
  }
}

class ManagementSDKProxyImpl implements ManagementSDKProxy {
  private context: ManagementSDKContext = {
    hubId: '__HUB_ID__',
    apiUrl: '__API_URL__',
  };

  private async initializeContext(): Promise<void> {
    this.context = await this.connection.request('context-get');
  }

  private isStandalone(): string {
    return '__STANDALONE__';
  }

  constructor(private readonly connection: ClientConnection) {}

  get hubId(): string {
    return this.context?.hubId as string;
  }

  async getClient(): Promise<DynamicContent> {
    if (this.isStandalone() === '1') {
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

    await this.initializeContext();
    return new DynamicContentProxy(
      CLIENT_CREDENTIALS,
      { apiUrl: this.context.apiUrl },
      new DynamicContentClientProxy(this.connection)
    );
  }
}

const ManagementSDKProxyService = ManagementSDKProxyImpl;
export default ManagementSDKProxyService;
