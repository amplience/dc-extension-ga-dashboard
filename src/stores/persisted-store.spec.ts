/* eslint-disable @typescript-eslint/no-empty-function */
import { writable } from './persisted-store';
import { connection } from './message-channel';
import type { ClientConnection } from 'message-event-channel';

describe('persistent store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    connection.set(null);
  });

  it('should return a svelte writeable', () => {
    const result = writable('a-key', null);
    expect(result.set).toBeDefined();
    expect(result.update).toBeDefined();
    expect(result.subscribe).toBeDefined();
  });

  it('should load the value using the connection', (done) => {
    const mockConnection = {
      request: jest.fn().mockResolvedValue('saved-value'),
    };
    connection.set((mockConnection as unknown) as ClientConnection);

    const store = writable('a-key', null);
    let storedValue;
    store.subscribe((value) => (storedValue = value));

    setTimeout(() => {
      expect(mockConnection.request).toHaveBeenCalledWith(
        'session-storage-get',
        {
          key: 'a-key',
        }
      );
      expect(storedValue).toEqual('saved-value');
      done();
    }, 1);
  });

  it('should ignored the loaded the value if its undefined using the connection', (done) => {
    const mockConnection = {
      request: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };
    connection.set((mockConnection as unknown) as ClientConnection);

    const store = writable('a-key', 'some-default');
    let storedValue;
    store.subscribe((value) => (storedValue = value));

    setTimeout(() => {
      expect(mockConnection.request).toHaveBeenCalledWith(
        'session-storage-get',
        {
          key: 'a-key',
        }
      );
      expect(storedValue).toEqual('some-default');
      done();
    }, 1);
  });

  it('should load the value using the new connection value', (done) => {
    const store = writable('a-key', null);
    let storedValue;
    store.subscribe((value) => (storedValue = value));

    const mockConnection = {
      request: jest.fn().mockResolvedValue('saved-value'),
    };
    connection.set((mockConnection as unknown) as ClientConnection);

    setTimeout(() => {
      expect(mockConnection.request).toHaveBeenCalled();
      expect(storedValue).toEqual('saved-value');
      done();
    }, 1);
  });

  it('should save the value using the via the connection', () => {
    const mockConnection = {
      request: jest
        .fn()
        .mockResolvedValue('saved-value')
        .mockResolvedValue(true),
    };
    connection.set((mockConnection as unknown) as ClientConnection);

    const store = writable('a-key', null);
    let storedValue;
    store.subscribe((value) => (storedValue = value));

    store.set('new-value');
    setTimeout(() => {
      expect(mockConnection.request).toHaveBeenCalledWith(
        'session-storage-get',
        {
          key: 'a-key',
        }
      );
      expect(mockConnection.request).toHaveBeenCalledWith(
        'session-storage-set',
        {
          key: 'a-key',
          value: 'new-value',
        }
      );
      expect(storedValue).toEqual('saved-value');
    }, 1);
  });

  it('should still attempt to get and set via the connection even if its throwing an error', () => {
    const mockConnection = {
      request: jest.fn().mockRejectedValue(new Error()),
    };
    connection.set((mockConnection as unknown) as ClientConnection);

    const store = writable('a-key', null);
    let storedValue;
    store.subscribe((value) => (storedValue = value));

    store.set('new-value');
    setTimeout(() => {
      expect(mockConnection.request).toHaveBeenCalledWith(
        'session-storage-get',
        {
          key: 'a-key',
        }
      );
      expect(mockConnection.request).toHaveBeenCalledWith(
        'session-storage-set',
        {
          key: 'a-key',
          value: 'new-value',
        }
      );
      expect(storedValue).toEqual('saved-value');
    }, 1);
  });

  it('should not save the value via the connection if it was unable to get a connection, but it should be set in svelte store', () => {
    const mockConnection = null;
    connection.set((mockConnection as unknown) as ClientConnection);

    const store = writable('a-key', null);
    let storedValue;
    store.subscribe((value) => (storedValue = value));

    store.set('new-value');
    setTimeout(() => {
      expect(mockConnection.request).not.toHaveBeenCalled();
      expect(storedValue).toEqual('saved-value');
    }, 1);
  });
});
