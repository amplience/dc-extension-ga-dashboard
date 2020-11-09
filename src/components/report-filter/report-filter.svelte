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

  let isModalVisible = false;
  let sectionElement: HTMLElement;
  let modalPositionStyle = ``;
  let selected = 'Edition';
  let uncomittedEdition: Edition = null;

  const dispatch = createEventDispatcher();

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

    dispatch('dateSelected', {
      option: dateRange,
    });
  };

  const onCancelClick = () => {
    isModalVisible = false;
  };

  function onEditionSelected(event) {
    uncomittedEdition = event.detail;
  }
</script>

<style>
  section {
    background-color: #fff;
    height: 36px;
    width: 360px;
    padding: 5px;
    position: relative;
  }

  .modal-popup {
    background-color: #fff;
    position: fixed;
    width: 500px;
    z-index: 1;
    --webkit-box-shadow: 0 3px 13px rgba(0, 0, 0, 0.2);
    box-shadow: 0 3px 13px rgba(0, 0, 0, 0.2);
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
    padding: 12px;
  }
  section :global(.widget-header [slot='actions'] button) {
    margin-right: 8px;
  }
</style>

<!-- {#if isModalVisible}
  <Overlay onClick={onCancelClick} />
{/if} -->
<section bind:this={sectionElement} class={isModalVisible ? 'active' : ''}>
  <div on:click={showModal}><span>No filters applied</span></div>
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
