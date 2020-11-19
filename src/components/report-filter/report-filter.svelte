<script lang="ts">
  import { dateRange, INITIAL_DATE_RANGE, NOW } from '../../stores/date-range';
  import { createEventDispatcher, onMount } from 'svelte';
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
  import { selectedEdition } from '../../stores/selected-edition';
  import Chip from '../chip/chip.svelte';
  import Icon from '../icon/icon.svelte';
  import FilterIcon from '../../assets/icons/ic-filter.svg';
  import { formatDateAsISOString } from '../../utils/date-format';
  import Overlay from '../overlay/overlay.svelte';
  import ContentItemPicker from '../content-item-picker/content-item-picker.svelte';
  import RepositoryPicker from '../repository-picker/repository-picker.svelte';
  import { selectedRepository } from '../../stores/selected-repository';
  import {
    removeSelectedContentItem,
    selectedContentItems,
  } from '../../stores/selected-content-items';
  import { gaQueryFilter } from '../../stores/ga-query-filters';

  let filterSelected: boolean;
  let isModalVisible = false;
  let sectionElement: HTMLElement;
  let modalPositionStyle = ``;
  let selected = 'Edition';
  let uncomittedEdition: Edition = null;
  let uncommitedRepository: ContentRepository = null;
  let uncomittedContentItems: ContentItem[] = [];

  const showModal = () => {
    const targetBound = sectionElement.getBoundingClientRect();
    modalPositionStyle = [
      `top: ${targetBound.y + targetBound.height}px`,
      `left: ${targetBound.x}px`,
    ].join(';');

    isModalVisible = true;
    uncomittedEdition = $selectedEdition;
    uncommitedRepository = $selectedRepository;
    uncomittedContentItems = $selectedContentItems;
    setSelectedTab();
  };

  const applyEditionFilter = () => {
    $selectedEdition = uncomittedEdition;
    const updatedDateRange = {
      to: formatDateAsISOString(new Date(NOW)),
      from: formatDateAsISOString(new Date($selectedEdition.start)),
    };
    if ($selectedEdition.activeEndDate) {
      updatedDateRange.to = formatDateAsISOString(
        new Date($selectedEdition.end)
      );
    }

    $dateRange = updatedDateRange;
  };

  const applyContentFilter = () => {
    $selectedRepository = uncommitedRepository;
    $selectedContentItems = uncomittedContentItems;
  };

  const onApplyClick = () => {
    isModalVisible = false;
    resetFilter();

    switch (selected) {
      case 'Edition':
        applyEditionFilter();
        break;

      case 'Content':
        applyContentFilter();
        break;

      default:
        break;
    }
  };

  const onCancelClick = () => {
    isModalVisible = false;
  };

  const onEditionSelected = (event) => {
    uncomittedEdition = event.detail;
  };

  const onRepositorySelected = (event) => {
    uncommitedRepository = event.detail;
  };

  const onContentItemsSelected = (event) => {
    uncomittedContentItems = event.detail;
  };

  const generateEditionLabel = (edition) => {
    return `${edition.event.name} / ${edition.name}`;
  };

  const resetFilter = () => {
    $selectedEdition = null;
    $selectedRepository = null;
    $selectedContentItems = [];
    $dateRange = INITIAL_DATE_RANGE;
  };

  const setSelectedTab = () => {
    if (uncomittedContentItems.length > 0) {
      selected = 'Content';
    } else {
      selected = 'Edition';
    }
  };
</script>

<style>
  section {
    background-color: #fff;
    padding: 5px;
    position: relative;
    z-index: 3;
  }

  .modal-popup {
    background-color: #fff;
    position: fixed;
    width: 750px;
    z-index: 1;
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
    margin: 0px 18px 50px;
    min-height: unset;
  }
  section :global(.widget-header [slot='actions'] button) {
    margin-right: 8px;
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
    font-size: 15px;
  }
</style>

{#if isModalVisible}
  <Overlay onClick={onCancelClick} />
{/if}
<section bind:this={sectionElement}>
  <div class="report-filter">
    <div
      class="filter-selector"
      data-testid="display-modal-button"
      on:click={showModal}>
      <div class={`icon-wrapper ${$gaQueryFilter ? 'active ' : ''}`}>
        <Icon icon={FilterIcon} width="20px" height="20px" />
      </div>
      <div>
        {#if $selectedEdition}
          Edition
        {:else if $selectedRepository && $selectedContentItems.length > 0}
          {$selectedRepository.name}
        {:else}No filters applied{/if}
      </div>
    </div>
    <div class="filter-chips">
      {#if $selectedEdition}
        <Chip
          label={generateEditionLabel($selectedEdition)}
          removeable={true}
          on:close={resetFilter}
          on:click={showModal}
          clickable={true} />
      {:else if $selectedContentItems.length > 0}
        {#each $selectedContentItems as contentItem}
          <Chip
            label={contentItem.label}
            removeable={true}
            on:close={() => removeSelectedContentItem(contentItem)}
            on:click={showModal}
            clickable={true} />
        {/each}
      {/if}
    </div>
  </div>
  {#if isModalVisible}
    <div class="modal-popup" style={modalPositionStyle}>
      <Widget>
        <WidgetHeader>
          <div slot="title">
            <h3>Filter by</h3>
            <FormField>
              <Radio bind:group={selected} value="Edition" />
              <span slot="label">Edition</span>
            </FormField>
            <FormField>
              <Radio
                data-testid="content-radio"
                bind:group={selected}
                value="Content" />
              <span slot="label">Content</span>
            </FormField>
          </div>
          <div slot="actions">
            <Button primary={false} onClick={onCancelClick}>Cancel</Button>
            <Button
              disabled={uncomittedContentItems.length === 0 && uncomittedEdition === null}
              onClick={onApplyClick}>
              Apply
            </Button>
          </div>
        </WidgetHeader>
        <WidgetBody>
          {#if selected === 'Edition'}
            <EditionPicker
              on:change={onEditionSelected}
              selectedEdition={uncomittedEdition ? uncomittedEdition : null} />
          {:else if selected === 'Content'}
            <div class="content-chooser">
              <h3>Select content items (max 5 from single repository)</h3>
              <RepositoryPicker
                on:change={onRepositorySelected}
                selectedRepository={uncommitedRepository ? uncommitedRepository : null}
                selectedContentItems={uncomittedContentItems ? uncomittedContentItems : null} />
              <ContentItemPicker
                on:change={onContentItemsSelected}
                selectedRepository={uncommitedRepository ? uncommitedRepository : null}
                selectedContentItems={uncomittedContentItems} />
            </div>
          {/if}
        </WidgetBody>
      </Widget>
    </div>
  {/if}
</section>
