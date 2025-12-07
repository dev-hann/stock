export default abstract class ApiClient {
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  protected baseUrl: string;
  async get<T>(params: Record<string, string>): Promise<T> {
    try {
      const searchParams = new URLSearchParams(params);
      const url = `${this.baseUrl}?${searchParams.toString()}`;
      const response = await fetch(url);

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
