<script lang="ts">
  import {
    generateCsvBlob,
    createDownloadElement,
  } from './download-csv.service';
  import Icon from '../icon/icon.svelte';
  import DownloadIcon from '../../assets/icons/ic-download.svg';
  import { createEventDispatcher } from 'svelte';

  export let label: string = '';
  export let fileName: string;
  export let fetchCsvData: () => unknown;

  const dispatch = createEventDispatcher();

  async function onClick() {
    const data = await fetchCsvData();
    const csvBlob = await generateCsvBlob(data);
    let csvFilename = `${fileName}.csv`;
    const downloadElement = createDownloadElement(csvBlob, csvFilename);
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);

    dispatch('downloadCsv', {
      filename: csvFilename,
    });
  }
</script>

<style>
  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
  }

  button :global(svg) {
    width: 16px;
    height: 20px;
    color: #666;
  }

  button span {
    color: #039be5;
    margin-right: 4px;
  }
</style>

<button
  on:click={onClick}
  class="download-csv-button"
  data-testid="download-csv-button"
  title="Download CSV (max 1000)">
  {#if label}
    <span>{label}</span>
  {/if}
  <Icon icon={DownloadIcon} />
</button>
