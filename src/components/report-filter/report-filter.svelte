<script lang="ts">
  import { dateRange } from '../../stores/date-range';
  import { onDestroy, createEventDispatcher, onMount } from 'svelte';
  import Button from '../button/button.svelte';
  import Overlay from '../overlay/overlay.svelte';

  let isModalVisible = false;
  let sectionElement: HTMLElement;
  let okButton: HTMLButtonElement;
  let modalPositionStyle = ``;
  let isOkButtonDisabled = true;

  const dispatch = createEventDispatcher();

  const showModal = () => {
    const targetBound = sectionElement.getBoundingClientRect();
    modalPositionStyle = [
      `top: ${targetBound.y + targetBound.height}px`,
      `left: ${targetBound.x}px`,
      `width: ${targetBound.width}px`,
    ].join(';');

    isModalVisible = true;
  };

  const onOkClick = () => {
    isModalVisible = false;

    dispatch('dateSelected', {
      option: dateRange,
    });
  };

  const onCancelClick = () => {
    isModalVisible = false;
  };
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
    z-index: 1;
    --webkit-box-shadow: 0 3px 13px rgba(0, 0, 0, 0.08);
    box-shadow: 0 3px 13px rgba(0, 0, 0, 0.08);
  }
</style>

{#if isModalVisible}
  <Overlay onClick={onCancelClick} />
{/if}
<section bind:this={sectionElement} class={isModalVisible ? 'active' : ''}>
  <div on:click={showModal}><span>No filters applied</span></div>
  {#if isModalVisible}
    <div class="modal-popup" style={modalPositionStyle}>
      <div>
        <Button onClick={onOkClick}>Apply</Button>
      </div>
    </div>
  {/if}
</section>
