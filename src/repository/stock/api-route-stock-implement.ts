import Stock from "../../domain/stock/stock";
import StockDetail from "../../domain/stock/stock-detail";
import {
  TimeSeriesDataPoint,
  TimeSeriesType,
} from "../../domain/stock/time-series";
import StockRepository from "./stock-repository";

export default class ApiRouteStockImplement implements StockRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  }

  async search(query: string): Promise<Stock[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/search?q=${encodeURIComponent(query)}`,
        {
          next: { revalidate: 300 },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("[ApiRoute] Error searching:", error);
      return [];
    }
  }

  async getDetail(symbol: string): Promise<StockDetail> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/detail?symbol=${encodeURIComponent(symbol)}`,
        {
          next: { revalidate: 3600 },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[ApiRoute] Error fetching detail for ${symbol}:`, error);
      throw error;
    }
  }

  async getTimeSeries(
    symbol: string,
    type: TimeSeriesType,
  ): Promise<TimeSeriesDataPoint[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/chart?symbol=${encodeURIComponent(symbol)}&type=${type}`,
        {
          next: { revalidate: 600 },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `[ApiRoute] Error fetching time series for ${symbol}:`,
        error,
      );
      return [];
    }
  }
}
