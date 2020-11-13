/* eslint-disable @typescript-eslint/no-empty-function */

import { HttpMethod, HttpClient } from 'dc-management-sdk-js';
import HttpClientInFlightCache from './http-client-in-flight-cache';

describe('HttpClientInFlightCache', () => {
  const fakeHttpClient = {
    request: jest.fn(() => new Promise(() => {})),
  };

  beforeEach(() => jest.clearAllMocks());

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('should not cache POST requests', () => {
    const cache = new HttpClientInFlightCache(
      (fakeHttpClient as unknown) as HttpClient,
      1000
    );

    const request1 = { method: HttpMethod.POST, url: 'http://example.com/1' };
    const request2 = { method: HttpMethod.POST, url: 'http://example.com/1' };

    cache.request(request1);
    cache.request(request2);

    expect(fakeHttpClient.request).toHaveBeenCalledTimes(2);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request1);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request2);
  });

  it('should not cache PATCH requests', () => {
    const cache = new HttpClientInFlightCache(
      (fakeHttpClient as unknown) as HttpClient,
      1000
    );

    const request1 = { method: HttpMethod.PATCH, url: 'http://example.com/1' };
    const request2 = { method: HttpMethod.PATCH, url: 'http://example.com/1' };

    cache.request(request1);
    cache.request(request2);

    expect(fakeHttpClient.request).toHaveBeenCalledTimes(2);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request1);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request2);
  });

  it('should not cache DELETE requests', () => {
    const cache = new HttpClientInFlightCache(
      (fakeHttpClient as unknown) as HttpClient,
      1000
    );

    const request1 = { method: HttpMethod.DELETE, url: 'http://example.com/1' };
    const request2 = { method: HttpMethod.DELETE, url: 'http://example.com/1' };

    cache.request(request1);
    cache.request(request2);

    expect(fakeHttpClient.request).toHaveBeenCalledTimes(2);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request1);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request2);
  });

  it('should not cache PUT requests', () => {
    const cache = new HttpClientInFlightCache(
      (fakeHttpClient as unknown) as HttpClient,
      1000
    );

    const request1 = { method: HttpMethod.PUT, url: 'http://example.com/1' };
    const request2 = { method: HttpMethod.PUT, url: 'http://example.com/1' };

    cache.request(request1);
    cache.request(request2);

    expect(fakeHttpClient.request).toHaveBeenCalledTimes(2);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request1);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request2);
  });

  it('should cache GET requests', () => {
    const cache = new HttpClientInFlightCache(
      (fakeHttpClient as unknown) as HttpClient,
      1000
    );

    const request1 = { method: HttpMethod.GET, url: 'http://example.com/1' };
    const request2 = { method: HttpMethod.GET, url: 'http://example.com/1' };

    cache.request(request1);
    cache.request(request2);

    expect(fakeHttpClient.request).toHaveBeenCalledTimes(1);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request1);
  });

  it('should expire cache after cache duration', async () => {
    fakeHttpClient.request.mockImplementation(
      () => new Promise((resolve) => resolve())
    );

    const cache = new HttpClientInFlightCache(
      (fakeHttpClient as unknown) as HttpClient,
      1000
    );

    const request1 = { method: HttpMethod.GET, url: 'http://example.com/1' };
    const request2 = { method: HttpMethod.GET, url: 'http://example.com/1' };

    await cache.request(request1);
    await cache.request(request2);

    expect(fakeHttpClient.request).toHaveBeenCalledTimes(1);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request1);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    jest.clearAllMocks();
    jest.runAllTimers();

    const request3 = { method: HttpMethod.GET, url: 'http://example.com/1' };

    cache.request(request3);

    expect(fakeHttpClient.request).toHaveBeenCalledTimes(1);
    expect(fakeHttpClient.request).toHaveBeenCalledWith(request1);
  });
});
