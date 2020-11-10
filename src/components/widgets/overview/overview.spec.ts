import { render } from '@testing-library/svelte';
import Overview from './overview.svelte';
import { tick } from 'svelte';
import { dateRange } from '../../../stores/date-range';
import { setGaConfig } from '../../../stores/google-analytics';
import { getDataChart } from '../../../stores/gapi';

const mockDataChartSet = jest.fn();
const mockDataChartExecute = jest.fn();

jest.mock('../../../stores/gapi', () => ({
  ...jest.requireActual('../../../stores/gapi'),
  getDataChart: jest.fn().mockImplementation(() => ({
    set: mockDataChartSet,
    execute: mockDataChartExecute,
  })),
}));

describe('Overview', () => {
  beforeEach(() => {
    dateRange.set({ from: '2020-11-01', to: '2020-11-02' });
    setGaConfig({
      googleAnalyticsViewId: '1234567890',
      googleAnalyticsClientId: '1234567890',
      mappings: {
        contentItemId: 'dimension1',
        editionId: 'dimension2',
        slotId: 'dimension3',
      },
    });
  });
  it('should render the Overview component', async () => {
    const { container } = render(Overview, {});
    await tick();

    expect(mockDataChartExecute).toHaveBeenCalled();
    expect((getDataChart as jest.Mock).mock.calls).toMatchSnapshot();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should update the chart when the dateRange changes', async () => {
    render(Overview, {});
    await tick();

    dateRange.set({ from: '2020-01-01', to: '2020-01-02' });
    await tick();
    expect(mockDataChartSet).toBeCalledWith({
      query: { 'end-date': '2020-01-02', 'start-date': '2020-01-01' },
    });
    expect(mockDataChartExecute).toHaveBeenCalled();
  });
});
