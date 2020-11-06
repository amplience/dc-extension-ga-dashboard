import { HttpClient } from "dc-extensions-sdk";
import type { ClientConnection } from "message-event-channel";
import getManagementClient from "./management-sdk.service";
import { DynamicContent } from 'dc-management-sdk-js';

jest.mock('dc-management-sdk-js');

describe('ManagementSDK - getManagementClient', () => {
  it('should return a new client', async () => {
    getManagementClient(new HttpClient({} as ClientConnection));
    expect((DynamicContent as jest.Mock).mock.calls).toMatchSnapshot();
  });
});
