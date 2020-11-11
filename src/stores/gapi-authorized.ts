import { writable } from 'svelte/store';

export const gapiAuthorized = writable<boolean>(false);
