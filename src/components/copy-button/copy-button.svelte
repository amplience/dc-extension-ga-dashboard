<script lang="ts">
  import { connection } from '../../stores/message-channel';
  import CopyIcon from '../../assets/icons/ic-copyicon.svg';

  export let value: unknown;
  export let title: string = '';

  async function addToClipboard() {
    const data = value?.toString();
    try {
      // Try writing to it directly (this should work for Firefox & Safari)
      await navigator.clipboard.writeText(data);
      if ($connection) {
        // Toast the message via the parent window
        $connection.emit('toast-success', 'Copied to clipboard');
      }
    } catch (err) {
      // Chrome will error
      if ($connection) {
        // Deferr the the parent window if it's present
        $connection.emit('clipboard-write', data);
      } else {
        console.error(err);
      }
    }
  }
</script>

<style>
  button {
    border: none;
    background: none;
    padding: 0;
    display: inline-block;
    cursor: pointer;
    width: 16px;
    height: 16px;
  }

  button > :global(svg) {
    fill: #333;
    width: 16px;
    height: 16px;
  }
</style>

<button on:click={addToClipboard} {title} aria-label={title ? title : 'Copy'}>
  {@html CopyIcon}
</button>
