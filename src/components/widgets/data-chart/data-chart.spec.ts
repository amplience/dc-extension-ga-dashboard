import { render } from '@testing-library/svelte';
import DataChart from './data-chart.svelte';
import { tick } from 'svelte';
import { dateRange } from '../../../stores/date-range';
import { editionIdMapping } from '../../../stores/google-analytics';
import { selectedEdition } from '../../../stores/filter/selected-edition';
import { Edition } from 'dc-management-sdk-js';
import { backOff } from 'exponential-backoff';
import { initialiseStores } from '../../../services/stores/initialise';
import {
  FILTERS,
  selectedFilter,
} from '../../../stores/filter/selected-filter';
import {
  ChartType,
  insertDataChart,
} from '../../../services/gapi/insert-data-chart.service';
import gapi from '../../../stores/gapi';
import type { GoogleAnalyticsEmbedAPI } from '../../../definitions/google-analytics-embed-api';

jest.mock('exponential-backoff');
(backOff as jest.Mock).mockImplementation((fn) => fn());

jest.mock('../../../services/gapi/insert-data-chart.service');

describe('DataChart', () => {
  beforeEach(() => {
    gapi.set({} as GoogleAnalyticsEmbedAPI);
    selectedFilter.set(null);
    selectedEdition.set(null);
    dateRange.set({ from: '2020-11-01', to: '2020-11-02' });
    initialiseStores({
      googleAnalyticsViewId: 'ga:1234567890',
      googleAnalyticsClientId: '1234567890',
      mappings: {
        contentItemId: 'ga:dimension1',
        editionId: 'ga:dimension2',
        slotId: 'ga:dimension3',
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
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

      expect((insertDataChart as jest.Mock).mock.calls).toMatchSnapshot();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should update the chart when the dateRange changes', async () => {
      render(DataChart, dataChartOptions);
      await tick();

      dateRange.set({ from: '2020-01-01', to: '2020-01-02' });
      await tick();

      expect(insertDataChart).toHaveBeenCalledTimes(2);
      expect((insertDataChart as jest.Mock).mock.calls).toMatchSnapshot();
    });

    it('should update the chart when the selectedEdition changes', async () => {
      editionIdMapping.set('ga:dimension2');
      render(DataChart, dataChartOptions);
      await tick();
      selectedFilter.set(FILTERS.EDITION);
      selectedEdition.set(new Edition({ id: 'editionId' }));
      await tick();

      expect(insertDataChart).toHaveBeenCalledTimes(2);
      expect((insertDataChart as jest.Mock).mock.calls).toMatchSnapshot();
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

      expect((insertDataChart as jest.Mock).mock.calls).toMatchSnapshot();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should update the chart when the dateRange changes', async () => {
      render(DataChart, dataChartOptions);
      await tick();

      dateRange.set({ from: '2020-01-01', to: '2020-01-02' });
      await tick();

      expect(insertDataChart).toHaveBeenCalledTimes(2);
      expect((insertDataChart as jest.Mock).mock.calls).toMatchSnapshot();
    });

    it('should update the chart when the selectedEdition changes', async () => {
      editionIdMapping.set('ga:dimension2');
      render(DataChart, dataChartOptions);
      await tick();

      selectedFilter.set(FILTERS.EDITION);
      selectedEdition.set(new Edition({ id: 'editionId' }));
      await tick();

      expect(insertDataChart).toHaveBeenCalledTimes(2);
      expect((insertDataChart as jest.Mock).mock.calls).toMatchSnapshot();
    });
  });
});
