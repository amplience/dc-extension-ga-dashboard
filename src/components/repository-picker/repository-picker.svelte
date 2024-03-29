<script lang="ts">
  import Select, { Option } from '@smui/select';
  import type { ContentItem, ContentRepository } from 'dc-management-sdk-js';
  import { onMount } from 'svelte';
  import { hub } from '../../stores/dynamic-content';
  import Loader from '../loader/loader.svelte';

  export let repositoryFeature = null;
  export let selectedContentRepository: ContentRepository;
  export let selectedContentItems: ContentItem[];

  let selectValue;
  let loaded = false;
  let repositories: ContentRepository[] = [];

  $: selectValue = handleSelectValue(selectValue);

  const handleSelectValue = (option: string) => {
    if (loaded) {
      const currentlySelected = repositories.find(
        (repository) => repository.id === option
      );

      if (
        currentlySelected !== selectedContentRepository ||
        (currentlySelected &&
          selectedContentRepository &&
          currentlySelected?.id !== selectedContentRepository?.id)
      ) {
        selectedContentRepository = currentlySelected;
      }
    }

    return option;
  };

  onMount(async () => {
    if ($hub) {
      loadRepositories();
    }
  });

  const loadRepositories = async () => {
    loaded = false;
    if (repositoryFeature === null) {
      repositories = (
        await $hub.related.contentRepositories.list({ size: 100 })
      )
        .getItems()
        .filter((repository) => repository.features.length === 0);
    } else {
      repositories = (
        await $hub.related.contentRepositories.findByFeature(
          repositoryFeature,
          { size: 100 }
        )
      ).getItems();
    }

    if (selectedContentRepository) {
      selectValue = selectedContentRepository.id;
      selectedContentRepository = repositories.find(
        (repository) => repository.id === selectedContentRepository.id
      );
    }

    if (!selectValue && repositories.length > 0) {
      selectValue = repositories[0].id;
      selectedContentRepository = selectValue;
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
    padding-bottom: 12px;
  }

  .container :global(*) {
    font-size: 14px;
  }

  .container :global(select, .select-width) {
    min-width: 600px !important;
  }

  .container
    :global(.mdc-select:not(.mdc-select--disabled).mdc-select--focused
      .mdc-line-ripple) {
    background-color: transparent;
    border-bottom: 2px solid #42a5f5;
  }

  .container :global(.mdc-select__selected-text) {
    padding-bottom: 0;
    max-width: 715px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .container :global(.mdc-select--activated .mdc-select__dropdown-icon) {
    transform: unset;
  }

  .container :global(.mdc-select__dropdown-icon) {
    bottom: 6px;
  }

  .container :global(.mdc-line-ripple) {
    padding-top: 0;
  }

  div.repository-label {
    max-width: 600px;
    font-weight: 400;
    border-bottom: 1px solid #33333380;
    letter-spacing: 0.00937em;
  }
  div.repository-label span {
    color: #33333399;
    font-size: 0.825rem;
  }

  div.repository-label h3 {
    font-size: 14.2px;
    color: #333333c7;
    margin-top: 8px;
    margin-bottom: 8px;
  }
</style>

<div class="container">
  {#if !$hub}
    <div>
      <h3>Unable to load repositories</h3>
    </div>
  {:else if !loaded}
    <Loader zIndex={31} />
  {:else if repositories.length === 0}
    <div>
      <h3 data-testid="no-repositories">
        No repositories currently exist for this hub
      </h3>
    </div>
  {:else if repositories.length === 1}
    <div class="repository-label">
      <span>Repository</span>
      <h3 data-testid="one-repository">{repositories[0].name}</h3>
    </div>
  {:else}
    <div>
      <Select
        enhanced
        label="Repository"
        bind:value={selectValue}
        class="select-width"
        menu$class="select-width"
        disabled={selectedContentItems.length > 0}>
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
