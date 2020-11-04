<script lang="ts">
  export let href: string;
  export let text: string;
  export let linkTarget = '_self';
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

<a {href} target={linkTarget}>{text}</a>
