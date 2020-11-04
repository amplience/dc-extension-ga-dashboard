import { generateCsvBlob, createDownloadElement } from './download-csv.service';
import { json2csvAsync } from 'json-2-csv';

jest.mock('json-2-csv');

describe('generateCsvBlob', () => {
  it('should return a csv blob generated from an object', async () => {
    const blob = await generateCsvBlob({ test: 'blob data' });

    expect(json2csvAsync).toHaveBeenCalledWith({ test: 'blob data' });
    expect(blob).toBeInstanceOf(Blob);
  });
});

describe('createDownloadElement', () => {
  it('should return a csv blob generated from an object', async () => {
    const createObjectURLMock = jest
      .fn()
      .mockImplementation(() => 'mocked-url');
    global.URL.createObjectURL = createObjectURLMock;
    const setAttributeMock = jest.fn();
    const createElementMock = jest.fn().mockImplementation(() => {
      return {
        setAttribute: setAttributeMock,
        style: {},
      };
    });
    global.document.createElement = createElementMock;

    const blob = new Blob(['test,csv']);
    const fileName = 'test-filename';

    const element = createDownloadElement(blob, fileName);

    expect(setAttributeMock).toHaveBeenCalledTimes(2);
    expect(setAttributeMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "href",
          "mocked-url",
        ],
        Array [
          "download",
          "test-filename",
        ],
      ]
    `);
    expect(element.style).toMatchInlineSnapshot(`
      Object {
        "visibility": "hidden",
      }
    `);
  });
});
