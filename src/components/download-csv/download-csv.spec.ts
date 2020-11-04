import { render, fireEvent, screen } from '@testing-library/svelte';
import DownloadCsv from './download-csv.svelte';
import { tick } from 'svelte';
import { generateCsvBlob, createDownloadElement } from './download-csv.service';

jest.mock('./download-csv.service');

describe('DownloadCsv', () => {
  it('should render the DownloadCsv component', () => {
    const { container } = render(DownloadCsv, {
      fileName: 'test-csv-filename',
      fetchCsvData: () => {
        /* noop */
      },
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the DownloadCsv component with a label', () => {
    const { container } = render(DownloadCsv, {
      fileName: 'test-csv-filename',
      label: 'test-label',
      fetchCsvData: () => {
        /* noop */
      },
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should trigger a csv download on click', async () => {
    (generateCsvBlob as jest.Mock).mockImplementation(
      () => new Blob(['test,blob'])
    );
    const clickMock = jest.fn();
    (createDownloadElement as jest.Mock).mockImplementation(() => {
      const anchor = document.createElement('a');
      anchor.click = clickMock;
      return anchor;
    });
    const fetchCsvDataMock = jest
      .fn()
      .mockImplementation(() => ({ testProp: 'test prop value' }));

    jest.spyOn(document.body, 'appendChild');
    jest.spyOn(document.body, 'removeChild');

    render(DownloadCsv, {
      fileName: 'test-csv-filename',
      fetchCsvData: fetchCsvDataMock,
    });

    const element = screen.getByTestId('download-csv-button');

    await fireEvent.click(element);
    await tick();

    expect(fetchCsvDataMock).toHaveBeenCalled();
    expect(generateCsvBlob).toHaveBeenCalled();
    expect(createDownloadElement).toHaveBeenCalledWith(
      expect.any(Blob),
      'test-csv-filename.csv'
    );
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
  });
});
