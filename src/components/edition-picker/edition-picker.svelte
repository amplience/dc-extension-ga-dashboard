<script lang="ts">
  import Select, { Option } from '@smui/select';
  import type { Edition } from 'dc-management-sdk-js';
  import { onMount } from 'svelte';
  import { MAX_NUM_EDITIONS } from '../../config';
  import { hub } from '../../stores/dynamic-content';
  import Loader from '../loader/loader.svelte';

  export let selectedEdition;
  let selectValue = null;
  let loaded = false;
  let publishedEditions: Edition[] = [];

  const NONE_VALUE = 'NONE';

  $: selectValue = handleSelectValue(selectValue);
  function handleSelectValue(option: string) {
    if (loaded) {
      let edition: Edition = null;
      if (option !== NONE_VALUE) {
        edition = publishedEditions.find(
          (publishedEdition) => publishedEdition.id === option
        );
      }

      selectedEdition = edition;
    }
    return option;
  }

  onMount(() => {
    if ($hub) {
      loadEditions();
    }

    if (selectedEdition) {
      selectValue = selectedEdition.id;
    } else {
      selectValue = NONE_VALUE;
    }
  });

  async function loadEditions() {
    const results = (
      await $hub.related.editions.findByDate(
        {
          rangeStart: '1970-01-01T00:00:00.000Z',
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

    publishedEditions = publishedEditions.slice(0, MAX_NUM_EDITIONS);

    if (
      selectedEdition &&
      !publishedEditions.find((edition) => edition.id === selectedEdition.id)
    ) {
      publishedEditions.push(selectedEdition);
    }

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

  .container :global(select, .select-width) {
    min-width: 600px !important;
  }

  .container
    :global(.mdc-select:not(.mdc-select--disabled).mdc-select--focused
      .mdc-line-ripple) {
    background-color: transparent;
    border-bottom: 3px solid #42a5f5;
  }

  .container :global(.mdc-select__selected-text) {
    padding-bottom: 0;
    max-width: 715px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .container :global(.mdc-line-ripple) {
    padding-top: 0;
  }
</style>

<div class="container">
  {#if !$hub}
    <div>
      <h3>Unable to load editions</h3>
    </div>
  {:else if !loaded}
    <Loader zIndex={31} />
  {:else if publishedEditions.length === 0}
    <div>
      <h3 data-testid="no-published-editions">
        No live Editions currently exist for this hub
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
        <Option value={NONE_VALUE} selected={selectValue === NONE_VALUE}>
          None
        </Option>
        {#each publishedEditions as edition}
          <Option
            value={edition.id}
            selected={selectValue === edition.id || false}>
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
