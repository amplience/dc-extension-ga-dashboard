import { render } from '@testing-library/svelte';
import Overview from './overview.svelte';
import { tick } from 'svelte';
import { dateRange } from '../../../stores/date-range';
import {
  editionIdMapping,
  setGaConfig,
} from '../../../stores/google-analytics';
import { selectedEdition } from '../../../stores/selected-edition';
import { Edition } from 'dc-management-sdk-js';

const mockDataChartSet = jest.fn();
const mockDataChartExecute = jest.fn();
const mockDataChart = jest.fn().mockImplementation(() => ({
  set: mockDataChartSet,
  execute: mockDataChartExecute,
}));

jest.mock('../../../services/gapi/gapi', () => ({
  getGAPI: () => {
    return {
      analytics: {
        ready: (fn) => fn(),
        googleCharts: {
          DataChart: mockDataChart,
        },
      },
    };
  },
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

    expect(mockDataChart.mock.calls[0]).toMatchSnapshot();
    expect(mockDataChartExecute).toHaveBeenCalled();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should update the chart when the dateRange changes', async () => {
    render(Overview, {});
    await tick();

    dateRange.set({ from: '2020-01-01', to: '2020-01-02' });
    await tick();
    expect(mockDataChartSet).toBeCalledWith({
      query: {
        'end-date': '2020-01-02',
        'start-date': '2020-01-01',
        filters: null,
      },
    });
    expect(mockDataChartExecute).toHaveBeenCalled();
  });

  it('should update the chart when the selectedEdition changes', async () => {
    editionIdMapping.set('dimension2');
    render(Overview, {});
    await tick();

    selectedEdition.set(new Edition({ id: 'editionId' }));
    await tick();
    expect(mockDataChartSet).toBeCalledWith({
      query: {
        'end-date': '2020-11-02',
        'start-date': '2020-11-01',
        filters: 'ga:dimension2==editionId',
      },
    });
    expect(mockDataChartExecute).toHaveBeenCalled();
  });
});
