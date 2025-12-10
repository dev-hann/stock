export interface ApiClientOptions {
  cache?: RequestCache;
  revalidate?: number | false;
}

export default abstract class ApiClient {
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  protected baseUrl: string;

  async get<T>(
    params: Record<string, string>,
    options?: ApiClientOptions,
  ): Promise<T> {
    try {
      const searchParams = new URLSearchParams(params);
      const url = `${this.baseUrl}?${searchParams.toString()}`;

      console.log(
        `[API Client] Fetching: ${params.function} for ${params.symbol || params.keywords}`,
      );
      console.log(`[API Client] Cache options:`, options);

      const fetchOptions: RequestInit = {};

      if (options?.cache) {
        fetchOptions.cache = options.cache;
      }

      if (options?.revalidate !== undefined) {
        fetchOptions.next = { revalidate: options.revalidate };
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        console.error(
          `[API Client] HTTP Error: ${response.status} ${response.statusText}`,
        );
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[API Client] Response keys:`, Object.keys(data));

      if (data["Error Message"]) {
        console.error(`[API Client] API Error Message:`, data["Error Message"]);
      }
      if (data["Note"]) {
        console.warn(`[API Client] API Note (Rate Limit?):`, data["Note"]);
      }
      if (data["Information"]) {
        console.warn(`[API Client] API Information:`, data["Information"]);
      }

      return data;
    } catch (error) {
      console.error("[API Client] Error:", error);
      throw error;
    }
  }
}
