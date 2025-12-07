import ApiClient from "./api-client";

export default class USApiClient extends ApiClient {
  apiKey: string;

  constructor(apiKey: string) {
    super("https://www.alphavantage.co/query");
    this.apiKey = apiKey;
  }

  async get<T>(params: Record<string, string>): Promise<T> {
    params["apikey"] = this.apiKey;
    return super.get(params);
  }

  async getStockOverview(symbol: string): Promise<any> {
    return this.get({
      function: "OVERVIEW",
      symbol: symbol,
    });
  }

  async getTimeSeriesDaily(symbol: string): Promise<any> {
    return this.get({
      function: "TIME_SERIES_DAILY",
      symbol: symbol,
      outputsize: "compact", // Last 100 data points
    });
  }
}
