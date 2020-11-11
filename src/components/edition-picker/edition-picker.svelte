<script lang="ts">
  import Select, { Option } from '@smui/select';
  import type { Edition } from 'dc-management-sdk-js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { hub } from '../../stores/dynamic-content';
  import Loader from '../loader/loader.svelte';
  export let selectedEdition;
  let selectValue;
  let loaded = false;
  let publishedEditions: Edition[] = [];

  const dispatch = createEventDispatcher();

  $: selectValue = handleSelectValue(selectValue);
  function handleSelectValue(option: string) {
    if (loaded) {
      const edition: Edition = publishedEditions.find(
        (publishedEdition) => publishedEdition.id === option
      );
      dispatch('change', edition);
    }

    return option;
  }

  onMount(() => {
    if ($hub) {
      loadEditions();
    }
  });

  async function loadEditions() {
    const results = (
      await $hub.related.editions.findByDate(
        {
          rangeEnd: new Date().toISOString(),
          size: 100,
          bounded: true,
          sort: 'start,desc',
        },
        'withEvent'
      )
    ).getItems();
    publishedEditions = results.filter(
      (edition) => edition.publishingStatus === 'PUBLISHED'
    );
    loaded = true;
  }
</script>

<style>
  @-moz-document url-prefix() {
    :global(.mdc-select__native-control, .mdc-select__selected-text) {
      text-indent: 0 !important;
    }
  }

  h3 {
    font-weight: 400;
  }

  .container {
    min-height: 50px;
  }

  .container :global(*) {
    font-size: 15px;
  }

  * :global(select, .select-width) {
    min-width: 600px !important;
  }
</style>

<div class="container">
  {#if !$hub}
    <div>
      <h3>Unable to load editions</h3>
    </div>
  {:else if !loaded}
    <Loader zIndex={11} />
  {:else if publishedEditions.length === 0}
    <div>
      <h3 data-testid="no-published-editions">
        Cannot find any published editions
      </h3>
    </div>
  {:else}
    <div>
      <h3>Select a recent edition...</h3>
    </div>

    <div>
      <Select
        enhanced
        bind:value={selectValue}
        label="Recent edition"
        class="select-width"
        menu$class="select-width">
        {#each publishedEditions as edition}
          <Option
            value={edition.id}
            selected={selectedEdition ? selectedEdition.id === edition.id : false}>
            {edition.event.name}
            /
            {edition.name}
            ({new Date(edition.start).toLocaleDateString()})
          </Option>
        {/each}
      </Select>
    </div>
  {/if}
</div>