<script lang="ts">
  import { dateRange, INITIAL_DATE_RANGE, NOW } from '../../stores/date-range';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import WidgetHeader from '../widget/widget-header/widget-header.svelte';
  import WidgetBody from '../widget/widget-body/widget-body.svelte';
  import Widget from '../widget/widget.svelte';
  import Button from '../button/button.svelte';
  import Radio from '@smui/radio';
  import FormField from '@smui/form-field';
  import EditionPicker from '../edition-picker/edition-picker.svelte';
  import type {
    ContentItem,
    ContentRepository,
    Edition,
  } from 'dc-management-sdk-js';
  import { selectedEdition } from '../../stores/filter/selected-edition';
  import Chip from '../chip/chip.svelte';
  import Icon from '../icon/icon.svelte';
  import FilterIcon from '../../assets/icons/ic-filter.svg';
  import { formatDateAsISOString } from '../../utils/date-format';
  import Overlay from '../overlay/overlay.svelte';
  import ContentItemPicker from '../content-item-picker/content-item-picker.svelte';
  import RepositoryPicker from '../repository-picker/repository-picker.svelte';
  import { selectedContentRepository } from '../../stores/filter/selected-content-repository';
  import { selectedContentItems } from '../../stores/filter/selected-content-items';
  import { gaQueryFilter } from '../../stores/ga-query-filters';
  import { selectedSlotsRepository } from '../../stores/filter/selected-slots-repository';
  import { selectedSlots } from '../../stores/filter/selected-slots';
  import { FILTERS, selectedFilter } from '../../stores/filter/selected-filter';
  import { get } from 'svelte/store';
  import type { Writable } from 'svelte/store';
  import {
    MAX_NUMBER_OF_SELECTABLE_CONTENT_ITEMS,
    MAX_NUMBER_OF_SELECTABLE_SLOTS,
  } from '../../config';
  import {
    contentItemIdMapping,
    editionIdMapping,
    slotIdMapping,
  } from '../../stores/google-analytics';

  let isModalVisible = false;
  let sectionElement: HTMLElement;
  let modalPositionStyle = ``;

  let currentlySelectedFilter: FILTERS;
  let uncomittedEdition: Edition = null;
  let uncommitedContentRepository: ContentRepository = null;
  let uncomittedContentItems: ContentItem[] = [];
  let uncommitedSlotsRepository: ContentRepository = null;
  let uncomittedSlots: ContentItem[] = [];

  const showModal = () => {
    const targetBound = sectionElement.getBoundingClientRect();
    modalPositionStyle = [
      `top: ${targetBound.y + targetBound.height}px`,
      `left: ${targetBound.x}px`,
    ].join(';');

    isModalVisible = true;
    uncomittedEdition = $selectedEdition;
    uncommitedContentRepository = $selectedContentRepository;
    uncomittedContentItems = $selectedContentItems;
    uncommitedSlotsRepository = $selectedSlotsRepository;
    uncomittedSlots = $selectedSlots;
    currentlySelectedFilter = $selectedFilter || FILTERS.EDITION;
  };

  const applyEditionFilter = (): boolean => {
    resetContentItemFilter();
    resetSlotFilter();

    $selectedEdition = uncomittedEdition;
    const updatedDateRange = {
      ...INITIAL_DATE_RANGE,
    };
    if ($selectedEdition) {
      updatedDateRange.to = formatDateAsISOString(new Date(NOW));
      updatedDateRange.from = formatDateAsISOString(
        new Date($selectedEdition.start)
      );
      if ($selectedEdition.activeEndDate) {
        updatedDateRange.to = formatDateAsISOString(
          new Date($selectedEdition.end)
        );
      }
    }

    $dateRange = updatedDateRange;
    return $selectedEdition ? true : false;
  };

  const applyContentFilter = (): boolean => {
    resetDateRange();
    resetEditionFilter();
    resetSlotFilter();

    $selectedContentRepository = uncommitedContentRepository;
    $selectedContentItems = uncomittedContentItems;

    return $selectedContentItems.length > 0 ? true : false;
  };

  const applySlotFilter = (): boolean => {
    resetDateRange();
    resetEditionFilter();
    resetContentItemFilter();

    $selectedSlotsRepository = uncommitedSlotsRepository;
    $selectedSlots = uncomittedSlots;

    return $selectedSlots.length > 0 ? true : false;
  };

  const onApplyClick = () => {
    isModalVisible = false;

    const applyFilters: Record<FILTERS, () => boolean> = {
      EDITION: () => applyEditionFilter(),
      CONTENT: () => applyContentFilter(),
      SLOT: () => applySlotFilter(),
    };

    if (applyFilters[currentlySelectedFilter]()) {
      $selectedFilter = currentlySelectedFilter;
    } else {
      $selectedFilter = null;
    }
  };

  const onCancelClick = () => {
    isModalVisible = false;
  };

  const generateEditionLabel = (edition) => {
    return `${edition.event.name} / ${edition.name}`;
  };

  const resetDateRange = () => ($dateRange = INITIAL_DATE_RANGE);
  const resetEditionFilter = () => ($selectedEdition = null);
  const resetContentItemFilter = () => {
    $selectedContentRepository = null;
    $selectedContentItems = [];
  };
  const resetSlotFilter = () => {
    $selectedSlotsRepository = null;
    $selectedSlots = [];
  };

  const resetFilter = () => {
    $selectedFilter = null;
    resetEditionFilter();
    resetContentItemFilter();
    resetSlotFilter();
    resetDateRange();
  };

  const subscriptions: (() => void)[] = [];
  onMount(() => {
    subscriptions.push(
      selectedContentItems.subscribe((updatedSelectedContentItems) => {
        uncomittedContentItems = updatedSelectedContentItems;
      })
    );

    subscriptions.push(
      selectedSlots.subscribe((updatedSelectedSlots) => {
        uncomittedSlots = updatedSelectedSlots;
      })
    );
  });
  onDestroy(() => {
    subscriptions.forEach((subscription) => subscription());
  });

  export const removeSelectedContentItem = (
    contentItemStore: Writable<ContentItem[]>,
    contentItem: ContentItem
  ): void => {
    contentItemStore.set(
      get(contentItemStore).filter(
        (storedContentItem: ContentItem) =>
          storedContentItem.id !== contentItem.id
      )
    );

    if (get(contentItemStore).length === 0) {
      resetFilter();
    }
  };
