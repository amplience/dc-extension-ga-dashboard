import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import TopContentReport from './top-editions-report.svelte';

const mockDataReportSet = jest.fn();
const mockDataReportExecute = jest.fn();

jest.mock('../../../stores/gapi', () => ({
  ...jest.requireActual('../../../stores/gapi'),
  getDataReport: jest.fn().mockImplementation(() => ({
    set: mockDataReportSet,
    execute: mockDataReportExecute,
    on: jest.fn(),
  })),
}));

describe('TopContentReport', () => {
  it('should render the TopContentReport component', async () => {
    const { container } = render(TopContentReport, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });
});
