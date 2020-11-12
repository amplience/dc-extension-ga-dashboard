<script lang="ts">
  import type Flatpickr from 'flatpickr';
  import 'flatpickr/dist/themes/material_blue.css';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import SvelteFlatpickr from 'svelte-flatpickr';
  import CalendarIcon from '../../assets/icons/ic-view-calendar.svg';
  import type { DateRange } from '../../stores/date-range';
  import { dateRange, DAY, NOW } from '../../stores/date-range';
  import { formatDateAsISOString } from '../../utils/date-format';
  import Button from '../button/button.svelte';
  import Chip from '../chip/chip.svelte';
  import Icon from '../icon/icon.svelte';
  import Overlay from '../overlay/overlay.svelte';
  import './date-range-picker.css';

  let dateFormat = 'Y-m-d';
  let showDatePicker = false;
  let dateRangeInput: HTMLElement;
  let fromInput: HTMLInputElement;
  let toInput: HTMLInputElement;
  let okButton: HTMLButtonElement;
  let svleteFlatPickrElement: SvelteFlatpickr;
  let datePickerPopupPositionStyle = ``;
  let isOkButtonDisabled = true;
  let activeChip = null;

  let flatPickrDate;
  let uncommitDateRange: DateRange;

  const dispatch = createEventDispatcher();
  const dateRangeChips: { label: string; range: [Date, Date] }[] = [
    {
      label: 'Last 30 days',
      range: [new Date(NOW - DAY * 30), new Date(NOW - DAY)],
    },
    {
      label: 'Last week',
      range: [
        new Date(NOW - DAY * (7 + new Date().getDay())),
        new Date(NOW - DAY * (new Date().getDay() + 1)),
      ],
    },
    {
      label: 'Yesterday',
      range: [new Date(NOW - DAY), new Date(NOW - DAY)],
    },
    {
      label: 'Today',
      range: [new Date(NOW), new Date(NOW)],
    },
  ];

  const setDateRangeDates = () => {
    fromInput.value = new Date($dateRange.from).toLocaleDateString();
    toInput.value = new Date($dateRange.to).toLocaleDateString();
    flatPickrDate = [$dateRange.from, $dateRange.to];
  };

  const onDateRangeChange = (
    selectedDates: [Date?, Date?],
    dateString: string
  ) => {
    if (dateString) {
      activeChip = null;
    }
    if (selectedDates.length > 0) {
      fromInput.value = selectedDates[0].toLocaleDateString();
      toInput.focus();
      isOkButtonDisabled = true;
      toInput.value = '';
    }
    if (selectedDates.length > 1) {
      toInput.value = selectedDates[1].toLocaleDateString();
      uncommitDateRange = {
        from: formatDateAsISOString(selectedDates[0]),
        to: formatDateAsISOString(selectedDates[1]),
      };
      toInput.blur();
      okButton.focus();
      isOkButtonDisabled = false;
    }
  };

  const onInputClick = () => {
    const targetBound = dateRangeInput.getBoundingClientRect();
    datePickerPopupPositionStyle = [
      `top: ${targetBound.y + targetBound.height}px`,
      `left: ${targetBound.x}px`,
      `width: ${targetBound.width}px`,
    ].join(';');

    const matchingChip = dateRangeChips.find((chip) => {
      if (
        formatDateAsISOString(chip.range[0]) == $dateRange.from &&
        formatDateAsISOString(chip.range[1]) == $dateRange.to
      ) {
        return chip;
      }
    });
    activeChip = null;
    if (matchingChip) {
      activeChip = matchingChip;
    }

    showDatePicker = true;
    fromInput.focus();
  };

  const onOkClick = () => {
    showDatePicker = false;
    $dateRange = uncommitDateRange;
    setDateRangeDates();

    dispatch('dateSelected', {
      option: dateRange,
    });
  };

  const onCancelClick = () => {
    showDatePicker = false;
    activeChip = null;
    setDateRangeDates();
  };

  const flatpickrOptions: Flatpickr.Options.Options = {
    mode: 'range',
    dateFormat,
    maxDate: new Date(NOW),
    clickOpens: false,
    inline: true,
    closeOnSelect: false,
    onChange: onDateRangeChange,
  };

  const onChipClick = (chip) => {
    activeChip = chip;
    flatPickrDate = chip.range;
    onDateRangeChange(flatPickrDate, '');
  };

  const subscriptions = [];
  onMount(() => {
    setDateRangeDates();
    subscriptions.push(dateRange.subscribe(() => setDateRangeDates()));
  });
  onDestroy(() => subscriptions.forEach((subscription) => subscription()));
