import { writable as svelteWritable, Writable } from 'svelte/store';
import { connection } from './message-channel';
import type { ClientConnection } from 'message-event-channel';

let currentConnection: ClientConnection = null;
connection.subscribe((newValue) => {
  currentConnection = newValue;
});

async function invokeConnectionRequest(
  message: string,
  data: unknown
): Promise<unknown> {
  if (!currentConnection) {
    await new Promise((resolve) => {
      const unsubscribe = connection.subscribe((newConnection) => {
        if (newConnection) {
          resolve();
          unsubscribe();
        }
      });
    });
  }
  try {
    return await currentConnection.request(message, data);
  } catch (_) {
    return undefined;
  }
}

export function writable<T>(key: string, value: T): Writable<T> {
  const svelteStore = svelteWritable(value);
  let initialised = false;

  invokeConnectionRequest('session-storage-get', { key }).then((newValue) => {
    initialised = true;
    if (newValue !== undefined) {
      svelteStore.set(newValue as T);
    }
  });

  svelteStore.subscribe((value) => {
    if (initialised) {
      invokeConnectionRequest('session-storage-set', { key, value });
    }
  });

  return svelteStore;
}
