import { render, screen, fireEvent } from '@testing-library/svelte';
import DateRangePicker from './date-range-picker.svelte';
import { tick } from 'svelte';
import { dateRange } from '../../stores/date-range';
import { formatDateAsISOString } from '../../utils/date-format';

describe('DateRangePicker', () => {
  it('should render a DateRangePicker inputs with the given date range', async () => {
    dateRange.set({
      from: formatDateAsISOString(new Date('1/1/2020')),
      to: formatDateAsISOString(new Date('1/1/2020')),
    });
    const { container } = render(DateRangePicker);

    await tick();
    const fromInput = screen.getByPlaceholderText('Pick a start date');
    expect((fromInput as HTMLInputElement).value).toEqual('01/01/2020');
    const toInput = screen.getByPlaceholderText('Pick an end date');
    expect((toInput as HTMLInputElement).value).toEqual('01/01/2020');
    expect(container.firstChild).toMatchSnapshot();
  });

  it.skip('should render DateRangePicker calendar when inputs are clicked', async () => {
    // TODO: this test is not generating the correct snapshots due to SvelteFlatpickr
    // being imported as undefined when running through jest - needs further investigation
    const { container } = render(DateRangePicker, {
      dateRange: {
        from: new Date('1/1/2020'),
        to: new Date('1/1/2020'),
      },
    });

    const element = screen.getByTestId('date-range-inputs');

    await fireEvent.click(element);

    expect(container.firstChild).toMatchSnapshot();
  });
});
