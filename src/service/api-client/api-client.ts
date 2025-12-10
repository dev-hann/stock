export interface ApiClientOptions {
  cache?: RequestCache;
  revalidate?: number | false;
}

export default abstract class ApiClient {
  protected abstract get baseUrl(): string;

  async get<T>(
    paramsOrEndpoint: Record<string, string> | string,
    optionsOrParams?: ApiClientOptions | Record<string, string>,
    maybeOptions?: ApiClientOptions,
  ): Promise<T> {
    try {
      let url: string;
      const fetchOptions: RequestInit = {};

      if (typeof paramsOrEndpoint === "string") {
        const endpoint = paramsOrEndpoint;
        const params = (optionsOrParams as Record<string, string>) || {};
        const options = maybeOptions;

        const searchParams = new URLSearchParams(params);
        url = `${this.baseUrl}${endpoint}?${searchParams.toString()}`;

        if (options?.cache) {
          fetchOptions.cache = options.cache;
        }

        if (options?.revalidate !== undefined) {
          fetchOptions.next = { revalidate: options.revalidate };
        }
      } else {
        const params = paramsOrEndpoint;
        const options = optionsOrParams as ApiClientOptions | undefined;

        const searchParams = new URLSearchParams(params);
        url = `${this.baseUrl}?${searchParams.toString()}`;

        if (options?.cache) {
          fetchOptions.cache = options.cache;
        }

        if (options?.revalidate !== undefined) {
          fetchOptions.next = { revalidate: options.revalidate };
        }
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
