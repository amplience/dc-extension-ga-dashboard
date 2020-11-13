import {
  HttpClient,
  HttpMethod,
  HttpRequest,
  HttpResponse,
} from 'dc-management-sdk-js';

export default class HttpClientInFlightCache implements HttpClient {
  private inFlightPromises: Record<string, Promise<HttpResponse>> = {};

  constructor(
    private readonly httpClient: HttpClient,
    private readonly cacheDuration: number
  ) {}

  async request(request: HttpRequest): Promise<HttpResponse> {
    const cacheKey = this.getCacheKey(request);
    if (!cacheKey) {
      return this.httpClient.request(request);
    }

    if (this.inFlightPromises[cacheKey]) {
      return this.inFlightPromises[cacheKey];
    }

    this.inFlightPromises[cacheKey] = this.httpClient.request(request);
    this.inFlightPromises[cacheKey].finally(() =>
      setTimeout(
        () => delete this.inFlightPromises[cacheKey],
        this.cacheDuration
      )
    );

    return this.inFlightPromises[cacheKey];
  }

  private getCacheKey(request: HttpRequest): string | false {
    if (request.method !== HttpMethod.GET) {
      return false;
    }

    return `${request.method}-${request.url}`;
  }
}
