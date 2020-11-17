import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import TopContentReport from './top-content-report.svelte';
import {
  getDataReport,
  processReportData,
  RequestTimeout,
} from '../../../stores/gapi';
import { dateRange } from '../../../stores/date-range';

jest.mock('../../../stores/gapi');

describe('TopContentReport', () => {
  beforeEach(() => {
    dateRange.set({ from: '2020-11-01', to: '2020-11-02' });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render the TopContentReport component', async () => {
    (getDataReport as jest.Mock).mockImplementation(() => ({
      rows: ['dimension', 1, 1, 1, 1],
      totalsForAllResults: {
        'ga:totalEvents': 1,
        'ga:uniqueEvents': 1,
      },
    }));
    (processReportData as jest.Mock).mockImplementation(jest.fn());
    const { container } = render(TopContentReport, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should retry getting report data when we get a timeout back', async () => {
    (getDataReport as jest.Mock).mockImplementation(() =>
      Promise.reject(new RequestTimeout('GAPI request timeout'))
    );
    const { container } = render(TopContentReport, {});

    await tick();
    await tick();

    expect((getDataReport as jest.Mock).mock.calls).toMatchSnapshot();
    expect(getDataReport as jest.Mock).toBeCalledTimes(2);
    expect(container.firstChild).toMatchSnapshot();
  });
});
