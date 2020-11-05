<script lang="ts">
  import { onMount } from 'svelte';
  import { getGAPI } from '../../services/gapi/gapi';
  import { gapiAuthorized } from '../../stores/gapi-authorized';
  import { gaClientId } from '../../stores/google-analytics';

  onMount(async () => {
    const gapi = getGAPI();
    gapi.analytics.ready(function () {
      gapi.analytics.auth.authorize({
        container: 'auth-button',
        clientid: $gaClientId,
      });

      gapi.analytics.auth.on('success', function (response) {
        console.log(response);
        $gapiAuthorized = true;
      });
    });
  });
</script>

<style>
  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: white;
  }

  .ga-authorize {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 120px 0 120px 0;
  }
</style>

<div>
  <div class="ga-authorize">
    <div id="auth-button" />
  </div>
</div>
