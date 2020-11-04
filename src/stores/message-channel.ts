import { writable } from 'svelte/store';
import type { ClientConnection } from 'message-event-channel';

export const connection = writable<ClientConnection>(null);