</script>

<style>
  section {
    background-color: #fff;
    height: 36px;
    width: 360px;
    padding: 5px;
    position: relative;
  }

  section.active {
    z-index: 2;
  }

  .date-range-inputs {
    display: flex;
    align-items: center;
  }

  .date-range-inputs > div.date-selection {
    display: flex;
    align-items: center;
    border-bottom: 3px solid #fff;
    cursor: pointer;
    width: 100%;
    padding-left: 12px;
  }

  .date-range-inputs > div.date-selection:focus-within {
    border-bottom: 3px solid #42a5f5;
  }

  .date-range-inputs > div.date-selection:focus-within :global(i) {
    color: 3px solid #42a5f5;
  }

  .date-range-inputs > div.date-selection > input {
    width: 125px;
    margin: 0;
    border: none;
    cursor: pointer;
    text-align: center;
  }
  section > .date-range-inputs input:focus {
    outline: none;
  }
  .date-range-inputs
    > div.date-selection:focus-within
    :global(div.calendar-icon) {
    color: #42a5f5;
  }
  .date-picker-popup {
    background-color: #fff;
    position: fixed;
    z-index: 1;
    --webkit-box-shadow: 0 3px 13px rgba(0, 0, 0, 0.08);
    box-shadow: 0 3px 13px rgba(0, 0, 0, 0.08);
  }

  .chips {
    display: flex;
    justify-content: center;
    padding-top: 18px;
    padding-bottom: 18px;
    border-bottom: #eee 1px solid;
  }

  .date-picker-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 12px 26px 32px 26px;
    color: #666;
  }

  :global(.flatpickr-months .flatpickr-month, .flatpickr-current-month) {
    height: 38px;
  }

  :global(.flatpickr-current-month
      .flatpickr-monthDropdown-months, .flatpickr-months
      .flatpickr-month, .flatpickr-current-month
      .flatpickr-monthDropdown-months
      .flatpickr-monthDropdown-month) {
    background-color: #fff;
    color: #333;
  }

  :global(.flatpickr-current-month
      input.cur-year[disabled], .flatpickr-current-month
      input.cur-year[disabled]:hover) {
    color: #333;
  }

  :global(.flatpickr-weekdays) {
    height: 38px;
    padding: 0 28px;
  }

  :global(.flatpickr-weekdays, span.flatpickr-weekday) {
    background-color: #e5e5e5;
    color: #333;
    font-weight: 400;
    font-size: 13px;
  }

  :global(.flatpickr-day, .flatpickr-day.endRange.startRange, .flatpickr-day.selected.startRange, .flatpickr-day.startRange.startRange, .flatpickr-day.endRange.endRange, .flatpickr-day.selected.endRange, .flatpickr-day.startRange.endRange, .flatpickr-day.endRange.startRange.endRange, .flatpickr-day.selected.startRange.endRange, .flatpickr-day.startRange.startRange.endRange) {
    border-radius: 0;
  }

  :global(.flatpickr-day.inRange, .flatpickr-day.nextMonthDay.inRange, .flatpickr-day.nextMonthDay.today.inRange, .flatpickr-day.prevMonthDay.inRange, .flatpickr-day.prevMonthDay.today.inRange, .flatpickr-day.today.inRange) {
    background: #daebf9;
    border-color: #daebf9;
    box-shadow: -5px 0 0 #daebf9, 5px 0 0 #daebf9;
  }

  :global(.flatpickr-day:not(.flatpickr-disabled).prevMonthDay:hover, .flatpickr-day:not(.flatpickr-disabled).nextMonthDay:hover, .flatpickr-day:not(.flatpickr-disabled):hover) {
    background-color: #b5b5b5;
    border-color: #b5b5b5;
  }

  :global(.flatpickr-day.selected:hover, .flatpickr-day.selected.endRange:hover) {
    background-color: #039be5;
    border-color: #039be5;
    color: #fff;
  }

  :global(.flatpickr-day.startRange:hover, .flatpickr-day.endRange:hover) {
    background: #42a4f566;
    border-color: #42a4f566;
    color: #333;
  }
  :global(.flatpickr-calendar) {
    margin: auto;
    border-radius: unset;
    -webkit-box-shadow: unset;
    box-shadow: unset;
    width: 100%;
  }
  :global(.flatpickr-innerContainer) {
    border-bottom: unset;
  }
  :global(.flatpickr-days) {
    border-left: unset;
    border-right: unset;
  }

  :global(.flatpickr-current-month .numInputWrapper) {
    width: 8ch;
  }

  :global(.flatpickr-current-month
      .numInputWrapper
      input, .flatpickr-current-month .flatpickr-monthDropdown-months) {
    font-size: 13px;
    font-weight: 400;
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='9' height='4' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='333' fill-rule='evenodd' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
      no-repeat 99.2%;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    padding-right: 15px;
  }

  :global(.flatpickr-current-month
      .numInputWrapper
      input, .flatpickr-current-month .flatpickr-monthDropdown-months:hover) {
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='9' height='4' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='333' fill-rule='evenodd' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")
      no-repeat 99.2%;
  }

  :global(.flatpickr-current-month .numInputWrapper:hover input.cur-year) {
    background: none;
  }

  :global(.flatpickr-current-month .numInputWrapper span.arrowUp:after) {
    border-bottom-color: #333;
  }
  :global(.flatpickr-current-month .numInputWrapper span.arrowDown:after) {
    border-top-color: #333;
  }

  :global(.flatpickr-days, .flatpickr-days .dayContainer) {
    margin: auto;
  }

  :global(.flatpickr-rContainer) {
    width: 100%;
  }

  :global(.flatpickr-months .flatpickr-next-month svg, .flatpickr-months
      .flatpickr-prev-month
      svg) {
    fill: #333;
  }

  :global(.flatpickr-months .flatpickr-next-month:hover svg, .flatpickr-months
      .flatpickr-prev-month:hover
      svg) {
    fill: #b5b5b5;
  }

  :global(.flatpickr-current-month
      input.cur-year[disabled]
      + span, .flatpickr-current-month input.cur-year[disabled] + span + span) {
    display: none;
  }

  :global(.numInputWrapper:hover, .flatpickr-current-month
      .flatpickr-monthDropdown-months:hover) {
    background-color: unset !important;
  }

  :global(.flatpickr-calendar.arrowTop:before, .flatpickr-calendar.arrowTop:after, .flatpickr-calendar.arrowTop:before, .flatpickr-calendar.arrowTop:after) {
    opacity: 0;
  }
