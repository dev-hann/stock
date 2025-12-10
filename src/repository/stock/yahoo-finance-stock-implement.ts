import Stock from "../../domain/stock/stock";
import StockDetail from "../../domain/stock/stock-detail";
import {
  TimeSeriesDataPoint,
  TimeSeriesType,
} from "../../domain/stock/time-series";
import StockRepository from "./stock-repository";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side, use relative path
    return "/api";
  }
  // Server-side
  if (process.env.VERCEL_URL) {
    // Vercel environment
    return `https://${process.env.VERCEL_URL}/api`;
  }
  // Local development
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
};

export default class YahooFinanceStockImplement implements StockRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  private async fetchData<T>(
    endpoint: string,
    params: Record<string, string>,
    options: { revalidate: number },
  ): Promise<T> {
    const searchParams = new URLSearchParams(params);
    const url = `${this.baseUrl}${endpoint}?${searchParams.toString()}`;

    const fetchOptions: RequestInit = {
      next: { revalidate: options.revalidate },
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      console.error(
        `[API Error] HTTP ${response.status}: ${response.statusText} on ${url}`,
      );
      const errorText = await response.text();
      console.error(`[API Error Body] ${errorText}`);
      throw new Error(
        `API Error: ${response.statusText}. Check server logs for more details.`,
      );
    }

    const data = await response.json();

    // Yahoo Finance API can return errors in the JSON body
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
  }

  async search(query: string): Promise<Stock[]> {
    try {
      const data = await this.fetchData<any[]>(
        "/stock/search",
        {
          q: query,
        },
        {
          revalidate: 300,
        },
      );

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item: any) => ({
        symbol: item.symbol,
        name: item.name,
        type: item.type,
        region: item.region,
        marketOpen: item.marketOpen || "",
        marketClose: item.marketClose || "",
        timezone: item.timezone || "",
        currency: item.currency || "USD",
        matchScore: item.matchScore || 1.0,
      }));
    } catch (error) {
      console.error("[YahooFinance] Error searching:", error);
      return [];
    }
  }

  async getDetail(symbol: string): Promise<StockDetail> {
    try {
      const data = await this.fetchData<any>(
        "/stock/detail",
        {
          symbol: symbol,
        },
        {
          revalidate: 3600,
        },
      );

      return {
        symbol: data.symbol || symbol,
        name: data.name || "",
        description: data.description || "",
        exchange: data.exchange || "",
        sector: data.sector || "",
        industry: data.industry || "",
        marketCap: data.marketCap || "0",
        peRatio: data.peRatio || "0",
        eps: data.eps || "0",
        weekHigh52: data.weekHigh52 || "0",
        weekLow52: data.weekLow52 || "0",
        dividendYield: data.dividendYield || "0",
        beta: data.beta || "0",
        revenue: data.revenue || "0",
        profitMargin: data.profitMargin || "0",
        operatingMargin: data.operatingMargin || "0",
        returnOnEquity: data.returnOnEquity || "0",
        country: data.country || "US",
        currency: data.currency || "USD",
      };
    } catch (error) {
      console.error(
        `[YahooFinance] Error fetching detail for ${symbol}:`,
        error,
      );
      throw error;
    }
  }

  async getTimeSeries(
    symbol: string,
    type: TimeSeriesType,
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const data = await this.fetchData<any[]>(
        "/stock/chart",
        {
          symbol: symbol,
          type: type,
        },
        {
          revalidate: 600,
        },
      );

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item: any) => ({
        date: item.date,
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
        volume: item.volume || 0,
      }));
    } catch (error) {
      console.error(
        `[YahooFinance] Error fetching time series for ${symbol}:`,
        error,
      );
      return [];
    }
  }
}