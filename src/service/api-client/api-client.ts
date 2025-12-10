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
        `[API] ${params.function} ${params.symbol || params.keywords || ""}`,
      );

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
          `[API Error] HTTP ${response.status}: ${response.statusText}`,
        );
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data["Error Message"]) {
        console.error(`[API Error] ${data["Error Message"]}`);
      }
      if (data["Note"]) {
        console.warn(`[API Rate Limit] ${data["Note"]}`);
      }
      if (data["Information"]) {
        console.warn(`[API Info] ${data["Information"]}`);
      }

      return data;
    } catch (error) {
      console.error("[API Error]", error);
      throw error;
    }
  }
}
