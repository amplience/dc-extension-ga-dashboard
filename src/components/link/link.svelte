<script lang="ts">
  export let href: string;
  export let linkTarget = '_self';

  const onClick = (event: Event) => {
    if (window.parent) {
      window.parent.location.href = href;
      return event.preventDefault();
    }
  };
</script>

<style>
  a {
    color: #039be5;
    transition: color 0.3s;
    text-decoration: none;
  }
  a:hover {
    color: #1ab0f9;
  }
</style>

<a {href} on:click={onClick} target={linkTarget}><slot /></a>
