import { connection } from '../../stores/message-channel';
import type { ClientConnection } from 'message-event-channel';

let initialised: boolean;
const googleAnalyticsId = '__GOOGLE_ANALYTICS_ID__';

export async function trackAction(action: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (googleAnalyticsId === '') {
    return;
  }

  if (window === undefined) {
    return;
  }

  if (window['ga'] === undefined) {
    return;
  }

  if (!initialised) {
    window['ga'].l = +new Date();
    window['ga']('create', googleAnalyticsId, 'auto', {
      clientId: await getClientId(),
    });
    initialised = true;
  }

  window['ga']('send', {
    hitType: 'event',
    eventCategory: 'Dashboard',
    eventLabel: 'Dashboard - Search',
    eventAction: `Dashboard - ${action}`,
  });
}

let currentConnection: ClientConnection = null;
connection.subscribe((connection) => {
  currentConnection = connection;
});

async function getClientId(): Promise<string> {
  try {
    return await currentConnection?.request('google-analytics-client-id');
  } catch (_) {
    return null;
  }
}
