import { tick } from 'svelte';
import { render } from '@testing-library/svelte';
import TopContentReport from './top-content-report.svelte';

const mockDataChartOn = jest.fn();
const mockDataChartSet = jest.fn();
const mockDataChartExecute = jest.fn();
const mockData = jest.fn().mockImplementation(() => ({
  on: mockDataChartOn,
  set: mockDataChartSet,
  execute: mockDataChartExecute,
}));

jest.mock('../../../services/gapi/gapi', () => ({
  getGAPI: () => {
    return {
      analytics: {
        ready: (fn) => fn(),
        report: {
          Data: mockData,
        },
      },
    };
  },
}));

describe('TopContentReport', () => {
  it('should render the TopContentReport component', async () => {
    const { container } = render(TopContentReport, {});

    await tick();
    expect(container.firstChild).toMatchSnapshot();
  });
});