</script>

<style>
  section {
    background-color: #fff;
    padding: 5px;
    position: relative;
    z-index: 23;
  }

  .modal-popup {
    background-color: #fff;
    position: fixed;
    width: 750px;
    z-index: 20;
    --webkit-box-shadow: 0 3px 13px rgba(0, 0, 0, 0.2);
    box-shadow: 0 3px 13px rgba(0, 0, 0, 0.2);
  }

  .report-filter {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .filter-selector {
    display: flex;
    align-items: center;
    margin-right: 12px;
    cursor: pointer;
  }

  .filter-chips {
    display: flex;
    align-items: center;
  }

  section :global(.widget-header [slot='title'] h3) {
    font-size: 16px;
    margin: auto 32px auto 0;
  }
  section :global(.widget-header [slot='title']) {
    justify-content: center;
    display: flex;
    flex-direction: row;
  }

  section :global(.widget-header) {
    height: 54px;
    padding: 12px 12px 12px 18px;
  }

  section :global(.widget-body) {
    margin: 12px 36px 16px;
    min-height: 150px;
  }
  section :global(.widget-header [slot='actions'] button) {
    margin-right: 8px;
  }

  section :global(.widget-header [slot='label']) {
    margin-right: 16px;
    font-size: 16px;
  }

  section div.selected-edition span {
    margin-right: 12px;
  }

  div.icon-wrapper {
    height: 30px;
    width: 30px;
    padding: 5px;
    background-color: hsl(0, 0%, 90%);
    border-radius: 4px;
    margin-right: 8px;
  }

  div.icon-wrapper.active :global(svg) {
    fill: #039be5;
  }

  div.content-chooser {
    display: flex;
    flex-direction: column;
  }

  div.content-chooser h3 {
    font-size: 16px;
  }

  div.content-chooser h3 span {
    font-size: 15px;
    color: #666;
  }

  span.selected-repository {
    font-weight: bold;
  }

  div.no-filters {
    height: 40px;
  }
</style>

{#if isModalVisible}
  <Overlay onClick={onCancelClick} />
{/if}
{#if !$contentItemIdMapping && !$editionIdMapping && !$slotIdMapping}
  <div class="no-filters" />
{:else}
  <section bind:this={sectionElement}>
    <div class="report-filter">
      <div
        class="filter-selector"
        data-testid="display-modal-button"
        on:click={showModal}>
        <div class={`icon-wrapper ${$gaQueryFilter ? 'active ' : ''}`}>
          <Icon icon={FilterIcon} width="20px" height="20px" />
        </div>
        <div class="filter-chips">
          {#if $selectedFilter == FILTERS.EDITION && $selectedEdition}
            Edition
          {:else if $selectedFilter == FILTERS.CONTENT && $selectedContentRepository && $selectedContentItems.length > 0}
            Repository
            <span
              class="selected-repository">{$selectedContentRepository.name}</span>
          {:else if $selectedFilter == FILTERS.SLOT && $selectedSlotsRepository && $selectedSlots.length > 0}
            Repository
            <span
              class="selected-repository">{$selectedSlotsRepository.name}</span>
          {:else}No filters applied{/if}
        </div>
      </div>
    </div>
    <div class="filter-chips">
      {#if $selectedFilter == FILTERS.EDITION && $selectedEdition}
        <Chip
          label={generateEditionLabel($selectedEdition)}
          removeable={true}
          on:close={resetFilter}
          on:click={showModal}
          clickable={true} />
      {:else if $selectedFilter == FILTERS.CONTENT && $selectedContentItems.length > 0}
        {#each $selectedContentItems as contentItem}
          <Chip
            label={contentItem.label}
            removeable={true}
            on:close={() => removeSelectedContentItem(selectedContentItems, contentItem)}
            on:click={showModal}
            clickable={true} />
        {/each}
      {:else if $selectedFilter == FILTERS.SLOT && $selectedSlots.length > 0}
        {#each $selectedSlots as contentItem}
          <Chip
            label={contentItem.label}
            removeable={true}
            on:close={() => removeSelectedContentItem(selectedSlots, contentItem)}
            on:click={showModal}
            clickable={true} />
        {/each}
      {/if}
    </div>
    {#if isModalVisible}
      <div class="modal-popup" style={modalPositionStyle}>
        <Widget>
          <WidgetHeader>
            <div slot="title">
              <h3>Filter by</h3>
              {#if $editionIdMapping}
                <FormField>
                  <Radio
                    bind:group={currentlySelectedFilter}
                    value={FILTERS.EDITION} />
                  <span slot="label">Edition</span>
                </FormField>
              {/if}
              {#if $contentItemIdMapping}
                <FormField>
                  <Radio
                    data-testid="content-radio"
                    bind:group={currentlySelectedFilter}
                    value={FILTERS.CONTENT} />
                  <span slot="label">Content</span>
                </FormField>
              {/if}
              {#if $slotIdMapping}
                <FormField>
                  <Radio
                    data-testid="content-radio"
                    bind:group={currentlySelectedFilter}
                    value={FILTERS.SLOT} />
                  <span slot="label">Slot</span>
                </FormField>
              {/if}
            </div>
            <div slot="actions">
              <Button primary={false} onClick={onCancelClick}>Cancel</Button>
              <Button onClick={onApplyClick}>Apply</Button>
            </div>
          </WidgetHeader>
          <WidgetBody>
            {#if currentlySelectedFilter === FILTERS.EDITION && $editionIdMapping}
              <EditionPicker bind:selectedEdition={uncomittedEdition} />
            {:else if currentlySelectedFilter === FILTERS.CONTENT && $contentItemIdMapping}
              <div class="content-chooser">
                <h3>Select content items (max 5 from single repository)</h3>
                <RepositoryPicker
                  bind:selectedContentRepository={uncommitedContentRepository}
                  bind:selectedContentItems={uncomittedContentItems} />
                <ContentItemPicker
                  maxNumberOfSelectableItems={MAX_NUMBER_OF_SELECTABLE_CONTENT_ITEMS}
                  bind:selectedContentRepository={uncommitedContentRepository}
                  bind:selectedContentItems={uncomittedContentItems} />
              </div>
            {:else if currentlySelectedFilter === FILTERS.SLOT && $slotIdMapping}
              <div class="content-chooser">
                <h3>Select slots (max 5 from single repository)</h3>
                <RepositoryPicker
                  repositoryFeature="slots"
                  bind:selectedContentRepository={uncommitedSlotsRepository}
                  bind:selectedContentItems={uncomittedSlots} />
                <ContentItemPicker
                  maxNumberOfSelectableItems={MAX_NUMBER_OF_SELECTABLE_SLOTS}
                  bind:selectedContentRepository={uncommitedSlotsRepository}
                  bind:selectedContentItems={uncomittedSlots} />
              </div>
            {/if}
          </WidgetBody>
        </Widget>
      </div>
    {/if}
  </section>
{/if}
