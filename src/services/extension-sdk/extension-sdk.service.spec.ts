import { init, Options } from 'dc-extensions-sdk';
import getExtensionClient from './extension-sdk.service';

jest.mock('dc-extensions-sdk');

describe('ExtensionSDK - getExtensionsClient', () => {
  it('should return a new client', async () => {
    const options = { timeout: 300 };
    await getExtensionClient(options as Options);
    expect(init).toBeCalledWith(options);
  });
});
