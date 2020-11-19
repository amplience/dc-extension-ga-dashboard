<script lang="ts">
  import { afterUpdate } from 'svelte';
  import gapi from '../../stores/gapi';
  import { gapiAuthorized } from '../../stores/gapi-authorized';
  import {
    gaApiKey,
    gaAuthByToken,
    gaClientEmail,
    gaClientId,
  } from '../../stores/google-analytics';
  import { refreshToken } from '../../services/gapi-token/gapi-token.service';

  afterUpdate(async () => {
    if (!$gapi) {
      return;
    }

    try {
      if ($gaAuthByToken) {
        await refreshToken($gapi, $gaApiKey, $gaClientEmail);
        $gapiAuthorized = true;
        return;
      }
    } catch (e) {
      console.error(
        'Unable to retrieve gapi token using supplied client api key and email'
      );
    }

    $gapi.analytics.auth.authorize({
      container: 'auth-button',
      clientid: $gaClientId,
    });

    $gapi.analytics.auth.on('success', function () {
      $gapiAuthorized = true;
    });
  });
</script>

<style>
  div {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .ga-authorize {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 120px 0 120px 0;
  }

  .auth-button {
    justify-content: center;
  }
</style>

<div>
  <div class="ga-authorize">
    <div id="auth-button" class="auth-button" />
  </div>
</div>
