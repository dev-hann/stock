import ApiClient, { ApiClientOptions } from "./api-client";

export default class YahooFinanceApiClient extends ApiClient {
  constructor() {
    // Server-side: use absolute URL with localhost
    // Client-side: use relative path
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
        : "/api";
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
