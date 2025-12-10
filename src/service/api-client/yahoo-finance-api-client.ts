import ApiClient, { ApiClientOptions } from "./api-client";

export default class YahooFinanceApiClient extends ApiClient {
  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    super(baseUrl);
  }

  async get<T>(
    endpoint: string,
    params: Record<string, string> = {},
    options?: ApiClientOptions,
  ): Promise<T> {
    return super.get(endpoint, params, options);
  }
}
