<script lang="ts">
  import { dateRange } from '../../stores/date-range';
  import { createEventDispatcher, onMount } from 'svelte';
  import WidgetHeader from '../widget/widget-header/widget-header.svelte';
  import WidgetBody from '../widget/widget-body/widget-body.svelte';
  import Widget from '../widget/widget.svelte';
  import Button from '../button/button.svelte';
  import Radio from '@smui/radio';
  import FormField from '@smui/form-field';
  import EditionPicker from '../edition-picker/edition-picker.svelte';
  import type { Edition } from 'dc-management-sdk-js';
  import { selectedEdition } from '../../stores/selected-edition';
  import Chip from '../chip/chip.svelte';
  import Icon from '../icon/icon.svelte';
  import FilterIcon from '../../assets/icons/ic-filter.svg';
  import { formatDateAsISOString } from '../../utils/date-format';

  let isModalVisible = false;
  let sectionElement: HTMLElement;
  let modalPositionStyle = ``;
  let selected = 'Edition';
  let uncomittedEdition: Edition = null;

  const showModal = () => {
    const targetBound = sectionElement.getBoundingClientRect();
    modalPositionStyle = [
      `top: ${targetBound.y + targetBound.height}px`,
      `left: ${targetBound.x}px`,
    ].join(';');

    isModalVisible = true;
    uncomittedEdition = $selectedEdition;
  };

  const onApplyClick = () => {
    isModalVisible = false;
    $selectedEdition = uncomittedEdition;
    $dateRange = {
      from: formatDateAsISOString(new Date($selectedEdition.start)),
      to: formatDateAsISOString(
        $selectedEdition.activeEndDate
          ? new Date($selectedEdition.start)
          : new Date()
      ),
    };
  };

  const onCancelClick = () => {
    isModalVisible = false;
  };

  const onEditionSelected = (event) => {
    uncomittedEdition = event.detail;
  };

  const generateEditionLabel = (edition) => {
    return `${edition.event.name} / ${edition.name}`;
  };

  const resetFilter = () => {
    $selectedEdition = null;
  };
</script>

<style>
  section {
    background-color: #fff;
    height: 36px;
    width: 500px;
    padding: 5px;
    position: relative;
  }

  .modal-popup {
    background-color: #fff;
    position: fixed;
    width: 750px;
    z-index: 1;
    --webkit-box-shadow: 0 3px 13px rgba(0, 0, 0, 0.2);
    box-shadow: 0 3px 13px rgba(0, 0, 0, 0.2);
  }

  .select-filter {
    cursor: pointer;
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

  span.icon-wrapper {
    padding: 6px;
    background-color: hsl(0, 0%, 90%);
    border-radius: 4px;
    margin-right: 8px;
  }
  span.icon-wrapper.active :global(svg) {
    fill: #039be5;
  }
  span.icon-wrapper :global(div) {
    top: 5px;
    position: relative;
  }
</style>

<!-- {#if isModalVisible}
  <Overlay onClick={onCancelClick} />
{/if} -->
<section bind:this={sectionElement}>
  {#if $selectedEdition}
    <div class="selected-edition">
      <span class="icon-wrapper active">
        <Icon icon={FilterIcon} width="20px" height="20px" />
      </span>
      <span>Edition</span>
      <Chip
        label={generateEditionLabel($selectedEdition)}
        removeable={true}
        on:close={resetFilter} />
    </div>
  {:else}
    <div class="select-filter" on:click={showModal}>
      <span class="icon-wrapper">
        <Icon icon={FilterIcon} width="20px" height="20px" />
      </span>
      <span>No filters applied</span>
    </div>
  {/if}
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
          </div>
          <div slot="actions">
            <Button primary={false} onClick={onCancelClick}>Cancel</Button>
            <Button disabled={uncomittedEdition == null} onClick={onApplyClick}>
              Apply
            </Button>
          </div>
        </WidgetHeader>
        <WidgetBody>
          {#if selected === 'Edition'}
            <EditionPicker
              on:change={onEditionSelected}
              selectedEdition={uncomittedEdition ? uncomittedEdition : null} />
          {/if}
        </WidgetBody>
      </Widget>
    </div>
  {/if}
</section>
