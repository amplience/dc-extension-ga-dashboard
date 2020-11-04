import type { ConnectionOptions } from 'message-event-channel';
import createConnection from './message-event-channel.factory';

jest.mock('message-event-channel', () => {
  return {
    ClientConnection: function (options?: ConnectionOptions) {
      expect(options).toMatchSnapshot();
    },
  };
});

describe('message event channel factory', () => {
  it('should return a new client connection with default params', () => {
    expect(createConnection()).toMatchInlineSnapshot(`ClientConnection {}`);
  });

  it('should return a new client connection with default params', () => {
    const options = {
      targetOrigin: 'target',
      onload: true,
      timeout: 1000,
      debug: true,
      connectionTimeout: 1000,
      clientInitiates: false,
    };
    expect(createConnection(options)).toMatchInlineSnapshot(
      `ClientConnection {}`
    );
  });
});
