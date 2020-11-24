import { tick } from 'svelte';
import { fireEvent, getByText, render } from '@testing-library/svelte';
import TopContentReport from './top-content-report.svelte';
import { getDataReport } from '../../../stores/gapi';
import { dateRange } from '../../../stores/date-range';
import {
  breakdown,
  contentItemIdMapping,
  editionIdMapping,
  gaViewId,
} from '../../../stores/google-analytics';
import { topContentReportShowCount } from '../../../stores/widget-settings';
import { selectedEdition } from '../../../stores/filter/selected-edition';
import { Edition } from 'dc-management-sdk-js';
import { managementSdkService } from '../../../stores/dynamic-content';
import type { ManagementSdkService } from '../../../services/management-sdk/management-sdk.service';
import { backOff } from 'exponential-backoff';
import {
  FILTERS,
  selectedFilter,
} from '../../../stores/filter/selected-filter';

jest.mock('exponential-backoff');
(backOff as jest.Mock).mockImplementation((fn) => fn());

jest.mock('../../../stores/gapi', function () {
  return {
    ...jest.requireActual('../../../stores/gapi'),
    getDataReport: jest.fn(),
  };
});

describe('TopContentReport', () => {
  beforeEach(() => {
    dateRange.set({ from: '2020-11-01', to: '2020-11-02' });
    breakdown.set({
      title: 'BREAKDOWN_CHART_TITLE',
      dimension: 'BREAKDOWN_CHART_DIMENSION',
    });
    gaViewId.set('GA_VIEW_ID');
    contentItemIdMapping.set('CONTENT_ID_MAPPING');
    topContentReportShowCount.set(5);
    dateRange.set({ from: '2020-01-01', to: '2020-12-31' });
    selectedFilter.set(FILTERS.EDITION);
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
    await tick();

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText(container, 'dimension'));

    await tick();
    await tick();
    await tick();

    expect(container.firstChild).toMatchSnapshot();

    expect((getDataReport as jest.Mock).mock.calls).toMatchSnapshot();
    expect(getDataReport as jest.Mock).toBeCalledTimes(3);
  });
});
