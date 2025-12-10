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

      const fetchOptions: RequestInit = {};

      if (options?.cache) {
        fetchOptions.cache = options.cache;
      }

      if (options?.revalidate !== undefined) {
        fetchOptions.next = { revalidate: options.revalidate };
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Client Error:", error);
      throw error;
    }
  }
}
