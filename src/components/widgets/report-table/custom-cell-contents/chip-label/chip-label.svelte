<script lang="ts">
  import Chip from '../../../../chip/chip.svelte';

  export let value: string;
  export let index: number;
</script>

<Chip label={value} />
