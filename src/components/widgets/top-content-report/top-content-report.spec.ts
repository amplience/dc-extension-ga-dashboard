import { tick } from 'svelte';
import { fireEvent, getByText, render } from '@testing-library/svelte';
import TopContentReport from './top-content-report.svelte';
import { dateRange } from '../../../stores/date-range';
import {
  breakdown,
  contentItemIdMapping,
  editionIdMapping,
  gaViewId,
} from '../../../stores/google-analytics';
import { topContentReportShowCount } from '../../../stores/widget-settings';
import { selectedEdition } from '../../../stores/selected-edition';
import { Edition } from 'dc-management-sdk-js';
import { managementSdkService } from '../../../stores/dynamic-content';
import type { ManagementSdkService } from '../../../services/management-sdk/management-sdk.service';
import { backOff } from 'exponential-backoff';
import { getReportData } from '../../../services/gapi/get-report-data.service';

jest.mock('exponential-backoff');
(backOff as jest.Mock).mockImplementation((fn) => fn());

jest.mock('../../../services/gapi/get-report-data.service');

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
    (getReportData as jest.Mock).mockImplementation(() =>
      Promise.resolve([['dimension', 1, 100, 1, 100, 1, 1]])
    );
    const { container } = render(TopContentReport, {});

    // loading state
    expect(container.firstChild).toMatchSnapshot();

    await tick();
    await tick();
    await tick();

    // loaded (not expanded)
    expect(container.firstChild).toMatchSnapshot();
    fireEvent.click(getByText(container, 'dimension'));

    await tick();
    await tick();
    await tick();
    await tick();

    // loaded and expanded
    expect(container.firstChild).toMatchSnapshot();

    expect((getReportData as jest.Mock).mock.calls).toMatchSnapshot();
    expect(getReportData as jest.Mock).toBeCalledTimes(3);
  });
});
