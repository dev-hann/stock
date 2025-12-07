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
}
