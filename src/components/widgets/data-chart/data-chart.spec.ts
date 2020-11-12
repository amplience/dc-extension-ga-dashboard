import { render } from '@testing-library/svelte';
import DataChart from './data-chart.svelte';
import { tick } from 'svelte';
import { dateRange } from '../../../stores/date-range';
import { ChartType, getDataChart } from '../../../stores/gapi';
import {
  editionIdMapping,
  setGaConfig,
} from '../../../stores/google-analytics';
import { selectedEdition } from '../../../stores/selected-edition';
import { Edition } from 'dc-management-sdk-js';

const mockDataChartSet = jest.fn();
const mockDataChartExecute = jest.fn();

jest.mock('../../../stores/gapi', () => ({
  ...jest.requireActual('../../../stores/gapi'),
  getDataChart: jest.fn().mockImplementation(() => ({
    set: mockDataChartSet,
    execute: mockDataChartExecute,
  })),
}));

describe('DataChart', () => {
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
  describe('overview chart', () => {
    const dataChartOptions = {
      className: 'overview',
      title: 'Overview',
      dimensions: 'ga:date',
      chartType: ChartType.LINE,
    };
    it('should render the DataChart component', async () => {
      const { container } = render(DataChart, dataChartOptions);
      await tick();

      expect(mockDataChartExecute).toHaveBeenCalled();
      expect((getDataChart as jest.Mock).mock.calls).toMatchSnapshot();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should update the chart when the dateRange changes', async () => {
      render(DataChart, dataChartOptions);
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
      render(DataChart, dataChartOptions);
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

  describe('breakdown chart', () => {
    const dataChartOptions = {
      className: 'breakdown',
      title: 'Breakdown',
      dimensions: 'ga:deviceCategory',
      chartType: ChartType.BAR,
    };
    it('should render the DataChart component', async () => {
      const { container } = render(DataChart, dataChartOptions);
      await tick();

      expect(mockDataChartExecute).toHaveBeenCalled();
      expect((getDataChart as jest.Mock).mock.calls).toMatchSnapshot();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should update the chart when the dateRange changes', async () => {
      render(DataChart, dataChartOptions);
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
      render(DataChart, dataChartOptions);
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
});
