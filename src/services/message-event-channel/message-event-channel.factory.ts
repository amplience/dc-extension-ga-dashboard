import { ClientConnection } from 'message-event-channel';

interface connectionOptions {
  targetOrigin?: string;
  onload?: boolean;
  timeout?: number | boolean;
  debug?: boolean;
  connectionTimeout?: number | boolean;
  clientInitiates?: boolean;
}

const createConnection = (options?: connectionOptions): ClientConnection => {
  return new ClientConnection(options);
};

export default createConnection;
