<script lang="ts">
  import Select, { Option } from '@smui/select';
  import type { ContentItem, ContentRepository } from 'dc-management-sdk-js';
  import { createEventDispatcher, onMount } from 'svelte';
  import { hub } from '../../stores/dynamic-content';
  import Loader from '../loader/loader.svelte';

  export let selectedRepository: ContentRepository;
  export let selectedContentItems: ContentItem[];
  let selectValue;
  let loaded = false;
  let repositories: ContentRepository[] = [];

  const dispatch = createEventDispatcher();

  $: selectValue = handleSelectValue(selectValue);
  const handleSelectValue = (option: string) => {
    if (loaded) {
      const repository: ContentRepository = repositories.find(
        (repository) => repository.id === option
      );
      dispatch('change', repository);
    }

    return option;
  };

  onMount(() => {
    if ($hub) {
      loadRepositories();
    }
  });

  const loadRepositories = async () => {
    repositories = (await $hub.related.contentRepositories.list()).getItems();
    if (!selectValue && repositories.length) {
      selectValue = repositories[0].id;
    }
    if (selectedRepository) {
      selectValue = selectedRepository.id;
      selectedRepository = repositories.find(
        (repository) => repository.id === selectedRepository.id
      );
    }
    loaded = true;
  };
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
      <h3>Unable to load repositories</h3>
    </div>
  {:else if !loaded}
    <Loader zIndex={11} />
  {:else if repositories.length === 0}
    <div>
      <h3 data-testid="no-repositories">
        No repositories currently exist for this hub
      </h3>
    </div>
  {:else}
    <div>
      <h3>Repository</h3>
    </div>

    <div>
      <Select
        bind:value={selectValue}
        class="select-width"
        menu$class="select-width"
        disabled={repositories.length < 2 || selectedContentItems.length > 0}>
        {#each repositories as repository}
          <Option
            value={repository.id}
            selected={selectValue === repository.id || false}>
            {repository.name}
          </Option>
        {/each}
      </Select>
    </div>
  {/if}
</div>
