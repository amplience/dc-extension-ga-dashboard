import ManagementSDKProxyService, {
  ManagementSDKProxy,
} from './management-sdk-proxy.service';
import { ClientConnection } from 'message-event-channel';

jest.mock('message-event-channel');

describe('management sdk proxy service - Using connection', () => {
  let connection: ClientConnection;
  beforeEach(() => {
    connection = new ClientConnection();
    (connection.request as jest.Mock).mockReturnValue({
      apiUrl: 'https://mock.api.amplience.net/v2/content/',
      hubId: 'hubId',
    });
  });
  it('should return a new client', async () => {
    const sdkProxyService = new ManagementSDKProxyService(connection);
    expect(await sdkProxyService.getClient()).toMatchSnapshot();
    expect(sdkProxyService.hubId).toEqual('hubId');
  });
});

describe('management sdk proxy service - Standalone mode', () => {
  let connection: ClientConnection;
  let sdkProxyService: ManagementSDKProxy;
  beforeEach(() => {
    connection = new ClientConnection();
    sdkProxyService = new ManagementSDKProxyService(connection);
    (sdkProxyService as ManagementSDKProxy & {
      isStandalone: () => string;
    }).isStandalone = () => '1';
  });
  it('should return a new client', async () => {
    expect(await sdkProxyService.getClient()).toMatchSnapshot();
    expect(sdkProxyService.hubId).toEqual('__HUB_ID__');
  });
});
