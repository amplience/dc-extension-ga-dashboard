<script lang="ts">
  import { afterUpdate } from 'svelte';
  import gapi from '../../stores/gapi';
  import { gapiAuthorized } from '../../stores/gapi-authorized';
  import {
    gaApiKey,
    gaAuthByToken,
    gaClientEmail,
    gaClientId,
    gaViewId,
  } from '../../stores/google-analytics';
  import {
    checkTokenAccess,
    refreshToken,
  } from '../../services/gapi-token/gapi-token.service';
  import Widget from '../widget/widget.svelte';
  import WidgetBody from '../widget/widget-body/widget-body.svelte';
  import { TokenPermissionsError } from '../../services/gapi-token/gapi-token-permission-error';
  import { TokenRequestError } from '../../services/gapi-token/gapi-token-request-error';

  let gapiError: GapiError = null;
  let authorizing = true;

  enum GapiError {
    UNABLE_TO_RETRIEVE_TOKEN = 'UNABLE_TO_RETRIEVE_TOKEN',
    MISSING_PERMISSIONS = 'MISSING_PERMISSIONS',
  }

  afterUpdate(async () => {
    if (!$gapi) {
      return;
    }

    try {
      if ($gaAuthByToken) {
        await refreshToken($gapi, $gaApiKey, $gaClientEmail);
        await checkTokenAccess($gapi, $gaViewId);
        $gapiAuthorized = true;
        return;
      }
    } catch (e) {
      if (e instanceof TokenPermissionsError) {
        gapiError = GapiError.MISSING_PERMISSIONS;
      }
      if (e instanceof TokenRequestError) {
        gapiError = GapiError.UNABLE_TO_RETRIEVE_TOKEN;
      }
      authorizing = false;
      return;
    }

    $gapi.analytics.auth
      .authorize({
        container: 'auth-button',
        clientid: $gaClientId,
      })
      .on('success', async () => {
        try {
          await checkTokenAccess($gapi, $gaViewId);
          $gapiAuthorized = true;
        } catch {
          gapiError = GapiError.MISSING_PERMISSIONS;
          authorizing = false;
        }
      })
      .on('needsAuthorization', () => {
        authorizing = false;
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
    margin: 2.6rem auto;
  }

  .auth-signin,
  .auth-error {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .auth-button {
    padding-top: 20px;
    justify-content: center;
  }

  .auth-button > :global(div) {
    cursor: pointer;
  }

  .ga-authorize.hide {
    visibility: hidden;
  }
  .ga-authorize :global(.widget) {
    width: 100%;
  }

  .ga-authorize :global(.widget-body) {
    width: 100%;
    margin: 0;
  }
</style>

<div class={`ga-authorize ${authorizing ? 'hide' : ''}`}>
  <Widget>
    <WidgetBody>
      <div class="auth-signin">
        {#if gapiError}
          <div class="auth-error">
            {#if gapiError === GapiError.MISSING_PERMISSIONS}
              You do not have permission to see content reports for Google
              Analytics view ID:
              {$gaViewId}. Please contact your Google Analytics administrator.
            {:else}
              Unable to retrieve access token. Check your installation
              parameters.
            {/if}
          </div>
        {:else}
          <p>Signin required</p>
          <p>
            To see content reports you need to Sign in and allow this dashboard
            to access your Google Analytics data
          </p>
        {/if}
        <div id="auth-button" class="auth-button" />
      </div>
    </WidgetBody>
  </Widget>
</div>
