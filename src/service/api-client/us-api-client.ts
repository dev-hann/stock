import ApiClient, { ApiClientOptions } from "./api-client";

export default class USApiClient extends ApiClient {
  apiKey: string;

  constructor(apiKey: string) {
    super("https://www.alphavantage.co/query");
    this.apiKey = apiKey;
  }

  async get<T>(
    params: Record<string, string>,
    options?: ApiClientOptions,
  ): Promise<T> {
    params["apikey"] = this.apiKey;
    return super.get(params, options);
  }

  async getStockOverview(
    symbol: string,
    options?: ApiClientOptions,
  ): Promise<any> {
    return this.get(
      {
        function: "OVERVIEW",
        symbol: symbol,
      },
      options,
    );
  }
}
