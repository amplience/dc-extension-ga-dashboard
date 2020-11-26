import { get } from 'svelte/store';
import gapi, { initGapi } from './gapi';

describe('gapi store', () => {
  describe('initGapi()', () => {
    let windowSpy;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
      gapi.set(null);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it.skip('should set the gapi store if there is a global gapi instance', async () => {
      (windowSpy as jest.Mock).mockImplementation(() => ({
        gapi: {
          analytics: {
            ready: (fn) => fn(),
          },
        },
      }));
      await initGapi();
      expect(get(gapi)).toMatchInlineSnapshot(`
        Object {
          "analytics": Object {
            "ready": [Function],
          },
        }
      `);
    });
    it('should thow an error when no global gapi instance exists', async () => {
      (windowSpy as jest.Mock).mockImplementation(() => ({}));

      await expect(() => initGapi()).rejects.toMatchInlineSnapshot(
        `[Error: Unable to initialize gapi: missing gapi instance]`
      );
    });
  });
});
