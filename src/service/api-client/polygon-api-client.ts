import ApiClient, { ApiClientOptions } from "./api-client";

export default class PolygonApiClient extends ApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    super("https://api.polygon.io");
    this.apiKey = apiKey;
  }

  async get<T>(
    endpoint: string,
    params: Record<string, string> = {},
    options?: ApiClientOptions,
  ): Promise<T> {
    params["apiKey"] = this.apiKey;
    return super.get(endpoint, params, options);
  }

  async searchTickers(query: string, options?: ApiClientOptions): Promise<any> {
    return this.get(
      "/v3/reference/tickers",
      {
        search: query,
        active: "true",
        limit: "10",
        market: "stocks",
      },
      options,
    );
  }

  async getTickerDetails(
    symbol: string,
    options?: ApiClientOptions,
  ): Promise<any> {
    return this.get(`/v3/reference/tickers/${symbol}`, {}, options);
  }

  async getAggregates(
    symbol: string,
    multiplier: number,
    timespan: string,
    from: string,
    to: string,
    options?: ApiClientOptions,
  ): Promise<any> {
    return this.get(
      `/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`,
      {
        adjusted: "true",
        sort: "asc",
      },
      options,
    );
  }

  async getPreviousClose(
    symbol: string,
    options?: ApiClientOptions,
  ): Promise<any> {
    return this.get(
      `/v2/aggs/ticker/${symbol}/prev`,
      {
        adjusted: "true",
      },
      options,
    );
  }
}
