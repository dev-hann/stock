import ApiClient, { ApiClientOptions } from "./api-client";

export default class YahooFinanceApiClient extends ApiClient {
  constructor() {
    let baseUrl: string;

    if (typeof window !== "undefined") {
      // Client-side: use relative path
      baseUrl = "/api";
    } else {
      // Server-side
      if (process.env.VERCEL_URL) {
        // Vercel environment
        baseUrl = `https://${process.env.VERCEL_URL}/api`;
      } else {
        // Local development environment
        baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      }
    }

    super(baseUrl);
  }

  async get<T>(
    endpoint: string,
    params: Record<string, string> = {},
    options?: ApiClientOptions,
  ): Promise<T> {
    console.log(`GET ${endpoint}`);
    return super.get(endpoint, params, options);
  }
}
