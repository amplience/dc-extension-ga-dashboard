import { tick } from 'svelte';
import {
  fireEvent,
  getByTestId,
  getByText,
  render,
} from '@testing-library/svelte';
import TopContentReport from './top-content-report.svelte';
import { getDataReport, RequestTimeout } from '../../../stores/gapi';
import { dateRange } from '../../../stores/date-range';
import {
  breakdownChart,
  contentItemIdMapping,
  editionIdMapping,
  gaViewId,
} from '../../../stores/google-analytics';
import { topContentReportShowCount } from '../../../stores/widget-settings';
import { selectedEdition } from '../../../stores/selected-edition';
import { Edition } from 'dc-management-sdk-js';
import { managementSdkService } from '../../../stores/dynamic-content';
import type { ManagementSdkService } from '../../../services/management-sdk/management-sdk.service';

jest.mock('../../../stores/gapi', function () {
  return {
    ...jest.requireActual('../../../stores/gapi'),
    getDataReport: jest.fn(),
  };
});

describe('TopContentReport', () => {
  beforeEach(() => {
    dateRange.set({ from: '2020-11-01', to: '2020-11-02' });
    breakdownChart.set({
      title: 'BREAKDOWN_CHART_TITLE',
      dimension: 'BREAKDOWN_CHART_DIMENSION',
    });
    gaViewId.set('GA_VIEW_ID');
    contentItemIdMapping.set('CONTENT_ID_MAPPING');
    topContentReportShowCount.set(5);
    dateRange.set({ from: '2020-01-01', to: '2020-12-31' });
    selectedEdition.set(new Edition({ id: 'EDITION_ID' }));
    editionIdMapping.set('EDITION_ID_MAPPING');
    managementSdkService.set(({
      getAppLinkForResource: () => Promise.reject(),
    } as unknown) as ManagementSdkService);
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should render the TopContentReport component', async () => {
    (getDataReport as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        rows: [['dimension', 1, 1, 1, 1]],
        totalsForAllResults: {
          'ga:totalEvents': 1,
          'ga:uniqueEvents': 1,
        },
      })
    );
    const { container } = render(TopContentReport, {});

    await tick();
    await tick();

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText(container, 'dimension'));

    await tick();
    await tick();

    expect(container.firstChild).toMatchSnapshot();

    expect((getDataReport as jest.Mock).mock.calls).toMatchSnapshot();
    expect(getDataReport as jest.Mock).toBeCalledTimes(3);
  });

  it('should retry getting report data when we get a timeout back', async () => {
    (getDataReport as jest.Mock).mockImplementation(() =>
      Promise.reject(new RequestTimeout('GAPI request timeout'))
    );
    const { container } = render(TopContentReport, {});

    await tick();
    await tick();

    expect((getDataReport as jest.Mock).mock.calls).toMatchSnapshot();
    expect(getDataReport as jest.Mock).toBeCalledTimes(4);
    expect(container.firstChild).toMatchSnapshot();
  });
});