</style>

{#if showDatePicker}
  <Overlay onClick={onCancelClick} />
{/if}
<section bind:this={dateRangeInput} class={showDatePicker ? 'active' : ''}>
  <div
    class="date-range-inputs"
    data-testid="date-range-inputs"
    on:click={onInputClick}>
    <div class="date-selection">
      <Icon icon={CalendarIcon} className="calendar-icon" />
      <input bind:this={fromInput} placeholder="Pick a start date" readonly />
    </div>
    <div class="date-selection">
      <Icon icon={CalendarIcon} className="calendar-icon" />
      <input bind:this={toInput} placeholder="Pick an end date" readonly />
    </div>
  </div>
  {#if showDatePicker}
    <div class="date-picker-popup" style={datePickerPopupPositionStyle}>
      <div class="chips">
        {#each dateRangeChips as chip}
          <Chip
            on:click={() => onChipClick(chip)}
            label={chip.label}
            active={chip === activeChip} />
        {/each}
      </div>
      <SvelteFlatpickr
        options={flatpickrOptions}
        bind:this={svleteFlatPickrElement}
        bind:value={flatPickrDate}
        hidden="hidden" />
      <div class="date-picker-footer">
        <Button
          onClick={onOkClick}
          bind:button={okButton}
          disabled={isOkButtonDisabled}>
          OK
        </Button>
      </div>
    </div>
  {/if}
</section>
