import { writable } from 'svelte/store';

import type { GoogleAnalyticsEmbedAPI } from '../definitions/google-analytics-embed-api';

const gapi = writable<GoogleAnalyticsEmbedAPI>(null);

export const initGapi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const gaEmbedApi: GoogleAnalyticsEmbedAPI = window['gapi'] || undefined;
    if (!gaEmbedApi) {
      console.log('hihi');
      reject(new Error('Unable to initialize gapi: missing gapi instance'));
    }
    gaEmbedApi.analytics.ready(function () {
      gapi.set(gaEmbedApi);
      resolve();
    });
  });
};

export default gapi;
