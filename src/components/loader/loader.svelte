<script>
  const dots = new Array(3);
  export let zIndex = 10;
</script>

<style>
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: var(--z-index);
    width: 100%;
    height: 100%;
    opacity: 0.8;
    transition: opacity 0.3s;
  }

  .spinner {
    width: 8px;
    height: 8px;
    margin: 1px;
    background-color: #666;
    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  .dot-1 {
    animation-delay: -0.16s !important;
  }

  .dot-2 {
    animation-delay: -0.32s !important;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
</style>

<div class="spinner-container" style="--z-index: {zIndex}">
  {#each dots as dot, i}
    <div class="spinner dot-{i}" />
  {/each}
</div>
