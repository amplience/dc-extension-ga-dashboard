<script lang="ts">
  export let message: string;
</script>

<style>
  div {
    display: flex;
    background-color: white;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
  }

  p {
    font-weight: 500;
  }
</style>

<div>
  <p>{message}</p>
</div>
